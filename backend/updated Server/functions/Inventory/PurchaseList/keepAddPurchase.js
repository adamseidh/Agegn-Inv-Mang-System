const db = require("../../../db");
const path = require("path");
const AddPurchase = (req, res) => {
  const { supplier, remark, serverHost, products, payments } = req.body;

  console.log("Received data:", {
    supplier,
    remark,
    serverHost,
    products,
    payments,
  });

  // Insert purchase
  const purchaseQuery =
    "INSERT INTO purchase_list (remark,supplier_id) VALUES (?,?)";
  db.query(
    purchaseQuery,
    [remark || null, supplier || null],
    (err, purchaseResult) => {
      if (err) {
        console.log("err", err);
        return res.status(500).json({ message: err.message });
      }

      const purchaseId = purchaseResult.insertId;

      // Process products with proper null handling
      const productQuery =
        "INSERT INTO product_list (purchase_id,item_id, brand,description, quantity,expire_date, purchase_date, serial_number,batch_number, purchase_price, additional_cost, overall_cost, selling_price, image) VALUES ?";

      const productValues = products.map((product, index) => [
        purchaseId,
        product.item_id || null,
        product.brand || null,
        product.description || null,
        product.quantity ? Number(product.quantity) : null,
        product.expire_date || null, // Can be null
        product.purchase_date ||
          new Date().toISOString().slice(0, 19).replace("T", " "), // Default to current date if not provided
        product.serial_number || null,
        product.batch_number || null,
        product.purchase_price ? Number(product.purchase_price) : null,
        product.additional_cost ? Number(product.additional_cost) : 0, // Default to 0 if not provided
        product.overall_cost ? Number(product.overall_cost) : null,
        product.selling_price ? Number(product.selling_price) : null,
        req.files["productsImages"] && req.files["productsImages"][index]
          ? `${serverHost}/images/${path.basename(
              req.files["productsImages"][index].path
            )}`
          : null,
      ]);

      db.query(productQuery, [productValues], (err, productResult) => {
        if (err) {
          console.log("err", err);
          return res.status(500).json({ message: err.message });
        }

        const productIds = productResult.insertId;

        // Process costs with proper null handling
        const costQuery =
          "INSERT INTO cost_list (product_id, title, amount) VALUES ?";

        const costValues = products.flatMap((product, productIndex) => {
          if (!product.costs || !Array.isArray(product.costs)) return [];
          return product.costs.map((cost) => [
            productIds + productIndex,
            cost.title || null,
            cost.amount ? Number(cost.amount) : 0, // Default to 0 if not provided
          ]);
        });

        // Only insert costs if there are any
        if (costValues.length > 0) {
          db.query(costQuery, [costValues], (err, costResult) => {
            if (err) {
              console.log("err", err);
              return res.status(500).json({ message: err.message });
            }
            processPayments();
          });
        } else {
          processPayments();
        }

        function processPayments() {
          // Process payments with proper null handling
          const paymentQuery =
            "INSERT INTO purchase_payment (purchase_id, amount,payment_type, payment_option,payment_date, pre_notification_day, bank_name,account_number,remark, payment_status , payment_image) VALUES ?";

          const paymentValues = payments.map((payment, index) => [
            purchaseId,
            payment.amount ? Number(payment.amount) : null,
            payment.payment_type || null,
            payment.payment_option || null,
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

          db.query(paymentQuery, [paymentValues], (err, paymentResult) => {
            if (err) {
              console.log("err", err);
              return res.status(500).json({ message: err.message });
            }
            res.json({
              message:
                "Purchase, products, costs, and payments added successfully",
            });
          });
        }
      });
    }
  );
};

module.exports = { AddPurchase };
