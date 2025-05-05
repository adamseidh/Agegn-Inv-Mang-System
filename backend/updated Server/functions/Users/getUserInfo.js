const db = require("../../db");

function GetUserInfo(id) {
  return new Promise((resolve, reject) => {
    const fetchUser = "SELECT name, user_address FROM users WHERE id = ?";
    db.query(fetchUser, [id], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length === 0) {
        return reject(new Error("User not found"));
      }

      const userData = results[0];
      console.log("user data:", userData);
      resolve(userData);
    });
  });
}

module.exports = GetUserInfo;
