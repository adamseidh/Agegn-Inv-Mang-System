const db = require("../../db");

const soldProducts = (req, res) => {
  const query = `
      SELECT sp.*, sl.created_at as salesDate, i.name as productName, pl.overall_cost as productCost 
      FROM sells_product sp
      LEFT JOIN sells_list sl ON sp.sells_id = sl.id
      LEFT JOIN product_list pl ON sp.product_id = pl.id
      LEFT JOIN items i ON pl.item_id = i.id
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    // Filter out rows with null ID
    const filtered = results.filter((row) => row.id !== null);

    // Summarize by productName + dateOnly
    const summarized = Object.values(
      filtered.reduce((acc, row) => {
        const dateOnly = new Date(row.salesDate).toISOString().split("T")[0];
        const key = `${row.productName}_${dateOnly}`;

        if (!acc[key]) {
          acc[key] = {
            ...row,
            quantity: Number(row.quantity) || 0,
            total_price: Number(row.total_price) || 0,
            productCost: Number(row.productCost) || 0,
          };
        } else {
          acc[key].quantity += Number(row.quantity) || 0;
          acc[key].total_price += Number(row.total_price) || 0;
          acc[key].productCost += Number(row.productCost) || 0;
        }

        return acc;
      }, {})
    );

    res.json(summarized);
  });
};

const purchasedProducts = (req, res) => {
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
    whereClause += ` AND (TIN LIKE '%${q}%' OR phone LIKE '%${q}%' OR name LIKE '%${q}%')`;
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

  const query = `SELECT pl.*, i.name as productName, 
       (SELECT payment_status FROM purchase_payment WHERE purchase_id = pl.purchase_id LIMIT 1) as payment_status,
       (SELECT amount FROM purchase_payment WHERE purchase_id = pl.purchase_id LIMIT 1) as paymentAmount
FROM product_list pl
LEFT JOIN items i ON pl.item_id = i.id
    `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM product_list ${whereClause}`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          // Calculate the summation for each column
          const totalRow = {
            id: null,
            source: "Total",
            amount: results
              .reduce((sum, row) => sum + parseFloat(row.amount || 0), 0)
              .toString(),
          };

          // Append the total row to the results
          results.push(totalRow);

          // Set headers and return the response
          res.setHeader("Content-Range", `product_list ${total}`);
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const FinancialAnalaysis = (req, res) => {
  const { range, sort, filter } = req.query;
  const [from, to] = range ? JSON.parse(range) : [0, 100];
  const [sortField, sortOrder] = sort ? JSON.parse(sort) : ["id", "ASC"];

  const query = `
    SELECT sp.*, sl.created_at as salesDate, i.name as productName, pl.overall_cost as productCost 
    FROM sells_product sp
    LEFT JOIN sells_list sl ON sp.sells_id = sl.id
    LEFT JOIN product_list pl ON sp.product_id = pl.id
    LEFT JOIN items i ON pl.item_id = i.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    // Filter out rows with null ID
    const filtered = results.filter((row) => row.id !== null);

    // Summarize by productName + dateOnly
    const summarized = Object.values(
      filtered.reduce((acc, row) => {
        const dateOnly = new Date(row.salesDate).toISOString().split("T")[0];
        const key = `${row.productName}_${dateOnly}`;

        if (!acc[key]) {
          acc[key] = {
            ...row,
            quantity: Number(row.quantity) || 0,
            total_price: Number(row.total_price) || 0,
            productCost: Number(row.productCost) || 0,
          };
        } else {
          acc[key].quantity += Number(row.quantity) || 0;
          acc[key].total_price += Number(row.total_price) || 0;
          acc[key].productCost += Number(row.productCost) || 0;
        }

        return acc;
      }, {})
    );

    // Apply sorting
    const sorted = summarized.sort((a, b) => {
      if (sortOrder === "ASC") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

    // Apply pagination
    const paginated = sorted.slice(from, to + 1);

    res.setHeader(
      "Content-Range",
      `saledproducts ${from}-${to}/${summarized.length}`
    );
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.json(paginated);
  });
};

module.exports = {
  soldProducts,
  purchasedProducts,
  FinancialAnalaysis,
};
