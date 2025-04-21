const db = require("../../db");

const Supplier = (req, res) => {
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

  const validSortColumns = ["id", "name"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "id";
  }

  if (_sort === "capital") {
    _sort = "CAST(capital AS DECIMAL)";
  }

  const query = `
        SELECT * FROM supplier
        ${whereClause}
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM supplier ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column
          const totalRow = {
            id: null,
            title: "Total",
            budget_plan: results
              .reduce((sum, row) => sum + parseFloat(row.budget_plan || 0), 0)
              .toString(),
            quartOne: results
              .reduce((sum, row) => sum + parseFloat(row.quartOne || 0), 0)
              .toString(),
            quartTwo: results
              .reduce((sum, row) => sum + parseFloat(row.quartTwo || 0), 0)
              .toString(),
            quartThree: results
              .reduce((sum, row) => sum + parseFloat(row.quartThree || 0), 0)
              .toString(),
            quartFour: results
              .reduce((sum, row) => sum + parseFloat(row.quartFour || 0), 0)
              .toString(),
          };

          // Append the total row to the results
          //results.push(totalRow);

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `expenses ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

//////supplier count
const SupplierCount = (req, res) => {
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

  const validSortColumns = ["id", "name"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "id";
  }

  if (_sort === "capital") {
    _sort = "CAST(capital AS DECIMAL)";
  }

  const query = `
        SELECT * FROM supplier
        ${whereClause}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM supplier ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column
          const totalRow = {
            id: null,
            title: "Total",
            budget_plan: results
              .reduce((sum, row) => sum + parseFloat(row.budget_plan || 0), 0)
              .toString(),
            quartOne: results
              .reduce((sum, row) => sum + parseFloat(row.quartOne || 0), 0)
              .toString(),
            quartTwo: results
              .reduce((sum, row) => sum + parseFloat(row.quartTwo || 0), 0)
              .toString(),
            quartThree: results
              .reduce((sum, row) => sum + parseFloat(row.quartThree || 0), 0)
              .toString(),
            quartFour: results
              .reduce((sum, row) => sum + parseFloat(row.quartFour || 0), 0)
              .toString(),
          };

          // Append the total row to the results
          //results.push(totalRow);

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `expenses ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const singleSupplier = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM supplier WHERE id = ?";
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

const AddSupplier = (req, res) => {
  const {
    name,
    phone,
    email,
    website,
    region,
    wereda_or_city,
    kebele,
    tin,
    letter_no,
  } = req.body;
  console.log("wreda", wereda_or_city);

  const query = `
        INSERT INTO supplier (name, phone, email, website,region,wereda_or_city, kebele,tin,letter_no)
        VALUES (?,?,?,?,?,?,?,?,?)
    `;

  const values = [
    name,
    phone,
    email,
    website,
    region,
    wereda_or_city,
    kebele,
    tin,
    letter_no,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log("error", err);
      return res.status(500).json({ error: err });
    }

    res.json({ id: result.insertId });
  });
};

const EditSupplier = (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    email,
    website,
    region,
    wereda_or_city,
    kebele,
    tin,
    letter_no,
  } = req.body;

  const query = `
        UPDATE supplier 
        SET name = ?,
        phone = ?,
        email= ?,
        website = ?,
        region= ?,wereda_or_city= ?, kebele= ?,tin= ?,letter_no= ?
        WHERE id = ?`;

  db.query(
    query,
    [
      name,
      phone,
      email,
      website,
      region,
      wereda_or_city,
      kebele,
      tin || "",
      letter_no || "",
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "data not found" });
      }

      res.json({ id: result.insertId });
    }
  );
};

const deleteSupplier = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM supplier WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "data not found" });
    }

    res.json({ message: "data deleted successfully" });
  });
};

module.exports = {
  Supplier,
  singleSupplier,
  AddSupplier,
  EditSupplier,
  deleteSupplier,
  SupplierCount,
};
