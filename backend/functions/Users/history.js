const db = require("../../db");

const fetchUsersHistory = (req, res) => {
  const { id } = req.params;
  console.log("user id", id);

  // First query to get the total count
  const countQuery =
    "SELECT COUNT(*) as total FROM users_history WHERE user_id = ?";

  db.query(countQuery, [id], (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].total;

    // Then query to get the paginated data
    const query = `
      SELECT UH.* FROM users_history UH 
      WHERE UH.user_id = ?
      ORDER BY UH.created_at DESC`;

    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Set the Content-Range header
      res.setHeader(
        "Content-Range",
        `users_history 0-${results.length - 1}/${total}`
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.json(results);
    });
  });
};
const insertUserHistory = (userId, title, amount) => {
  const query = `
        INSERT INTO users_history (title,user_id)
        VALUES (?, ?)
    `;

  const values = [title, userId, amount || ""];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log("error", err);
      //   return res.status(500).json({ error: err });
    }

    // res.json({ id: result.insertId });
  });
};

module.exports = {
  fetchUsersHistory,
  insertUserHistory,
};
