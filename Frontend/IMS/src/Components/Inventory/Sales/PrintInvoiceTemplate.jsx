import React from "react";
import logo from "../../../assets/Logo.jpg";
const PrintInvoiceTemplate = ({ sale }) => {
  if (!sale || sale.length === 0) return null;

  // Format date function (without time)
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to convert numbers to words
  const numberToWords = (num) => {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const tens = [
      "",
      "ten",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    if (num === 0) return "zero";
    if (num < 0) return "minus " + numberToWords(Math.abs(num));

    let words = "";

    if (Math.floor(num / 1000000) > 0) {
      words += numberToWords(Math.floor(num / 1000000)) + " million ";
      num %= 1000000;
    }

    if (Math.floor(num / 1000) > 0) {
      words += numberToWords(Math.floor(num / 1000)) + " thousand ";
      num %= 1000;
    }

    if (Math.floor(num / 100) > 0) {
      words += numberToWords(Math.floor(num / 100)) + " hundred ";
      num %= 100;
    }

    if (num > 0) {
      if (words !== "") words += "and ";

      if (num < 10) {
        words += ones[num];
      } else if (num >= 10 && num < 20) {
        words += teens[num - 10];
      } else {
        words += tens[Math.floor(num / 10)];
        if (num % 10 > 0) {
          words += " " + ones[num % 10];
        }
      }
    }

    return words.trim() + " birr";
  };

  const subtotal = sale.reduce((sum, item) => sum + item.total_price, 0);
  const subtotalInWords = numberToWords(Math.floor(subtotal));

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "10px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontSize: "14px", // Reduced base font size
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo with better error handling */}
        <div
          style={{
            height: "80px",
            width: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <img
            src={logo}
            alt="Company Logo"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span style={{ display: "none", color: "#666" }}>[Company Logo]</span>
        </div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          Agegn General Biomedical Engineering PLC
        </h1>
      </div>

      {/* Invoice Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
          borderBottom: "1px solid #eee",
          paddingBottom: "20px",
        }}
      >
        <div>
          <p style={{ margin: "3px 0" }}>Jimma, Oromia, Ethiopia</p>
          <p style={{ margin: "3px 0" }}>Phone: +251 925 270 720</p>
          <p style={{ margin: "3px 0" }}>Email: agegngeneralbme@gmail.com</p>
          <p style={{ margin: "3px 0" }}>
            Website: www.agegnbiomedicalengineering.com
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2
            style={{ fontSize: "20px", fontWeight: "600", marginBottom: "5px" }}
          >
            INVOICE
          </h2>
          {/* Customer Info */}
          <div style={{ marginBottom: "5px" }}>
            <p>Customer: {sale[0].customerName}</p>
          </div>
          <div style={{ marginBottom: "5px" }}>
            <p>Phone: {sale[0].phone}</p>
          </div>
          <div style={{ marginBottom: "5px" }}>
            <p>
              TIN/Lett.No.:{" "}
              {sale[0].tin
                ? sale[0].tin
                : sale[0].CustomerLetterNo
                ? sale[0].CustomerLetterNo
                : "______"}
            </p>
          </div>

          <div style={{ marginBottom: "5px" }}>
            <p>
              Address: {sale[0].CustomerRegion}, {sale[0].CustomerCity}
            </p>
          </div>

          <p style={{ margin: "3px 0" }}>Invoice #: {sale[0].sells_id}</p>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
        }}
      >
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Product
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Batch/Ser. No.
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Expire Date
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Unit
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Qty
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Unit Price (birr)
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                border: "1px solid #ddd",
              }}
            >
              Amount (birr)
            </th>
          </tr>
        </thead>
        <tbody>
          {sale.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.productName}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.batchNo
                  ? item.batchNo
                  : item.SerialNo
                  ? item.SerialNo
                  : "__________"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.expireDate
                  ? formatDate(item.expireDate)
                  : "____,____,____"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.measurementUnit}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.quantity}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.unit_price.toFixed(2)}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.total_price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ textAlign: "right", marginBottom: "40px" }}>
        <p style={{ margin: "5px 0" }}>
          <strong>Subtotal:</strong> {Math.floor(subtotal)} birr
        </p>
        <p style={{ margin: "5px 0", fontStyle: "italic" }}>
          (Amount in words: {subtotalInWords})
        </p>
      </div>

      {/* Confirmation Section */}
      <div
        style={{
          marginBottom: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
        }}
      >
        <p style={{ marginBottom: "30px" }}>
          I, _________________________, received the listed products above
          happily. I confirm with my signature.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "5px 0" }}>Customer Signature</p>
            <div
              style={{
                height: "50px",
                borderBottom: "1px solid #999",
                width: "200px",
                margin: "10px 0",
              }}
            ></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "5px 0" }}>Date</p>
            <div
              style={{
                height: "50px",
                borderBottom: "1px solid #999",
                width: "200px",
                margin: "10px 0",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "20px",
          marginTop: "40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "5px 0" }}>Thank you for your business!</p>
            <p style={{ margin: "5px 0", fontWeight: "600" }}>
              Agegn General Biomedical Engineering PLC
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "5px 0" }}>Signature</p>
            <div
              style={{
                height: "50px",
                borderBottom: "1px solid #999",
                width: "200px",
                margin: "10px 0",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoiceTemplate;
