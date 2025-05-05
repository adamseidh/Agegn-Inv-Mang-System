const db = require("../../db");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../middleware/jwt");
const { insertUserHistory } = require("../Users/history");
const Customers = (req, res) => {
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
        SELECT * FROM customers
        ${whereClause}
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM customers ${whereClause}`;
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

const CustomersCount = (req, res) => {
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
        SELECT * FROM customers
        ${whereClause}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM customers ${whereClause}`;
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

const singleCustomer = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM customers WHERE id = ?";
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

const AddCustomer = (req, res) => {
  const {
    name,
    customer_name,
    phone,
    email,
    website,
    region,
    zone,
    wereda_or_city,
    kebele,
    tin,
    letter_no,
    userId,
  } = req.body;
  console.log("wreda", wereda_or_city);

  const query = `
        INSERT INTO customers (name,customer_name, phone, email, website,region,zone,wereda_or_city, kebele,tin,letter_no)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `;

  const values = [
    name,
    customer_name,
    phone,
    email,
    website,
    region,
    zone,
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

    insertUserHistory(userId, `Inserted a customer: ${name}`);
    res.json({ id: result.insertId });
  });
};

const customerSignUp = async (req, res) => {
  const {
    name,
    customer_name,
    phone,
    email,
    website,
    region,
    zone,
    wereda_or_city,
    kebele,
    tin,
    letter_no,
    pin, // This is the SHA-256 hashed PIN from frontend
  } = req.body;

  try {
    // Validate required fields

    // First check if phone number already exists
    const checkQuery = `SELECT id FROM customers WHERE phone = ?`;

    db.query(checkQuery, [phone], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Database error during phone check:", checkErr);
        return res
          .status(500)
          .json({ error: "Database error during registration" });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({
          error: "User already exists",
          message: "An account with this phone number already exists",
        });
      }

      // If phone doesn't exist, proceed with registration
      try {
        // Hash the already SHA-256 hashed PIN with bcrypt
        const saltRounds = 10;
        const bcryptHashedPin = await bcrypt.hash(pin, saltRounds);

        const insertQuery = `
          INSERT INTO customers 
          (name,customer_name, phone, email, website, region,zone, wereda_or_city, kebele, tin, letter_no, pin)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
        `;

        const values = [
          name,
          customer_name || "",
          phone,
          email || null,
          website || null,
          region,
          wereda_or_city,
          zone || "",
          kebele,
          tin || null,
          letter_no || null,
          bcryptHashedPin,
        ];

        db.query(insertQuery, values, (insertErr, result) => {
          if (insertErr) {
            console.error("Database error during insertion:", insertErr);
            return res.status(500).json({ error: "Failed to create customer" });
          }

          res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customerId: result.insertId,
          });
        });
      } catch (hashError) {
        console.error("Error hashing PIN:", hashError);
        res
          .status(500)
          .json({ error: "Internal server error during registration" });
      }
    });
  } catch (error) {
    console.error("Error in customerSignUp:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const customerLogin = async (req, res) => {
  const { phone, pin } = req.body;

  if (!phone || !pin) {
    return res.status(400).json({ error: "Phone and PIN are required" });
  }
  console.log("Entered password:", pin);

  // Hash the entered pin
  const hashedpin = await bcrypt.hash(pin, 10);
  console.log("Hashed password:", hashedpin);

  // Now you can insert the hashed password manually into the database
  const query = `SELECT * FROM customers WHERE phone = ?`;
  db.query(query, [phone], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else if (results.length > 0) {
      const userdata = results[0];

      console.log("befor match", userdata.pin);

      // Compare the entered pin with the hashed pin in the database
      const pinMatch = await bcrypt.compare(pin, userdata.pin);
      console.log("customer pin match", pinMatch);

      if (pinMatch) {
        const { pin, ...customer } = userdata;
        // Generate JWT token
        const token = generateToken(customer);
        return res.json({ customer, success: true, token, message: "Correct" });
      } else {
        return res.json({ message: "Incorrect pn" });
      }
    } else {
      return res.json({ message: "User not found" });
    }
  });
};

const EditCustomer = (req, res) => {
  const { id } = req.params;
  const {
    name,
    customer_name,
    phone,
    email,
    website,
    region,
    zone,
    wereda_or_city,
    kebele,
    tin,
    letter_no,
  } = req.body;

  const query = `
        UPDATE customers
        SET name = ?,
        customer_name = ?,
        phone = ?,
        email= ?,
        website = ?,
        region= ?,zone = ?, wereda_or_city= ?, kebele= ?,tin= ?,letter_no= ?
        WHERE id = ?`;

  db.query(
    query,
    [
      name,
      customer_name,
      phone,
      email,
      website,
      region,
      zone,
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

const getCustomerProfile = (req, res) => {
  const customerId = req.params.customerId;

  const query = `
    SELECT id, name,customer_name, phone, email, website, region, zone, wereda_or_city, kebele, tin, letter_no
    FROM customers
    WHERE id = ?
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(results[0]);
  });
};

// Update customer profile
const updateCustomerProfile = async (req, res) => {
  const customerId = req.params.customerId;
  const {
    name,
    customer_name,
    phone,
    email,
    website,
    region,
    wereda_or_city,
    zone,
    kebele,
    tin,
    letter_no,
    pin,
  } = req.body;
  console.log("poin dta", pin);
  try {
    let updateFields = {
      name,
      customer_name,
      phone,
      email: email || null,
      website: website || null,
      region,
      wereda_or_city,
      zone: zone || null,
      kebele: kebele || null,
      tin: tin || null,
      letter_no: letter_no || null,
    };

    let query = `UPDATE customers SET ? WHERE id = ?`;

    // If PIN is being updated
    if (pin) {
      const bcryptHashedPin = await bcrypt.hash(pin, 10);
      updateFields.pin = bcryptHashedPin;
    }

    db.query(query, [updateFields, customerId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
      }
      res.json({ success: true, message: "Profile updated successfully" });
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCustomer = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM customers WHERE id = ?";

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
  Customers,
  customerLogin,
  customerSignUp,
  singleCustomer,
  AddCustomer,
  EditCustomer,
  deleteCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  CustomersCount,
};
