const db = require("../../../db");
const Products = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort, inStock } =
    req.query;

  // Defaults
  _sort = _sort || "id";
  _order = _order === "desc" ? "DESC" : "ASC";
  _page = parseInt(_page, 10) || 1;
  _limit = parseInt(_limit, 10) || 10;
  let offset = (_page - 1) * _limit;
  inStock = inStock === "true"; // Convert to boolean

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

  let categoryId = null;
  let TypeId = null;
  let filterObj = {};
  if (filter) {
    try {
      filterObj = JSON.parse(decodeURIComponent(filter));
      categoryId = filterObj.category_id || null;
      TypeId = filterObj.type_id || null;
      q = q || filterObj.q || null;
      inStock = inStock || filterObj.inStock || false;
    } catch (err) {
      console.error("Error parsing filter JSON:", err);
    }
  }

  let whereClause = "WHERE 1 = 1";
  if (q) {
    whereClause += ` AND i.name LIKE '%${q}%'`;
  }

  if (categoryId) {
    whereClause += ` AND i.category_id = '${categoryId}'`;
  }
  if (TypeId) {
    whereClause += ` AND i.type_id = '${TypeId}'`;
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

  const validSortColumns = ["id", "name", "available_product", "sold_product"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "id";
  }

  if (_sort === "capital") {
    _sort = "CAST(capital AS DECIMAL)";
  }

  // Base query with available and sold product calculations
  let baseQuery = `
      SELECT 
        p.*,  
        i.name, 
        i.image as itemImage,
        c.name as categoryName, 
        sp.name AS supplierName, 
        pt.name AS typeName,
        COALESCE((
          SELECT SUM(s.quantity) 
          FROM sells_product s 
          WHERE s.product_id = p.id
        ), 0) AS sold_product,
        p.quantity - COALESCE((
          SELECT SUM(s.quantity) 
          FROM sells_product s 
          WHERE s.product_id = p.id
        ), 0) AS available_product
      FROM product_list p
      LEFT JOIN items i ON p.item_id = i.id
      LEFT JOIN category c ON i.category_id= c.id
      LEFT JOIN product_type pt ON i.type_id = pt.id
      LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
      LEFT JOIN supplier sp ON pl.supplier_id = sp.id 
      ${whereClause}`;

  baseQuery += ` HAVING available_product > 0`;

  // Final query with sorting and pagination
  const query = `${baseQuery} ORDER BY ${_sort} ${_order} LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // Count query needs to match the same filtering conditions
      let countQuery = `
          SELECT COUNT(*) AS total 
          FROM (
            ${baseQuery}
          ) AS filtered_products`;

      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `products ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const ClientProducts = (req, res) => {
  // Base query with available and sold product calculations
  let baseQuery = `
      SELECT 
        p.*,  
        i.name, 
        i.image as itemImage,
        c.name as categoryName, 
        sp.name AS supplierName, 
        pt.name AS typeName,
        COALESCE((
          SELECT SUM(s.quantity) 
          FROM sells_product s 
          WHERE s.product_id = p.id
        ), 0) AS sold_product,
        p.quantity - COALESCE((
          SELECT SUM(s.quantity) 
          FROM sells_product s 
          WHERE s.product_id = p.id
        ), 0) AS available_product
      FROM product_list p
      LEFT JOIN items i ON p.item_id = i.id
      LEFT JOIN category c ON i.category_id= c.id
      LEFT JOIN product_type pt ON i.type_id = pt.id
      LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
      LEFT JOIN supplier sp ON pl.supplier_id = sp.id 
      `;

  baseQuery += ` HAVING available_product > 0`;

  // Final query with sorting and pagination
  const query = `${baseQuery} `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // Count query needs to match the same filtering conditions
      let countQuery = `
          SELECT COUNT(*) AS total 
          FROM (
            ${baseQuery}
          ) AS filtered_products`;

      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column

          // Set headers and return the response
          res.setHeader("Content-Range", `products `);
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const singleProduct = (req, res) => {
  const { id } = req.params;
  let baseQuery = `
      SELECT 
        p.*,  
        i.name, 
        c.name as categoryName, 
        sp.name AS supplierName, 
        pt.name AS typeName,
        COALESCE((
          SELECT SUM(s.quantity) 
          FROM sells_product s 
          WHERE s.product_id = p.id
        ), 0) AS sold_product,
        p.quantity - COALESCE((
          SELECT SUM(s.quantity) 
          FROM sells_product s 
          WHERE s.product_id = p.id
        ), 0) AS available_product
      FROM product_list p
      LEFT JOIN items i ON p.item_id = i.id
      LEFT JOIN category c ON i.category_id= c.id
      LEFT JOIN product_type pt ON i.type_id = pt.id
      LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
      LEFT JOIN supplier sp ON pl.supplier_id = sp.id 
      `;

  // Final query with sorting and pagination
  const query = `${baseQuery} WHERE p.id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "data not found" });
    } else {
      res.json(results[0]);
    }
  });
};

const AddProduct = (req, res) => {
  const {
    item_id,
    price,
    stockin,
    supplier_id,
    expire_date,
    description,
    note,
  } = req.body;

  const stockout = 0;
  const available_stock = parseFloat(stockin) - parseFloat(stockout);

  // Fetch category_id from items table
  const getCategorySql = "SELECT category_id FROM items WHERE id = ?";

  db.query(getCategorySql, [item_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const category_id = results[0].category_id; // Access category_id correctly

    // Insert new product into the products table
    const query = `
            INSERT INTO products (item_id, category_id, price, stockin, stockout, available_stock, supplier_id, expire_date, description, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      item_id,
      category_id,
      price,
      stockin,
      stockout,
      available_stock,
      supplier_id,
      expire_date,
      description,
      note,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        success: true,
        message: "Data added successfully",
        id: result.insertId,
      });
    });
  });
};

const EditProduct = (req, res) => {
  const { id } = req.params;
  const {
    item_id,
    price,
    stockin,
    stockout,
    supplier_id,
    expire_date,
    description,
    note,
  } = req.body;

  console.log("stock in", stockin);
  console.log("stock out", stockout);

  const available_stock = parseFloat(stockin) - parseFloat(stockout);

  // Fetch category_id from items table
  const getCategorySql = "SELECT category_id FROM items WHERE id = ?";

  db.query(getCategorySql, [item_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const category_id = results[0].category_id; // Access category_id correctly

    console.log("category id", category_id);
    console.log("available stock", available_stock);

    // Update the products table
    const query = `
            UPDATE products 
            SET item_id = ?,
                category_id = ?,
                price = ?,
                stockin = ?,
                stockout = ?,
                available_stock = ?,
                supplier_id = ?,
                expire_date = ?,
                description = ?,
                note = ?
            WHERE id = ?`;

    db.query(
      query,
      [
        item_id,
        category_id,
        price,
        stockin,
        stockout,
        available_stock,
        supplier_id,
        expire_date,
        description,
        note,
        id,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Data not found" });
        }

        res.json({ message: "Product updated successfully", id: id });
      }
    );
  });
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM product_list WHERE id = ?";

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
  Products,
  singleProduct,
  AddProduct,
  EditProduct,
  deleteProduct,
  ClientProducts,
};
