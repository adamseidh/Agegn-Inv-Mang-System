const db = require("../../../db");

const PurchaseList = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

  // Defaults - changed to use created_at DESC when no sort is specified
  _sort = _sort || "created_at"; // Default to created_at
  _order = _order === "desc" ? "DESC" : _sort === "created_at" ? "DESC" : "ASC"; // Default to DESC for created_at
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
    whereClause += ` AND (title LIKE '%${q}%' )`;
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

  // Updated valid sort columns to include created_at
  const validSortColumns = ["id", "amount", "created_at"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "created_at";
    _order = "DESC";
  }

  // Special handling for created_at to ensure DESC order by default
  if (_sort === "created_at" && !_order) {
    _order = "DESC";
  }

  const query = `
SELECT 
  PL.*, 
  s.name AS supplierName,u.name as user,
  CASE 
    WHEN SUM(CASE WHEN pp.payment_status != 'Completed' THEN 1 ELSE 0 END) > 0 THEN 'Not Completed'
    ELSE 'Completed'
  END AS payment_status,
  SUM(CASE WHEN pp.payment_status != 'Completed' THEN pp.amount ELSE 0 END) AS not_completed_amount
FROM purchase_list PL 
LEFT JOIN supplier s ON PL.supplier_id = s.id 
LEFT JOIN purchase_payment pp ON PL.id = pp.purchase_id
LEFT JOIN users u ON PL.userId = u.id
${whereClause}
GROUP BY PL.id
ORDER BY PL.created_at DESC
LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM purchase_list ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
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

const SinglePurchaseData = (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT 
    PL.*, 
    s.name AS supplierName,
    CASE 
      WHEN SUM(CASE WHEN pp.payment_status != 'Completed' THEN 1 ELSE 0 END) > 0 THEN 'Not Completed'
      ELSE 'Completed'
    END AS payment_status,
    SUM(CASE WHEN pp.payment_status != 'Completed' THEN pp.amount ELSE 0 END) AS not_completed_amount
  FROM purchase_list PL 
  LEFT JOIN supplier s ON PL.supplier_id = s.id 
  LEFT JOIN purchase_payment pp ON PL.id = pp.purchase_id WHERE PL.id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.json(results[0]); //
    }
  });
};
const CreateItem = (req, res) => {
  const { name, low_level, category_id, type_id, description, serverHost } =
    req.body;

  console.log("categroy id", category_id);
  console.log("server host", serverHost);
  const image = req.file ? req.file.filename : null;
  console.log("here is uploading image: ", image);

  const fullPath = `${serverHost}/images/${image}`;

  const query = `
        INSERT INTO items (name,low_level, category_id, type_id, description, image)
        VALUES (?, ?, ?, ?,?,?)
    `;

  const values = [
    name,
    low_level,
    category_id || "",
    type_id || "",
    description || "",
    fullPath,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log("error", err);
      return res.status(500).json({ error: err });
    }

    res.json({ id: result.insertId });
  });
};

const EditPurchase = (req, res) => {
  const { supplier, remark } = req.body;
  const { id } = req.params;
  console.log("supplire", supplier);
  console.log("remark", remark);

  const query = `
        UPDATE purchase_list 
        SET supplier_id = ?, remark = ? WHERE id = ?`;

  db.query(query, [supplier, remark, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ id: result.insertId });
  });
};

const deletePurchase = (req, res) => {
  const { id } = req.params;

  const deleteProductQuery = "DELETE FROM product_list WHERE purchase_id = ?";
  const deletePurchaseListQuery = "DELETE FROM purchase_list WHERE id = ?";
  const deletePurchasePaymentQuery =
    "DELETE FROM purchase_payment WHERE purchase_id = ?";

  // First delete from sells_product
  db.query(deleteProductQuery, [id], (err, result1) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error deleting products", details: err });
    }

    // Then delete from deletePurchaseList
    db.query(deletePurchaseListQuery, [id], (err, result2) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting order", details: err });
      }

      db.query(deletePurchasePaymentQuery, [id], (err, result2) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error deleting order", details: err });
        }

        if (result2.affectedRows === 0) {
          return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "data deleted successfully" });
      });
    });
  });
};

module.exports = {
  PurchaseList,
  SinglePurchaseData,
  CreateItem,
  EditPurchase,
  deletePurchase,
};
