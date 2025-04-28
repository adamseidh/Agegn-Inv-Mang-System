const db = require("../../../db");
const { insertUserHistory } = require("../../Users/history");

const CustomerOrdes = (req, res) => {
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

  const validSortColumns = ["id", "amount", "created_at"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "created_at";
    _order = "DESC";
  }

  // Add the main filtering condition to fetch only the customers ordser from client side
  whereClause += ` AND (SL.sells_source = 'Client' )`;

  const query = `
    SELECT 
      SL.*, 
      c.name AS customerName, u.name as changedBy
    FROM sells_list SL 
    LEFT JOIN customers c ON SL.customer_id = c.id 
    LEFT JOIN users u ON SL.userId = u.id
    ${whereClause}
    GROUP BY SL.id
    ORDER BY SL.created_at DESC`;

  db.query(query, (err, results) => {
    if (err) {
      console.log("", err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM sells_list SL ${whereClause}`;
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

const CustomerSingleOrder = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;
  const { id } = req.params;

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

  const validSortColumns = ["id", "amount", "created_at"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "created_at";
    _order = "DESC";
  }

  // Add the main filtering condition to fetch only the customers ordser from client side
  whereClause += ` AND (SL.sells_source = 'Client' )`;

  const query = `
      SELECT 
        SL.*, 
        c.name AS customerName
      FROM sells_list SL 
      LEFT JOIN customers c ON SL.customer_id = c.id 
      ${whereClause} AND SL.id = ?
      GROUP BY SL.id
      ORDER BY SL.created_at DESC`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log("", err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM sells_list SL ${whereClause}`;
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

const UpdateSalesStatus = (req, res) => {
  const { id } = req.params;
  const { newStatus, userId } = req.body;
  console.log("sells id", id);
  console.log("sells status", newStatus);

  const query = `
        UPDATE sells_list 
        SET sells_status = ?,
        userId  = ?
        WHERE id = ?`;

  db.query(query, [newStatus, userId, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "data not found" });
    }

    insertUserHistory(userId, "Changed customer order status");
    res.json({ id: result.insertId });
  });
};

module.exports = { CustomerOrdes, CustomerSingleOrder, UpdateSalesStatus };
