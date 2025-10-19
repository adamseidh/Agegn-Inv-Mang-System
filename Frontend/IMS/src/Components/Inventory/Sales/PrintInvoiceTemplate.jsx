import React from "react";
import logo from "../../../assets/Logo.jpg";

const PrintInvoiceTemplate = ({ sale }) => {
  if (!sale || sale.length === 0) return null;

  // Format date function (without time)
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
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

    return words.trim();
  };

  const subtotal = sale.reduce((sum, item) => sum + item.total_price, 0);
  const subtotalInWords = numberToWords(Math.floor(subtotal));

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "0mm 10mm",
        margin: "0 auto",
        fontSize: "12px",
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
      }}
      className="invoice-document"
    >
      {/* Watermark - Only show on first page */}
      <div
        className="watermark-first-page"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-45deg)",
          fontSize: "80px",
          fontWeight: "bold",
          color: "rgba(0, 0, 0, 0.1)",
          zIndex: -1,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        Attachment
      </div>

      {/* Header with Logo */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="invoice-header"
      >
        {/* Logo with better error handling */}
        <div
          style={{
            height: "130px",
            width: "180px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            fontSize: "18px",
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
          marginBottom: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "15px",
          gap: "20px",
        }}
        className="invoice-info"
      >
        <div style={{ flex: 1 }}>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Jimma, Oromia, Ethiopia
          </p>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Phone: +251 925 270 720
          </p>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Email: agegngeneralbme@gmail.com
          </p>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Website: www.agegnbiomedicalengineering.com
          </p>
          <p style={{ margin: "2px 0", fontWeight: "bold", fontSize: "11px" }}>
            TIN: 0082798197
          </p>
        </div>
        <div style={{ textAlign: "right", flex: 1 }}>
          <h2
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}
          >
            INVOICE
          </h2>

          {/* Invoice Date */}
          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>Date: {formatDate(new Date())}</p>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>Customer: {sale[0].customerName}</p>
          </div>
          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>
              Phone: {sale[0].phone ? sale[0].phone : "__________"}
            </p>
          </div>
          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>
              TIN/Lett.No.:{" "}
              {sale[0].tin
                ? sale[0].tin
                : sale[0].CustomerLetterNo
                ? sale[0].CustomerLetterNo
                : "__________"}
            </p>
          </div>

          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>
              Region:{" "}
              {sale[0].CustomerRegion ? sale[0].CustomerRegion : "__________"}
            </p>
          </div>
          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>
              Zone: {sale[0].zone ? sale[0].zone : "__________"}
            </p>
          </div>
          <div style={{ marginBottom: "3px" }}>
            <p style={{ fontSize: "11px" }}>
              City: {sale[0].CustomerCity ? sale[0].CustomerCity : "__________"}
            </p>
          </div>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Fs No: {sale[0].FsNumber}
          </p>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Invoice #: {sale[0].sells_id}
          </p>
        </div>
      </div>

      {/* Items Table - Fixed width and column sizes */}
      <div style={{ width: "100%", overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "30px",
            tableLayout: "fixed",
          }}
          className="invoice-table"
        >
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "10%",
                  wordWrap: "break-word",
                }}
              >
                Product ID
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "20%",
                  wordWrap: "break-word",
                }}
              >
                Product Name
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "12%",
                  wordWrap: "break-word",
                }}
              >
                Batch/Ser. No.
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "12%",
                  wordWrap: "break-word",
                }}
              >
                Expire Date
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "8%",
                  wordWrap: "break-word",
                }}
              >
                Unit
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "8%",
                  wordWrap: "break-word",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "15%",
                  wordWrap: "break-word",
                }}
              >
                Unit Price (birr)
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  fontSize: "10px",
                  fontWeight: "bold",
                  width: "15%",
                  wordWrap: "break-word",
                }}
              >
                Amount (birr)
              </th>
            </tr>
          </thead>
          <tbody>
            {sale.map((item, index) => (
              <tr key={index} className="table-row">
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                  }}
                >
                  {item.product_id}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                  }}
                >
                  {item.productName}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                  }}
                >
                  {item.batchNo
                    ? item.batchNo
                    : item.SerialNo
                    ? item.SerialNo
                    : "__________"}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                  }}
                >
                  {item.expireDate
                    ? formatDate(item.expireDate)
                    : "_______,_____"}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                  }}
                >
                  {item.measurementUnit}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textAlign: "right",
                  }}
                >
                  {item.unit_price.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                    fontSize: "10px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textAlign: "right",
                  }}
                >
                  {item.total_price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div
        style={{ textAlign: "right", marginBottom: "40px" }}
        className="invoice-totals"
      >
        <p style={{ margin: "5px 0", fontSize: "12px" }}>
          <strong>Subtotal:</strong> {Math.floor(subtotal)} birr
        </p>
        <p style={{ margin: "5px 0", fontStyle: "italic", fontSize: "11px" }}>
          (Amount in words: {subtotalInWords} birr)
        </p>
      </div>

      {/* Confirmation Section */}
      <div
        style={{
          marginBottom: "20px",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
        }}
        className="confirmation-section"
      >
        <p style={{ marginBottom: "30px", fontSize: "12px" }}>
          I, _________________________, hereby confirm that I have received the
          above-listed products in good condition, and acknowledge receipt with
          my signature.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "5px 0", fontSize: "12px" }}>
              Customer Signature
            </p>
            <div
              style={{
                height: "40px",
                borderBottom: "1px solid #999",
                width: "200px",
                margin: "5px 0",
              }}
            ></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "5px 0", fontSize: "12px" }}>Date</p>
            <div
              style={{
                height: "40px",
                borderBottom: "1px solid #999",
                width: "200px",
                margin: "5px 0",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "5px 0", fontSize: "12px" }}>
              Thank you for your business!
            </p>
            <p style={{ margin: "5px 0", fontWeight: "600", fontSize: "12px" }}>
              Agegn General Biomedical Engineering PLC
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "5px 0", fontSize: "12px" }}>Signature</p>
            <div
              style={{
                height: "40px",
                borderBottom: "1px solid #999",
                width: "200px",
                margin: "5px 0",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoiceTemplate;
