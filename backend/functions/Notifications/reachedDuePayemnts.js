const path = require("path");
const db = require("../../db");
const { sendToEmail } = require("./sendToEmail");

const reachedDuePayments = (req, res) => {
  const query = `
  SELECT p.payment_date, p.remark, p.payment_status, p.amount, pl.id as id,  pl.remark AS purchaseRemark, pl.created_at AS purchaseDate, s.name AS supplierName
  FROM purchase_payment p
  LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
  LEFT JOIN supplier s ON pl.supplier_id = s.id
  WHERE DATE(payment_date) <= CURDATE() AND payment_status = 'Not Completed'
`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const countQuery = `SELECT COUNT(*) AS total FROM purchase_payment`;
      db.query(countQuery, (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          const total = countResult[0].total;

          res.setHeader("Content-Range", `purchase_payment ${total}`);
          res.setHeader("Access-Control-Expose-Headers", "Content-Range");
          res.json(results);
        }
      });
    }
  });
};

const checkPaymentDueDates = async (req, res) => {
  try {
    // Query to find payments that are due today
    const query = `
    SELECT p.payment_date, p.remark, p.payment_status, p.amount, pl.id as id,  pl.remark AS purchaseRemark, pl.created_at AS purchaseDate, s.name AS supplierName
    FROM purchase_payment p
    LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
    LEFT JOIN supplier s ON pl.supplier_id = s.id
    WHERE DATE(payment_date) <= CURDATE() AND payment_status = 'Not Completed'
  `;

    // For standard mysql package
    db.query(query, async (error, payments, fields) => {
      if (error) {
        console.error("Database error:", error);
        return;
      }

      if (payments && payments.length > 0) {
        console.log("=== PAYMENT DUE DATES FOUND ===");

        for (const payment of payments) {
          // Log to console
          console.log(
            `Payment for supplier "${payment.supplierName}" is due today (${payment.payment_date}). Amount: ${payment.amount}`
          );

          // Create notification in database and send email
          const notificationTitle = "Payment Due Date";
          const notificationDescription = `Payment of ${payment.amount} ETB for supplier ${payment.supplierName} is due today (${payment.payment_date}). Please process the payment.`;

          // Send email
          sendToEmail(notificationTitle, notificationDescription);

          // Insert notification
          const insertQuery = `
              INSERT INTO notifications 
              (title, description, status, date)
              VALUES (?, ?, 'Not Read', NOW())`;

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
          `=== Created ${payments.length} notifications for due payments ===`
        );
      } else {
        console.log("No payment due dates found for today");
      }
    });
  } catch (error) {
    console.error("Error in checkPaymentDueDates:", error);
  }
};
module.exports = {
  reachedDuePayments,
  checkPaymentDueDates,
};
