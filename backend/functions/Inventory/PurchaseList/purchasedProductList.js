const db = require("../../../db");

const PurchasedProductList = (req, res) => {
  const { id } = req.params; // or use req.query.id if it's a query param

  const query = `
      SELECT * FROM product_list WHERE purchase_id = ? ORDER BY id DESC`;

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.json(results);
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
  const { name, low_level, category_id, type_id, description, serverHost } =
    req.body;

  console.log("categroy id", category_id);
  console.log("server host", serverHost);
  const image = req.file ? req.file.filename : null;
  console.log("here is uploading image: ", image);

  const fullPath = `${serverHost}/images/${image}`;

  const query = `
        INSERT INTO items (name,low_level, category_id, type_id, description, image)
        VALUES (?, ?, ?, ?,?,?)
    `;

  const values = [
    name,
    low_level,
    category_id || "",
    type_id || "",
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
    low_level,
    category_id,
    type_id,
    description,
    serverHost,
    oldImage,
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const { id } = req.params;

  const fullPath = image ? `${serverHost}/images/${image}` : oldImage;

  const query = `
        UPDATE items 
        SET name = ?, low_level = ?,  category_id = ?,type_id = ?, description = ?,image = ?
        WHERE id = ?`;

  db.query(
    query,
    [name, low_level, category_id, type_id, description, fullPath, id],
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

const deleteProduct = (req, res) => {
  const { id } = req.params;
  console.log("product id", id);

  const query = "DELETE FROM product_list WHERE id = ?";

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

module.exports = {
  PurchasedProductList,
  AnItem,
  CreateItem,
  EditItem,
  deleteProduct,
};
