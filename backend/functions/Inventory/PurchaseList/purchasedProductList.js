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

const addProduct = async (req, res) => {
  try {
    const {
      item_id,
      brand,
      quantity,
      expire_date,
      purchase_date,
      batch_number,
      description,
      purchase_price,
      additional_cost,
      overall_cost,
      selling_price,
      costs,
      purchase_id,
    } = req.body;

    // Parse the costs if it's a string
    const parsedCosts = typeof costs === "string" ? JSON.parse(costs) : costs;

    // Insert product
    const productQuery = `
      INSERT INTO product_list 
      (item_id,purchase_id, brand, quantity, expire_date, purchase_date, batch_number, 
       description, purchase_price, additional_cost, overall_cost, selling_price, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const imagePath = req.file ? `${req.file.filename}` : null;

    db.query(
      productQuery,
      [
        item_id,
        purchase_id,
        brand,

        quantity,
        expire_date,
        purchase_date,
        batch_number,
        description,
        purchase_price,
        additional_cost,
        overall_cost,
        selling_price,
        imagePath,
      ],
      (err, productResult) => {
        if (err) {
          console.error("Error adding product:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to add product" });
        }

        const productId = productResult.insertId;

        // Insert costs if they exist
        if (parsedCosts && parsedCosts.length > 0) {
          const costQuery = `
            INSERT INTO cost_list 
            (product_id, title, amount) 
            VALUES ?
          `;

          const costValues = parsedCosts.map((cost) => [
            productId,
            cost.title,
            cost.amount,
          ]);

          db.query(costQuery, [costValues], (err, costResult) => {
            if (err) {
              console.error("Error adding costs:", err);
              return res.status(500).json({
                success: false,
                message: "Product added but failed to add costs",
              });
            }

            res.json({
              success: true,
              message: "Product and costs added successfully",
              productId,
            });
          });
        } else {
          res.json({
            success: true,
            message: "Product added successfully",
            productId,
          });
        }
      }
    );
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
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

const updateProduct = (req, res) => {
  const {
    item_id,
    brand,
    description,
    quantity,
    expire_date,
    purchase_date,
    serial_number,
    batch_number,
    purchase_price,
    additional_cost,
    overall_cost,
    selling_price,
    serverHost,
    oldImage,
  } = req.body;

  const image = req.file ? req.file.filename : null;
  const { id } = req.params;
  console.log("her ei s id", id);

  const fullPath = image ? `${serverHost}/images/${image}` : oldImage;

  const query = `
  UPDATE product_list
  SET 
    item_id = ?, 
    brand = ?, 
    description = ?, 
    quantity = ?, 
    expire_date = ?, 
    purchase_date = ?, 
    serial_number = ?, 
    batch_number = ?, 
    purchase_price = ?, 
    additional_cost = ?, 
    overall_cost = ?, 
    selling_price = ?, 
    image = ?
  WHERE id = ?`;

  db.query(
    query,
    [
      item_id,
      brand,
      description,
      quantity,
      expire_date,
      purchase_date,
      serial_number,
      batch_number,
      purchase_price,
      additional_cost,
      overall_cost,
      selling_price,
      fullPath,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
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
  updateProduct,
  deleteProduct,
  addProduct,
};
