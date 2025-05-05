import React, { useState, useEffect } from "react";
import { FaXmark, FaDownload } from "react-icons/fa6";
import FormattedDate from "../../../../helpers/functions/FormattedDate";

const PaymentDetail = ({ isOpen, close, payment }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  console.log("payments", payment);
  useEffect(() => {
    // Reset image states when payment changes
    setImageLoaded(false);
    setImageError(false);
  }, [payment]);

  if (!isOpen) return null;

  const getFileNameFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split("/").pop();
    } catch (e) {
      return "receipt.jpg";
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = getFileNameFromUrl(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-4 p-8 w-3/4 max-w-4xl rounded-lg bg-white shadow-sm overflow-y-auto"
        style={{ height: "80vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between mb-6 border-b pb-1">
            <div className="">
              <p className="text-2xl font-bold text-gray-700">
                Payment Details
              </p>
            </div>
            <button
              onClick={close}
              className="text-2xl hover:text-red-700 text-red-500"
            >
              <FaXmark />
            </button>
          </div>

          <div className="space-y-6 flex-1 scrollable-column overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 border rounded-lg p-6 shadow-md">
              <h4 className="col-span-2 font-bold text-lg">
                Payment Information
              </h4>

              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">
                  Payment Type:
                </p>
                <p className="text-gray-700 font-semibold">
                  {payment.payment_type || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">
                  Payment Option:
                </p>
                <p className="text-gray-700 font-semibold">
                  {payment.payment_option || "N/A"}
                </p>
              </div>
              {payment.payment_option === "Check" && (
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">
                    Check No.:
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {payment.check_number || "N/A"}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Bank Name:</p>
                <p className="text-gray-700 font-semibold">
                  {payment.bank_name || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">
                  Account Number:
                </p>
                <p className="text-gray-700 font-semibold">
                  {payment.account_number || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Amount:</p>
                <p className="text-gray-700 font-semibold">{payment.amount}</p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">
                  Payment Date:
                </p>
                <p className="text-gray-700 font-semibold">
                  {FormattedDate(payment.payment_date) || "N/A"}
                </p>
              </div>

              {payment.payment_type === "Loan" && (
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">
                    Pre-notification Days:
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {payment.pre_notification_day}
                  </p>
                </div>
              )}

              <div className="space-y-1 col-span-2">
                <p className="text-gray-500 text-sm font-medium">Remark:</p>
                <p className="text-gray-700 font-semibold">
                  {payment.remark || "N/A"}
                </p>
              </div>

              {payment.payment_image && (
                <div className="space-y-1 col-span-2">
                  <p className="text-gray-500 text-sm font-medium">
                    Payment Receipt:
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="max-w-xs relative">
                      {!imageLoaded && !imageError && (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border">
                          <span className="text-gray-500">
                            Loading image...
                          </span>
                        </div>
                      )}
                      {imageError ? (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border">
                          <span className="text-gray-500">
                            Image not available
                          </span>
                        </div>
                      ) : (
                        <img
                          src={payment.payment_image}
                          alt="Payment receipt"
                          className={`max-h-40 rounded-md border ${
                            imageLoaded ? "block" : "hidden"
                          }`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleDownload(payment.payment_image)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
