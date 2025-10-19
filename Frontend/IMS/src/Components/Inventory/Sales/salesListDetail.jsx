import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faArrowLeft,
  faDownload,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import html2pdf from "html2pdf.js";
import PrintInvoiceTemplate from "./PrintInvoiceTemplate";

function SalesListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverHost}/salesList/${id}`);
        setSale(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch sale data");
        setLoading(false);
      }
    };

    fetchSaleData();
  }, [id, serverHost]);

  console.log("sales data now", sale);
  console.log("hie");

  const handlePrint = () => {
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `invoice_${sale[0].sells_id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate PDF and open print dialog
    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.text(
            "Page " + i + " of " + totalPages,
            pdf.internal.pageSize.getWidth() - 30,
            pdf.internal.pageSize.getHeight() - 10
          );
        }
      })
      .save()
      .then(() => {
        // After saving, open print dialog
        window.print();
      });
  };

  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `invoice_${sale[0].sells_id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate and download PDF directly
    html2pdf().set(opt).from(element).save();
  };

  const handleEdit = () => {
    navigate("/editSales", { state: { salesData: sale, saleId: id } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!sale) return <div>No sale data found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with back and print buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/salesList")}
            className="flex items-center gap-2 text-primaryColor hover:text-opacity-80 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit Sales
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <FontAwesomeIcon icon={faPrint} />
                Generate Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Visible content */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          {/* Customer info */}
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Customer:</span>{" "}
                    {sale[0].customerName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Fs No:</span>{" "}
                    {sale[0].FsNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(sale[0].sellsDate).toLocaleDateString()}
                  </p>
                </div>
                {/* <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Order ID:</span>{" "}
                    {sale[0].sells_id}
                  </p>
                </div> */}
                {/* <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Items:</span> {sale.length}
                  </p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Products table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sale.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.measurementUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unit_price.toFixed(2)} birr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.total_price.toFixed(2)} birr
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase"
                  >
                    Subtotal
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {sale
                      .reduce((sum, item) => sum + item.total_price, 0)
                      .toFixed(2)}{" "}
                    birr
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Hidden content for PDF generation */}
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <PrintInvoiceTemplate sale={sale} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesListDetail;
