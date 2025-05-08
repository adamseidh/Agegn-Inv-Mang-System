const db = require("../../db");
const { insertUserHistory } = require("../Users/history");

const otherExpenses = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

  // Defaults
  _sort = _sort || "id";
  _order = _order === "desc" ? "DESC" : "ASC";
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
    whereClause += ` AND (TIN LIKE '%${q}%' OR phone LIKE '%${q}%' OR name LIKE '%${q}%')`;
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

  const validSortColumns = ["id", "amount"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "id";
  }

  if (_sort === "capital") {
    _sort = "CAST(capital AS DECIMAL)";
  }

  const query = `
        SELECT OE.*, u.name createdBy FROM otherExpense OE
          LEFT JOIN users u ON OE.userId = u.id 

        ${whereClause}
        ORDER BY OE.id DESC
        LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM otherExpense ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column
          const totalRow = {
            id: null,
            reason: "Total",
            amount: results
              .reduce((sum, row) => sum + parseFloat(row.amount || 0), 0)
              .toString(),
          };

          // Append the total row to the results
          results.push(totalRow);

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `otherExpense ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const addOtherExpense = (req, res) => {
  const { reason, amount, userId } = req.body;

  const query = `
  INSERT INTO otherExpense (reason, amount, userId)
  VALUES (?,?,?)
`;

  const values = [reason, amount, userId];
  console.log("userd id", userId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    insertUserHistory(userId, "Inserted other Expense");
    res.json({ id: result.insertId });
  });
};

const EditOtherExpense = (req, res) => {
  const { id } = req.params;
  const { reason, amount } = req.body;

  const query = `
        UPDATE otherExpense 
        SET reason = ?, amount = ?
        WHERE id = ?`;

  db.query(query, [reason, amount, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "data not found" });
    }

    res.json({ id: result.insertId });
  });
};

const showOtherExpense = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM otherExpense  WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "data not found" });
    } else {
      res.json(results[0]);
    }
  });
};
const deleteOtherExpense = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM otherExpense WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ message: " deleted successfully" });
  });
};

module.exports = {
  otherExpenses,
  addOtherExpense,
  EditOtherExpense,
  showOtherExpense,
  deleteOtherExpense,
};
