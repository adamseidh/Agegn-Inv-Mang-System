const db = require("../../../db");

const SellsList = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

  // Defaults
  _sort = _sort || "created_at";
  _order = _order === "desc" ? "DESC" : _sort === "created_at" ? "DESC" : "ASC";
  _page = parseInt(_page, 10) || 1;
  _limit = parseInt(_limit, 10) || 10;
  let offset = (_page - 1) * _limit;

  if (range) {
    try {
      const rangeArray = JSON.parse(range);
      if (rangeArray.length === 2) {
        offset = rangeArray[0];
        _limit = rangeArray[1] - rangeArray[0] + 1;
      }
    } catch (err) {
      console.error("Error parsing range parameter:", err);
    }
  }

  let payment_status = null;
  let filterObj = {};
  if (filter) {
    try {
      filterObj = JSON.parse(decodeURIComponent(filter));
      payment_status = filterObj.payment_status || null;
      q = q || filterObj.q || null;
    } catch (err) {
      console.error("Error parsing filter JSON:", err);
    }
  }

  let whereClause = "WHERE 1 = 1";
  if (q) {
    whereClause += ` AND (c.name LIKE '%${q}%' OR SL.id LIKE '%${q}%')`;
  }

  if (payment_status) {
    whereClause += ` AND payment_status = '${payment_status}'`;
  }

  if (sort) {
    try {
      const sortArray = JSON.parse(sort);
      _sort = sortArray[0] || _sort;
      _order = sortArray[1] || _order;
    } catch (err) {
      console.error("Error parsing sort parameter:", err);
    }
  }

  const validSortColumns = ["id", "amount", "created_at", "customerName"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "created_at";
    _order = "DESC";
  }

  // Add the main filtering condition
  whereClause += ` AND (SL.sells_source != 'Client' OR (SL.sells_source = 'Client' AND SL.sells_status = 'Completed'))`;

  // Handle sorting column mapping
  let sortColumn;
  switch (_sort) {
    case "customerName":
      sortColumn = "c.name";
      break;
    case "created_at":
    case "amount":
    case "id":
      sortColumn = `SL.${_sort}`;
      break;
    default:
      sortColumn = "SL.created_at";
  }

  const query = `
  SELECT 
    SL.*, 
    c.name AS customerName, 
    u.name AS created_by,
    CASE 
      WHEN SUM(CASE WHEN sp.payment_status != 'Completed' THEN 1 ELSE 0 END) > 0 THEN 'Not Completed'
      ELSE 'Completed'
    END AS payment_status,
    SUM(CASE WHEN sp.payment_status != 'Completed' THEN sp.amount ELSE 0 END) AS not_completed_amount
  FROM sells_list SL
  LEFT JOIN customers c ON SL.customer_id = c.id
  LEFT JOIN sells_payment sp ON SL.id = sp.sells_id
  LEFT JOIN users u ON SL.userId = u.id
  ${whereClause}
  GROUP BY SL.id
   ORDER BY SL.created_at DESC
  LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      console.log("Error in query:", err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `
        SELECT COUNT(DISTINCT SL.id) AS total 
        FROM sells_list SL
        LEFT JOIN customers c ON SL.customer_id = c.id
        LEFT JOIN sells_payment sp ON SL.id = sp.sells_id
        ${whereClause}`;

      db.query(countQuery, (err, countResult) => {
        if (err) {
          console.log("Error in count query:", err);
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;
          res.setHeader(
            "Content-Range",
            `purchase_list ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const CustomerOrders = (req, res) => {
  const customerId = req.params.id;

  const query = `
    SELECT 
      SL.*, 
      c.name AS customerName
    FROM sells_list SL 
    LEFT JOIN customers c ON SL.customer_id = c.id 
    WHERE SL.customer_id = ?
    GROUP BY SL.id
    ORDER BY SL.created_at DESC;
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // Count total number of orders for this customer
      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM sells_list 
        WHERE customer_id = ?;
      `;

      db.query(countQuery, [customerId], (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // You can choose an actual offset if using pagination
          const offset = 0;

          res.setHeader(
            "Content-Range",
            `purchase_list ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");

          res.json(results);
        }
      });
    }
  });
};

const deleteOrder = (req, res) => {
  const { id } = req.params;

  const deleteProductQuery = "DELETE FROM sells_product WHERE sells_id = ?";
  const deleteSellsListQuery = "DELETE FROM sells_list WHERE id = ?";

  // First delete from sells_product
  db.query(deleteProductQuery, [id], (err, result1) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error deleting products", details: err });
    }

    // Then delete from sells_list
    db.query(deleteSellsListQuery, [id], (err, result2) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting order", details: err });
      }

      if (result2.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Order and its products deleted successfully" });
    });
  });
};

const deleteSales = (req, res) => {
  const { id } = req.params;

  const deleteProductQuery = "DELETE FROM sells_product WHERE sells_id = ?";
  const deleteSellsListQuery = "DELETE FROM sells_list WHERE id = ?";
  const deleteSellsPaymentQuery =
    "DELETE FROM sells_payment WHERE sells_id = ?";

  // First delete from sells_product
  db.query(deleteProductQuery, [id], (err, result1) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error deleting products", details: err });
    }

    // Then delete from sells_list
    db.query(deleteSellsListQuery, [id], (err, result2) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting order", details: err });
      }

      db.query(deleteSellsPaymentQuery, [id], (err, result2) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error deleting order", details: err });
        }

        res.json({ message: "data deleted successfully" });
      });
    });
  });
};

module.exports = {
  SellsList,
  deleteOrder,
  CustomerOrders,
  deleteSales,
};
