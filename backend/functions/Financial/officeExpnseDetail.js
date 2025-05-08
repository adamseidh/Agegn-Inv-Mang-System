const db = require("../../db");

const officeExpensesDetail = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

  const officeExpId = req.query.officeExpId;

  console.log("office Expense id", officeExpId);

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
        SELECT OE.*  FROM office_expense_detail OE
        ${whereClause} AND OE.office_expense_id = ${officeExpId}`;

  db.query(query, (err, results) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM office_expense_detail ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Append the total row to the results

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `office_expense_detail ${offset}-${
              offset + results.length
            }/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const addOfficeExpenseDetail = (req, res) => {
  const { reason, amount, office_expense_id } = req.body;

  console.log("reciening expense detail", reason, amount, office_expense_id);

  const query = `
  INSERT INTO office_expense_detail (reason, amount, office_expense_id)
  VALUES (?,?,?)
`;

  const values = [reason, amount, office_expense_id];
  console.log("office_expense_id id", office_expense_id);

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    res.json({ id: result.insertId });
  });
};

const EditOfficeExpenseDetail = (req, res) => {
  const { id } = req.params;
  const { reason, amount } = req.body;
  console.log("office exp detail id", id);

  const query = `
        UPDATE office_expense_detail
        SET reason = ?, amount = ?
        WHERE id = ?`;

  db.query(query, [reason, amount, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "data not found" });
    }

    // Return updated item (or just the id)
    res.json({ id: parseInt(id), reason, amount });
  });
};

const showOfficeExpenseDetail = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM office_expense_detail  WHERE id = ?`;
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
const deleteOfficeExpenseDetail = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM office_expense_detail WHERE id = ?";

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
  officeExpensesDetail,
  addOfficeExpenseDetail,
  EditOfficeExpenseDetail,
  showOfficeExpenseDetail,
  deleteOfficeExpenseDetail,
};
