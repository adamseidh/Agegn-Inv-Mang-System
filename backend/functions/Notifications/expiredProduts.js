const db = require("../../db");
const { sendToEmail } = require("./sendToEmail");

const ExpiredProducts = (req, res) => {
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
      ${whereClause + " AND p.expire_date <= CURDATE()"}`;

  baseQuery += ` HAVING available_product > 0`;

  // Final query with sorting and pagination
  const query = `${baseQuery} ORDER BY expire_date DESC LIMIT ${_limit} OFFSET ${offset}`;

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

///get number of expired productc

const expiredProductCount = (req, res) => {
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
      ${whereClause + " AND p.expire_date <= CURDATE()"}`;

  baseQuery += ` HAVING available_product > 0`;

  // Final query with sorting and pagination
  const query = `${baseQuery} ORDER BY expire_date DESC `;

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

const deleteProductExpiredProduct = (req, res) => {
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

const checkExpiredProducts = async (req, res) => {
  try {
    // Query to find expired products that are still in stock
    const query = `
        SELECT 
          p.id,
          i.name as product_name,
          p.expire_date,
          p.quantity - COALESCE((
            SELECT SUM(s.quantity) 
            FROM sells_product s 
            WHERE s.product_id = p.id
          ), 0) AS available_quantity
        FROM product_list p
        LEFT JOIN items i ON p.item_id = i.id
        WHERE DATE(p.expire_date) = CURDATE()
        HAVING available_quantity > 0`;

    // For standard mysql package
    db.query(query, async (error, products, fields) => {
      if (error) {
        console.error("Database error:", error);
        return;
      }

      if (products && products.length > 0) {
        console.log("=== EXPIRED PRODUCTS FOUND ===");

        for (const product of products) {
          // Log to console
          console.log(
            `Product "${product.product_name}" has expired on ${product.expire_date}. Available quantity: ${product.available_quantity}`
          );

          // Create notification in database
          const notificationTitle = "Product Expired";
          const notificationDescription = `Product "${product.product_name}" expired on ${product.expire_date}. Please remove from stock.`;
          sendToEmail(
            "adamseidh@gmail.com",
            notificationTitle,
            notificationDescription
          );
          const insertQuery = `
              INSERT INTO notifications 
              (title, description, status, date)
              VALUES (?, ?, 'Not Read', NOW())`;

          // Execute insert query for each product
          db.query(
            insertQuery,
            [notificationTitle, notificationDescription],
            (err, results) => {
              if (err) {
                console.error("Error creating notification:", err);
              }
            }
          );
        }

        console.log(
          `=== Created ${products.length} notifications for expired products ===`
        );
      } else {
        console.log("No expired products found in stock");
      }
    });
  } catch (error) {
    console.error("Error in checkExpiredProducts:", error);
  }
};

module.exports = {
  ExpiredProducts,
  deleteProductExpiredProduct,
  checkExpiredProducts,
  expiredProductCount,
};
