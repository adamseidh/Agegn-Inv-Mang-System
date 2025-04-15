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

  // if (!supplierName || !products || !Array.isArray(products)) {
  //     console.log('something is null')
  //     return res.status(400).json({ message: "Invalid input data" });
  // }

  // Insert purchase
  const purchaseQuery =
    "INSERT INTO purchase_list (remark,supplier_id) VALUES (?,?)";
  db.query(purchaseQuery, [remark, supplier], (err, purchaseResult) => {
    if (err) {
      console.log("err", err);
      return res.status(500).json({ message: err.message });
    }

    const purchaseId = purchaseResult.insertId;

    // Insert products
    const productQuery =
      "INSERT INTO product_list (purchase_id,item_id, brand,description,unit, quantity,expire_date, purchase_date, serial_number,batch_number, purchase_price, additional_cost, overall_cost, selling_price, image) VALUES ?";
    const productValues = products.map((product, index) => [
      purchaseId,
      product.item_id,
      product.brand,
      product.description,
      product.unit,
      product.quantity,
      product.expire_date,
      product.purchase_date,
      product.serial_number,
      product.batch_number,
      product.purchase_price,
      product.additional_cost,
      product.overall_cost,
      product.selling_price,
      req.files["productsImages"] && req.files["productsImages"][index]
        ? `${serverHost}/${path.basename(
            req.files["productsImages"][index].path
          )}`
        : null, // Save only the file name
    ]);

    db.query(productQuery, [productValues], (err, productResult) => {
      if (err) {
        console.log("err", err);
        return res.status(500).json({ message: err.message });
      }

      const productIds = productResult.insertId;

      // Insert cost details
      const costQuery =
        "INSERT INTO cost_list (product_id, title, amount) VALUES ?";
      const costValues = products.flatMap((product, productIndex) =>
        product.costs.map((cost) => [
          productIds + productIndex,
          cost.title,
          cost.amount,
        ])
      );

      db.query(costQuery, [costValues], (err, costResult) => {
        if (err) {
          console.log("err", err);
          return res.status(500).json({ message: err.message });
        }

        // Insert payments
        const paymentQuery =
          "INSERT INTO purchase_payment (purchase_id, amount,payment_type, payment_option,payment_date, pre_notification_day, bank_name,account_number,remark, payment_status , payment_image) VALUES ?";
        const paymentValues = payments.map((payment, index) => [
          purchaseId,
          payment.amount,
          payment.payment_type,
          payment.payment_option,
          payment.payment_date,
          payment.pre_notification_day,
          payment.bank_name,
          payment.account_number,
          payment.remark,
          payment.payment_type == "Paid" ? "Completed" : "Not Completed",
          req.files["paymentImages"] && req.files["paymentImages"][index]
            ? `${serverHost}/${path.basename(
                req.files["paymentImages"][index].path
              )}`
            : null, // Save only the file name
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
      });
    });
  });
};
module.exports = { AddPurchase };
