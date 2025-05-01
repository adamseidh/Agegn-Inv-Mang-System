const db = require("../../../db");
const path = require("path");

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
      res.json(results[0]); //
    }
  });
};

const aSalesPayments = (req, res) => {
  const { id } = req.params;

  const query = `
          SELECT * FROM sells_payment WHERE sells_id = ? ORDER BY id DESC`;

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.json(results);
    }
  });
};

const addSalesPayment = async (req, res) => {
  try {
    const {
      amount,
      remark,
      payment_type,
      payment_option,
      payment_date,
      pre_notification_day,
      bank_name,
      account_number,
      sells_id,
      serverHost,
    } = req.body;
    console.log("amount", amount);

    console.log("serv", serverHost);

    const image = req.file ? req.file.filename : null;
    const payment_status =
      payment_type === "Paid" ? "Completed" : "Not Completed";

    const imagePath = image
      ? `${serverHost}/images/${path.basename(req.file.path)}`
      : null;

    const query = `
      INSERT INTO sells_payment 
      (sells_id, amount, remark, payment_type, payment_option, 
       payment_date, pre_notification_day, bank_name, account_number, 
       payment_status, payment_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        sells_id,
        amount,
        remark,
        payment_type,
        payment_option,
        payment_date,
        pre_notification_day,
        bank_name,
        account_number,
        payment_status,
        imagePath,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding payment:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to add payment",
          });
        }

        res.json({
          success: true,
          message: "Payment added successfully",
          payment: {
            id: result.insertId,
            amount,
            remark,
            payment_type,
            payment_option,
            payment_date,
            pre_notification_day,
            bank_name,
            account_number,
            payment_status,
            payment_image: imagePath,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error in addPayment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSalesPayment = (req, res) => {
  const {
    amount,
    remark,
    payment_type,
    payment_option,
    payment_date,
    pre_notification_day,
    payment_status,
    bank_name,
    account_number,
    oldImage,
    serverHost,
  } = req.body;

  const { id } = req.params;
  console.log("payment id", id);
  const image = req.file ? req.file.filename : null;

  // Determine the image path
  const imagePath = image
    ? `${serverHost}/images/${path.basename(req.file.path)}`
    : oldImage;

  const query = `
    UPDATE sells_payment 
    SET 
      amount = ?,
      remark = ?,
      payment_type = ?,
      payment_option = ?,
      payment_date = ?,
      pre_notification_day = ?,
      bank_name = ?,
      account_number = ?,
      payment_image = ?,
      payment_status = ?
    WHERE id = ?
  `;

  // Determine payment status based on type

  db.query(
    query,
    [
      amount,
      remark,
      payment_type,
      payment_option,
      payment_date,
      pre_notification_day,
      bank_name,
      account_number,
      imagePath,
      payment_status,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating payment:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update payment",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        message: "Payment updated successfully",
        updatedImage: imagePath,
      });
    }
  );
};

const deleteSalesPayment = (req, res) => {
  const { id } = req.params;
  console.log("product id", id);

  const query = "DELETE FROM sells_payment WHERE id = ?";

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

module.exports = {
  PurchaseList,
  SinglePurchaseData,
  aSalesPayments,
  addSalesPayment,
  updateSalesPayment,
  deleteItem,
  deleteSalesPayment,
};
