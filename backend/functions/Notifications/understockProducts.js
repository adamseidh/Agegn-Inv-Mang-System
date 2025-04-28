const db = require("../../db");

const understockProducts = (req, res) => {
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
  let baseQuery = `
        SELECT 
          p.id,
          p.item_id,
          p.purchase_id,
          p.quantity,
          i.name, 
          i.unit,
          i.low_level,
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

  // Final query with sorting and pagination
  const query = `${baseQuery} ORDER BY p.id DESC `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      // Process results to merge duplicates by item_id
      const mergedProducts = {};

      results.forEach((product) => {
        if (!mergedProducts[product.item_id]) {
          // First occurrence - create entry
          mergedProducts[product.item_id] = {
            ...product,
            // Keep the first product id as reference
            product_ids: [product.id],
            quantity: parseFloat(product.quantity),
            sold_product: parseFloat(product.sold_product),
            available_product: parseFloat(product.available_product),
            unit: product.unit,
            low_level: parseFloat(product.low_level),
          };
        } else {
          // Subsequent occurrence - sum quantities and other aggregations
          mergedProducts[product.item_id].quantity += parseFloat(
            product.quantity
          );
          mergedProducts[product.item_id].sold_product += parseFloat(
            product.sold_product
          );
          mergedProducts[product.item_id].available_product += parseFloat(
            product.available_product
          );
          mergedProducts[product.item_id].product_ids.push(product.id);
        }
      });

      // Convert back to array and filter items where available_product is less than low_level
      const finalResults = Object.values(mergedProducts)
        .filter(
          (item) =>
            item.available_product <= item.low_level &&
            item.available_product > 0
        )
        .map((item) => ({
          id: item.id,
          item_id: item.item_id,
          purchase_id: item.purchase_id,
          name: item.name,
          categoryName: item.categoryName,
          supplierName: item.supplierName,
          typeName: item.typeName,
          quantity: item.quantity,
          sold_product: item.sold_product,
          available_product: item.available_product,
          unit: item.unit,
          low_level: item.low_level,
          isUnderstock: item.available_product <= item.low_level,
        }));

      // Count query needs to match the same filtering conditions but without pagination
      let countQuery = `
          SELECT COUNT(DISTINCT item_id) AS total 
          FROM (
            ${baseQuery}
            HAVING available_product < low_level
          ) AS filtered_products`;

      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Set headers and return the response
          res.setHeader(
            "Content-Range",
            `understockProducts ${offset}-${
              offset + finalResults.length
            }/${total}`
          );
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(finalResults);
        }
      });
    }
  });
};

const understockProductsCount = (req, res) => {
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
  let baseQuery = `
        SELECT 
          p.id,
          p.item_id,
          p.purchase_id,
          p.quantity,
          i.name, 
          i.unit,
          i.low_level,
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

  // Final query with sorting and pagination
  const query = `${baseQuery} ORDER BY p.id DESC `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      // Process results to merge duplicates by item_id
      const mergedProducts = {};

      results.forEach((product) => {
        if (!mergedProducts[product.item_id]) {
          // First occurrence - create entry
          mergedProducts[product.item_id] = {
            ...product,
            // Keep the first product id as reference
            product_ids: [product.id],
            quantity: parseFloat(product.quantity),
            sold_product: parseFloat(product.sold_product),
            available_product: parseFloat(product.available_product),
            unit: product.unit,
            low_level: parseFloat(product.low_level),
          };
        } else {
          // Subsequent occurrence - sum quantities and other aggregations
          mergedProducts[product.item_id].quantity += parseFloat(
            product.quantity
          );
          mergedProducts[product.item_id].sold_product += parseFloat(
            product.sold_product
          );
          mergedProducts[product.item_id].available_product += parseFloat(
            product.available_product
          );
          mergedProducts[product.item_id].product_ids.push(product.id);
        }
      });

      // Convert back to array and filter items where available_product is less than low_level
      const finalResults = Object.values(mergedProducts)
        .filter(
          (item) =>
            item.available_product <= item.low_level &&
            item.available_product > 0
        )
        .map((item) => ({
          id: item.id,
          item_id: item.item_id,
          purchase_id: item.purchase_id,
          name: item.name,
          categoryName: item.categoryName,
          supplierName: item.supplierName,
          typeName: item.typeName,
          quantity: item.quantity,
          sold_product: item.sold_product,
          available_product: item.available_product,
          unit: item.unit,
          low_level: item.low_level,
          isUnderstock: item.available_product <= item.low_level,
        }));

      // Count query needs to match the same filtering conditions but without pagination
      let countQuery = `
          SELECT COUNT(DISTINCT item_id) AS total 
          FROM (
            ${baseQuery}
            HAVING available_product < low_level
          ) AS filtered_products`;

      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Set headers and return the response
          res.setHeader("Content-Range", `understockProducts ${total}`);
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(finalResults);
        }
      });
    }
  });
};
module.exports = {
  understockProducts,
  understockProductsCount,
};
