const db = require("../../../db");

const PurchaseList = (req, res) => {
  let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

  // Defaults - changed to use created_at DESC when no sort is specified
  _sort = _sort || "created_at"; // Default to created_at
  _order = _order === "desc" ? "DESC" : _sort === "created_at" ? "DESC" : "ASC"; // Default to DESC for created_at
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

  // Updated valid sort columns to include created_at
  const validSortColumns = ["id", "amount", "created_at"];
  if (!validSortColumns.includes(_sort)) {
    _sort = "created_at";
    _order = "DESC";
  }

  // Special handling for created_at to ensure DESC order by default
  if (_sort === "created_at" && !_order) {
    _order = "DESC";
  }

  const query = `
SELECT 
  PL.*, 
  s.name AS supplierName,
  CASE 
    WHEN SUM(CASE WHEN pp.payment_status != 'Completed' THEN 1 ELSE 0 END) > 0 THEN 'Not Completed'
    ELSE 'Completed'
  END AS payment_status,
  SUM(CASE WHEN pp.payment_status != 'Completed' THEN pp.amount ELSE 0 END) AS not_completed_amount
FROM purchase_list PL 
LEFT JOIN supplier s ON PL.supplier_id = s.id 
LEFT JOIN purchase_payment pp ON PL.id = pp.purchase_id
${whereClause}
GROUP BY PL.id
ORDER BY PL.created_at DESC
LIMIT ${_limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM purchase_list ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          res.setHeader(
            "Content-Range",
            `purchase_list ${offset}-${offset + results.length}/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const SinglePurchaseData = (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT 
    PL.*, 
    s.name AS supplierName,
    CASE 
      WHEN SUM(CASE WHEN pp.payment_status != 'Completed' THEN 1 ELSE 0 END) > 0 THEN 'Not Completed'
      ELSE 'Completed'
    END AS payment_status,
    SUM(CASE WHEN pp.payment_status != 'Completed' THEN pp.amount ELSE 0 END) AS not_completed_amount
  FROM purchase_list PL 
  LEFT JOIN supplier s ON PL.supplier_id = s.id 
  LEFT JOIN purchase_payment pp ON PL.id = pp.purchase_id WHERE PL.id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.json(results[0]);
    }
  });
};

const productCostList = (req, res) => {
  const { id } = req.params;

  const query = `
        SELECT * FROM cost_list WHERE product_id = ? ORDER BY id DESC`;

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.json(results);
    }
  });
};

const createProductCost = (req, res) => {
  const {
    product_id,
    title,
    amount,
    sellingPrice,
    additionalCosts,
    overallCost,
  } = req.body;
  console.log("additional costs", additionalCosts);
  console.log("overall cost", overallCost);

  const query =
    "INSERT INTO cost_list (product_id, title, amount) VALUES (?, ?, ?)";

  db.query(query, [product_id, title, amount], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    const updateProductQuery = `
        UPDATE product_list
        SET selling_price = ?,
            additional_cost = ?,
            overall_cost = ?
        WHERE id = ?`;
    db.query(
      updateProductQuery,
      [sellingPrice, additionalCosts, overallCost, product_id],
      (err, updateResult) => {
        if (err) {
          console.log("error", err);
          return res.status(500).json({ error: err });
        }

        res.json({ id: result.insertId });
      }
    );
  });
};

const deleteProductCost = (req, res) => {
  const { id } = req.params;
  console.log(" id", id);

  const query = "DELETE FROM cost_list WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json({ message: "Data deleted successfully" });
  });
};

const UpdateProductPrice = (req, res) => {
  const id = req.params.id;
  const { sellingPrice, additionalCosts, overallCost } = req.body;

  console.log("selling price did", id);
  console.log("sellingprice", sellingPrice);
  console.log("additionalCosts", additionalCosts);
  console.log("overallCost", overallCost);

  const updateProductQuery = `
        UPDATE product_list
        SET selling_price = ?,
            additional_cost = ?,
            overall_cost = ?
        WHERE id = ?`;
  db.query(
    updateProductQuery,
    [sellingPrice, additionalCosts, overallCost, id],
    (err, updateResult) => {
      if (err) {
        console.log("error", err);
        return res.status(500).json({ error: err });
      }

      res.json({ message: "Product price updated successfully" });
    }
  );
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

const updateProductCost = (req, res) => {
  const {
    title,
    amount,
    productId,
    sellingPrice,
    additionalCosts,
    overallCost,
  } = req.body;

  console.log("additional costs", additionalCosts);
  console.log("overall cost", overallCost);
  const { id } = req.params;
  console.log(title, id, amount);

  const query = `
        UPDATE cost_list 
        SET title = ?, amount = ?
        WHERE id = ?`;

  db.query(query, [title, amount, id], (err, result) => {
    if (err) {
      console.log("error", err);
      return res.status(500).json({ error: err });
    }

    const updateProductQuery = `
        UPDATE product_list
        SET selling_price = ?,
            additional_cost = ?,
            overall_cost = ?
        WHERE id = ?`;
    db.query(
      updateProductQuery,
      [sellingPrice, additionalCosts, overallCost, productId],
      (err, updateResult) => {
        if (err) {
          console.log("error", err);
          return res.status(500).json({ error: err });
        }

        res.json({ id: result.insertId });
      }
    );
  });
};

module.exports = {
  PurchaseList,
  SinglePurchaseData,
  productCostList,
  deleteProductCost,
  CreateItem,
  updateProductCost,
  createProductCost,
  UpdateProductPrice,
};
