const db = require("../../../db");
const { insertUserHistory } = require("../../Users/history");
const path = require("path");

const submitSale = (req, res) => {
  const {
    items,
    totalPrice,
    totalItems,
    customer,
    remark,
    sales_source,
    userId,
    payments,
  } = req.body;

  // Parse JSON strings
  const parsedItems = JSON.parse(items);
  const parsedPayments = payments ? JSON.parse(payments) : [];

  if (!parsedItems || !Array.isArray(parsedItems)) {
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
      "INSERT INTO sells_list (customer_id, total_items, total_price, remark, sells_source, order_confirmation, sells_status, userId) VALUES (?,?,?,?,?,?,?,?)",
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
        const productValues = parsedItems.map((item) => [
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

            // 3. Process payments if they exist
            if (parsedPayments && parsedPayments.length > 0) {
              const serverHost = `${req.protocol}://${req.get("host")}`;

              const paymentValues = parsedPayments.map((payment, index) => [
                saleId,
                payment.amount ? Number(payment.amount) : null,
                payment.payment_type || null,
                payment.payment_option || null,
                payment.check_number || null,
                payment.payment_date || null,
                payment.pre_notification_day || null,
                payment.bank_name || null,
                payment.account_number || null,
                payment.remark || null,
                payment.payment_type === "Paid" ? "Completed" : "Not Completed",
                req.files["paymentImages"] && req.files["paymentImages"][index]
                  ? `${serverHost}/images/${path.basename(
                      req.files["paymentImages"][index].path
                    )}`
                  : null,
              ]);

              db.query(
                "INSERT INTO sells_payment (sells_id, amount, payment_type, payment_option,check_number, payment_date, pre_notification_day, bank_name, account_number, remark, payment_status, payment_image) VALUES ?",
                [paymentValues],
                (paymentErr) => {
                  if (paymentErr) {
                    return db.rollback(() => {
                      console.error(
                        "Insert into sells_payment error:",
                        paymentErr
                      );
                      res.status(500).json({ message: paymentErr.message });
                    });
                  }

                  // Commit transaction if everything succeeds
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
                      message: "Sale and payments recorded successfully",
                      saleId,
                    });
                  });
                }
              );
            } else {
              // Commit transaction if no payments
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
                  message: "Sale recorded successfully (no payments)",
                  saleId,
                });
              });
            }
          }
        );
      }
    );
  });
};

const updatSales = (req, res) => {
  const { items, totalPrice, totalItems, customer, remark, userId, saleId } =
    req.body;

  console.log("saleId", saleId);
  console.log("sales data", items);
  console.log("customer id", customer);
  console.log("remark", remark);

  // Dynamically build the query and values based on whether customer is provided
  let updateSellsListQuery = `
    UPDATE sells_list 
    SET total_items = ?, total_price = ?, remark = ?
  `;
  let values = [totalItems, totalPrice, remark];

  if (customer !== undefined && customer !== null && customer !== "") {
    updateSellsListQuery = `
      UPDATE sells_list 
      SET customer_id = ?, total_items = ?, total_price = ?, remark = ?
    `;
    values = [customer, totalItems, totalPrice, remark];
  }

  updateSellsListQuery += ` WHERE id = ?`;
  values.push(saleId);

  // Execute sells_list update
  db.query(updateSellsListQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating sells_list:", err);
      return res.status(500).json({ error: "Failed to update sells_list" });
    }

    // Update sells_product for each item
    const updateProductPromises = items.map((item) => {
      const updateProductQuery = `
        UPDATE sells_product 
        SET product_id = ?, quantity = ?, unit_price = ?, total_price = ?
        WHERE id = ?
      `;
      const values = [
        item.product_id,
        item.quantity,
        item.unit_price,
        item.total_price,
        item.id,
      ];

      return new Promise((resolve, reject) => {
        db.query(updateProductQuery, values, (err, result) => {
          if (err) {
            console.error("Error updating sells_product for ID:", item.id, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    Promise.all(updateProductPromises)
      .then(() => {
        res.status(200).json({
          message: "Sales record updated successfully",
          success: true,
        });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "Failed to update one or more products" });
      });
  });
};

const fetchSellsProducts = (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT sp.* , c.name as customerName, c.phone,c.zone , c.region as CustomerRegion, c.wereda_or_city as CustomerCity, c.tin, c.letter_no as  CustomerLetterNo, sl.created_at as sellsDate, i.name as productName, PL.expire_date as expireDate, PL.batch_number as batchNo , PL.serial_number as SerialNo, i.unit as measurementUnit FROM sells_product sp 
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

const deleteSalesProduct = (req, res) => {
  const { id } = req.params;
  console.log("sales id", id);

  const query = "DELETE FROM sells_product WHERE id = ?";

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

const addSellsOnEdit = (req, res) => {
  const { sells_id, product_id, quantity, unit_price, total_price } = req.body;

  console.log("sales id", sells_id);
  console.log("others", product_id, quantity, unit_price, total_price);

  const query = `
        INSERT INTO sells_product (sells_id, product_id, quantity, unit_price, total_price)
        VALUES (?,?,?,?,?)
    `;

  const values = [sells_id, product_id, quantity, unit_price, total_price];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ success: true });
  });
};

module.exports = {
  submitSale,
  fetchSellsProducts,
  updatSales,
  deleteSalesProduct,
  addSellsOnEdit,
};
