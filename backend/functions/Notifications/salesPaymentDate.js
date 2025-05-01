const path = require("path");
const db = require("../../db");
const { sendToEmail } = require("./sendToEmail");

const SalesPayments = (req, res) => {
  const query = `
    SELECT 
      p.payment_date,
      p.pre_notification_day, 
      p.remark, 
      p.payment_status, 
      p.amount, 
      sl.id AS id,  
      sl.remark AS sellsRemark, 
      sl.created_at AS sellsDate, 
      c.name AS customerName
    FROM sells_payment p
    LEFT JOIN sells_list sl ON p.sells_id = sl.id
    LEFT JOIN customers c ON sl.customer_id = c.id
    WHERE 
      DATE(p.payment_date) <= CURDATE()
      AND p.payment_status = 'Not Completed'
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

const checkSalesPayments = async (req, res) => {
  try {
    // Query to find payments that are due today
    const query = `
  SELECT 
    p.payment_date,
    p.pre_notification_day, 
    p.remark, 
    p.payment_status, 
    p.amount, 
    sl.id AS id,  
    sl.remark AS sellsRemark, 
    sl.created_at AS sellsDate, 
    c.name AS customerName
  FROM sells_payment p
  LEFT JOIN sells_list sl ON p.sells_id = sl.id
  LEFT JOIN customers c ON sl.customer_id = c.id
  WHERE 
    DATE(p.payment_date) = CURDATE()
    AND p.payment_status = 'Not Completed'
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
            `Payment from customer "${payment.customerName}" after (${payment.pre_notification_day} is at(${payment.payment_date}). Amount: ${payment.amount}`
          );

          // Create notification in database and send email
          const notificationTitle = "Reached Sales Payment ";
          const notificationDescription = `Payment of ${payment.amount} ETB from customer ${payment.customerName} is today, on (${payment.payment_date}).`;

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
  SalesPayments,
  checkSalesPayments,
};
