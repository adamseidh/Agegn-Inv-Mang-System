const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost", //
  user: "root", //agegnbgs_agegn_user
  password: "", //agegn@123
  database: "agegn-inventory-db", //agegnbgs_agegn_db
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
