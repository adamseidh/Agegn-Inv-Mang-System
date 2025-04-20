const db = require("../../db");

const Items = (req, res) => {
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

  const validSortColumns = ["id", "amount"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "id";
  }

  if (_sort === "capital") {
    _sort = "CAST(capital AS DECIMAL)";
  }

  const query = `
        SELECT I.*, C.name as category, PT.name as type FROM items I
        LEFT JOIN category C
        ON I.category_id = C.id
        LEFT JOIN product_type PT
        ON I.type_id = PT.id
        
        ${whereClause}
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM items ${whereClause}`;
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
          //results.push(totalRow);

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `items ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const AnItem = (req, res) => {
  const { id } = req.params;
  const query = `SELECT I.*, C.name as category, PT.name as type FROM items I
        LEFT JOIN category C
        ON I.category_id = C.id
        LEFT JOIN product_type PT
        ON I.type_id = PT.id WHERE I.id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.json(results[0]); //
    }
  });
};
const CreateItem = (req, res) => {
  const {
    name,
    low_level,
    category_id,
    type_id,
    unit,
    description,
    serverHost,
  } = req.body;

  console.log("categroy id", category_id);
  console.log("server host", serverHost);
  const image = req.file ? req.file.filename : null;
  console.log("here is uploading image: ", image);

  const fullPath = `${serverHost}/images/${image}`;

  const query = `
        INSERT INTO items (name,unit, low_level, category_id, type_id, description, image)
        VALUES (?, ?, ?, ?,?,?,?)
    `;

  const values = [
    name,
    unit,
    low_level,
    category_id || null,
    type_id || null,
    description || "",
    fullPath,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log("error", err);
      return res.status(500).json({ error: err });
    }

    res.json({ id: result.insertId });
  });
};

const EditItem = (req, res) => {
  const {
    name,
    unit,
    low_level,
    category_id,
    type_id,
    description,
    serverHost,
    oldImage,
  } = req.body;
  console.log("unit", unit);
  const image = req.file ? req.file.filename : null;
  const { id } = req.params;

  const fullPath = image ? `${serverHost}/images/${image}` : oldImage;

  const query = `
        UPDATE items 
        SET name = ?, unit = ?, low_level = ?,  category_id = ?,type_id = ?, description = ?,image = ?
        WHERE id = ?`;

  db.query(
    query,
    [name, unit, low_level, category_id, type_id, description, fullPath, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data not found" });
      }

      res.json({ id: result.insertId });
    }
  );
};

const deleteItem = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM items WHERE id = ?";

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

module.exports = { Items, AnItem, CreateItem, EditItem, deleteItem };
