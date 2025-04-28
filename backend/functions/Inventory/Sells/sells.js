const db = require("../../../db");
const { insertUserHistory } = require("../../Users/history");

const submitSale = (req, res) => {
  const {
    items,
    totalPrice,
    totalItems,
    customer,
    remark,
    sales_source,
    userId,
  } = req.body;

  console.log("custo", remark);

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items data" });
  }

  const sells_source = sales_source ? sales_source : "System";
  const order_confirmation = sales_source ? "Not Confirmed" : "System";
  const sells_status = sales_source ? "Processing" : "Completed";
  const the_remark = remark ? remark : "No remark";

  // Start transaction
  db.beginTransaction((beginErr) => {
    if (beginErr) {
      console.error("Transaction begin error:", beginErr);
      return res.status(500).json({ message: beginErr.message });
    }

    // 1. Insert into sells_list
    db.query(
      "INSERT INTO sells_list (customer_id, total_items, total_price, remark,sells_source,order_confirmation,sells_status, userId) VALUES (?,?,?,?,?, ?, ?,?)",
      [
        customer,
        totalItems,
        totalPrice,
        the_remark,
        sells_source,
        order_confirmation,
        sells_status,
        userId,
      ],
      (insertErr, saleResult) => {
        if (insertErr) {
          return db.rollback(() => {
            console.error("Insert into sells_list error:", insertErr);
            res.status(500).json({ message: insertErr.message });
          });
        }

        const saleId = saleResult.insertId;
        const productValues = items.map((item) => [
          saleId,
          item.id,
          item.quantity,
          item.selling_price,
          item.totalPrice,
        ]);

        // 2. Insert into sells_product
        db.query(
          "INSERT INTO sells_product (sells_id, product_id, quantity, unit_price, total_price) VALUES ?",
          [productValues],
          (productsErr) => {
            if (productsErr) {
              return db.rollback(() => {
                console.error("Insert into sells_product error:", productsErr);
                res.status(500).json({ message: productsErr.message });
              });
            }

            // 3. Update product availability (commented out as per your code)
            // If you want to enable this, uncomment and adjust the logic

            // Commit transaction
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  console.error("Commit error:", commitErr);
                  res.status(500).json({ message: commitErr.message });
                });
              }

              insertUserHistory(userId, "Inserted Product Sells");

              res.json({
                success: true,
                message: "Sale recorded successfully",
                saleId,
              });
            });
          }
        );
      }
    );
  });
};

const fetchSellsProducts = (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT sp.* , c.name as customerName, c.phone, c.region as CustomerRegion, c.wereda_or_city as CustomerCity, c.tin, c.letter_no as  CustomerLetterNo, sl.created_at as sellsDate, i.name as productName, PL.expire_date as expireDate, PL.batch_number as batchNo , PL.serial_number as SerialNo, i.unit as measurementUnit FROM sells_product sp 
  LEFT JOIN sells_list sl
  ON sp.sells_id = sl.id
  LEFT JOIN customers c
  ON sl.customer_id = c.id
  LEFT JOIN product_list PL 
  ON sp.product_id = PL.id
  LEFT JOIN items i 
  ON PL.item_id = i.id
   WHERE sells_id = ? `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.json(results);
    }
  });
};

module.exports = { submitSale, fetchSellsProducts };
