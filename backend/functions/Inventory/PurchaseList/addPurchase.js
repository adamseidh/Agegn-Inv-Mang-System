const db = require("../../../db");
const path = require("path");
const AddPurchase = (req, res) => {
    const { supplierName, serverHost, purchaseDate, products, payments } = req.body;

    console.log("Received data:", { supplierName, serverHost, purchaseDate, products, payments });

    // // if (!supplierName || !purchaseDate || !products || !Array.isArray(products)) {
    // //     console.log('something is null')
    // //     return res.status(400).json({ message: "Invalid input data" });
    // // }

    // // Insert purchase
    // const purchaseQuery = "INSERT INTO purchase_list (remark) VALUES (?)";
    // db.query(purchaseQuery, ['supplierName', purchaseDate], (err, purchaseResult) => {
    //     if (err) {
    //         console.log('err', err);
    //         return res.status(500).json({ message: err.message });
    //     }

    //     const purchaseId = purchaseResult.insertId;

    //     // Insert products
    //     const productQuery = "INSERT INTO product_list (purchase_id, brand, description, image) VALUES ?";
    //     const productValues = products.map((product, index) => [
    //         purchaseId,
    //         product.brand,
    //         product.description,
    //         req.files["productsImages"] && req.files["productsImages"][index]
    //             ? `${serverHost}/${path.basename(req.files["productsImages"][index].path)}`
    //             : null, // Save only the file name
    //     ]);

    //     db.query(productQuery, [productValues], (err, productResult) => {
    //         if (err) {
    //             console.log('err', err);
    //             return res.status(500).json({ message: err.message });
    //         }

    //         const productIds = productResult.insertId;

    //         // Insert cost details
    //         const costQuery = "INSERT INTO cost_list (product_id, title, amount) VALUES ?";
    //         const costValues = products.flatMap((product, productIndex) =>
    //             product.costs.map((cost) => [productIds + productIndex, cost.title, cost.amount])
    //         );

    //         db.query(costQuery, [costValues], (err, costResult) => {
    //             if (err) {
    //                 console.log('err', err);
    //                 return res.status(500).json({ message: err.message });
    //             }

    //             // Insert payments
    //             const paymentQuery = "INSERT INTO purchase_payment (purchase_id, amount, payment_image) VALUES ?";
    //             const paymentValues = payments.map((payment, index) => [
    //                 purchaseId,
    //                 payment.amount,
    //                 req.files["paymentImages"] && req.files["paymentImages"][index]
    //                     ? `${serverHost}/${path.basename(req.files["paymentImages"][index].path)}`
    //                     : null, // Save only the file name
    //             ]);

    //             db.query(paymentQuery, [paymentValues], (err, paymentResult) => {
    //                 if (err) {
    //                     console.log('err', err);
    //                     return res.status(500).json({ message: err.message });
    //                 }
    //                 res.json({ message: "Purchase, products, costs, and payments added successfully" });
    //             });
    //         });
    //     });
    // });
};
module.exports = { AddPurchase };