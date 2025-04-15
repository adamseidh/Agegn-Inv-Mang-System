const bcrypt = require("bcryptjs");
const db = require("../db");
const { generateToken } = require("../middleware/jwt");

const FetchUsers = (req, res) => {
  const query = `SELECT * FROM users`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Users not found" });
    } else {
      res.json(results); // Return the trader's data
    }
  });
};

const FetchUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Entered password:", password);

  // Hash the entered password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);

  // Now you can insert the hashed password manually into the database
  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else if (results.length > 0) {
      const userdata = results[0];

      // Compare the entered password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, userdata.password);

      if (passwordMatch) {
        const { password, ...user } = userdata;
        // Generate JWT token
        const token = generateToken(user);
        return res.json({ user, success: true, token, message: "Correct" });
      } else {
        return res.json({ message: "Incorrect password" });
      }
    } else {
      return res.json({ message: "User not found" });
    }
  });
};

const GetUserRole = (req, res) => {
  const { sessionEmail } = req.body;
  const email = JSON.parse(sessionEmail).email;

  const query = `SELECT role FROM users WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length > 0) {
      res.json({ role: results[0].role });
    } else {
      res.json({ message: "role not found" });
    }
  });
};

/// users for admin

const Users = (req, res) => {
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
        SELECT * FROM users
        ${whereClause} 
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column
          const totalRow = {
            id: null,
            source: "Total",
            amount: results
              .reduce((sum, row) => sum + parseFloat(row.amount || 0), 0)
              .toString(),
          };

          // Append the total row to the results
          // results.push(totalRow);

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `client ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

/// edit user
const EditUser = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;

  const query = `
        UPDATE users 
        SET name = ?,
        email = ?,
        phone = ?,
        role = ?
        WHERE id = ?`;

  db.query(query, [name, email, phone, role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data  not found" });
    }

    res.json({ id: result.insertId });
  });
};

const DeleteUser = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ message: "Data deleted successfully" });
  });
};

///fetch a user data
const SigleUser = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "data not found" });
    } else {
      res.json(results[0]); // Return the trader's data
    }
  });
};

module.exports = {
  FetchUsers,
  FetchUser,
  GetUserRole,
  Users,
  EditUser,
  DeleteUser,
  SigleUser,
};
