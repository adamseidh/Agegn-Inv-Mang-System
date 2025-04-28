const path = require("path");
const db = require("../../db");
const { sendToEmail } = require("./sendToEmail");

const upcamingPayments = (req, res) => {
  const query = `
  SELECT p.payment_date,p.pre_notification_day, p.remark, p.payment_status, p.amount, pl.id as id,  pl.remark AS purchaseRemark, pl.created_at AS purchaseDate, s.name AS supplierName
  FROM purchase_payment p
  LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
  LEFT JOIN supplier s ON pl.supplier_id = s.id
  WHERE DATE(payment_date)  > CURDATE() AND DATE(payment_date) <= (CURDATE()+ p.pre_notification_day) AND payment_status = 'Not Completed'
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

const checkUpcamingPayments = async (req, res) => {
  try {
    // Query to find payments that are due today
    const query = `
    SELECT p.payment_date, p.remark, p.payment_status, p.pre_notification_day,  p.amount, pl.id as id,  pl.remark AS purchaseRemark, pl.created_at AS purchaseDate, s.name AS supplierName
    FROM purchase_payment p
    LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
    LEFT JOIN supplier s ON pl.supplier_id = s.id
    WHERE DATE(payment_date) = (CURDATE()+ p.pre_notification_day) AND payment_status = 'Not Completed'
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
          // Log to
          console.log(
            `Payment for supplier "${payment.supplierName}" after (${payment.pre_notification_day} is at(${payment.payment_date}). Amount: ${payment.amount}`
          );

          // Create notification in database and send email
          const notificationTitle = "Upcaming Payment ";
          const notificationDescription = `Payment of ${payment.amount} ETB for supplier ${payment.supplierName} is after ${payment.pre_notification_day} day, on (${payment.payment_date}). Please prepare the payment.`;

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
      }
    });
  } catch (error) {
    console.error("Error in checkPaymentDueDates:", error);
  }
};
module.exports = {
  upcamingPayments,
  checkUpcamingPayments,
};
