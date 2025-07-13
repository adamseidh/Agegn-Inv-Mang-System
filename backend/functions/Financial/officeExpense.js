const db = require("../../db");
const { insertUserHistory } = require("../Users/history");

const officeExpenses = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;
  const userId = req.query.userId;

  console.log("here is user id from params", userId);

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
  let countWhereClause = "WHERE 1 = 1";

  if (userId) {
    whereClause += ` AND OE.userId = ${userId}`;
    countWhereClause += ` AND userId = ${userId}`;
  }

  if (q) {
    whereClause += ` AND (TIN LIKE '%${q}%' OR phone LIKE '%${q}%' OR name LIKE '%${q}%')`;
    countWhereClause += ` AND (TIN LIKE '%${q}%' OR phone LIKE '%${q}%' OR name LIKE '%${q}%')`;
  }

  if (payment_status) {
    whereClause += ` AND payment_status = '${payment_status}'`;
    countWhereClause += ` AND payment_status = '${payment_status}'`;
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
    SELECT 
        OE.*, 
        (OE.amount - IFNULL(SUM(OED.amount), 0)) AS available_amount
    FROM office_expenses OE
    LEFT JOIN office_expense_detail OED 
        ON OE.id = OED.office_expense_id
    ${whereClause}
    GROUP BY OE.id
    ORDER BY OE.id DESC
    LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM office_expenses ${countWhereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;
          const contentRange = `office_expenses ${offset}-${Math.min(
            offset + _limit - 1,
            total - 1
          )}/${total}`;

          // Set headers and return the response
          res.setHeader("Content-Range", contentRange);
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const officeExpenseSummary = (req, res) => {
  const officeExpId = req.params.id;

  const query = `
    SELECT 
        OE.*, 
       IFNULL(SUM(OED.amount), 0) AS usedAmount
    FROM office_expenses OE
    LEFT JOIN office_expense_detail OED 
        ON OE.id = OED.office_expense_id
        WHERE OE.id = ?
    `;

  db.query(query, [officeExpId], (err, results) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM office_expenses `;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          // Set headers and return the response
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const addOfficeExpense = (req, res) => {
  const { reason, amount, userId } = req.body;

  const query = `
    INSERT INTO office_expenses (reason, amount, userId)
    VALUES (?, ?, ?)
  `;

  const values = [reason, amount, userId];
  console.log("user id", userId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    const officeExpenseId = result.insertId; 

    const otherExpenseQuery = `
      INSERT INTO otherExpense (reason, amount, userId, officeExpId)
      VALUES (?, ?, ?, ?)
    `;

    const otherExpenseValues = ["office Expense", amount, userId, officeExpenseId];

    db.query(otherExpenseQuery, otherExpenseValues, (err, result2) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }

      insertUserHistory(userId, "Inserted Office Expense");

      // Return response after both inserts succeed
      res.json({ id: officeExpenseId });
    });
  });
};


const EditOfficeExpense = (req, res) => {
  const { id } = req.params;
  const { reason, amount } = req.body;

  const query = `
    UPDATE office_expenses
    SET reason = ?, amount = ?
    WHERE id = ?
  `;

  db.query(query, [reason, amount, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const otherExpenseQuery = `
      UPDATE otherExpense
      SET amount = ?
      WHERE officeExpId = ?
    `;

    db.query(otherExpenseQuery, [amount, id], (err2, result2) => {
      if (err2) {
        return res.status(500).json({ error: err2 });
      }

      res.json({ message: "Updated successfully" });
    });
  });
};


const showOfficeExpense = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM office_expenses  WHERE id = ?`;
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
const deleteOfficeExpense = (req, res) => {
  const { id } = req.params;

  // First, delete from otherExpense
  const deleteOtherExpenseQuery = `
    DELETE FROM otherExpense
    WHERE officeExpId = ?
  `;

  db.query(deleteOtherExpenseQuery, [id], (err1, result1) => {
    if (err1) {
      return res.status(500).json({ error: err1 });
    }

    // Then delete from office_expenses
    const deleteOfficeExpenseQuery = `
      DELETE FROM office_expenses
      WHERE id = ?
    `;

    db.query(deleteOfficeExpenseQuery, [id], (err2, result2) => {
      if (err2) {
        return res.status(500).json({ error: err2 });
      }

      if (result2.affectedRows === 0) {
        return res.status(404).json({ message: "Data not found" });
      }

      res.json({ message: "Deleted successfully" });
    });
  });
};


module.exports = {
  officeExpenses,
  addOfficeExpense,
  EditOfficeExpense,
  showOfficeExpense,
  deleteOfficeExpense,
  officeExpenseSummary,
};
