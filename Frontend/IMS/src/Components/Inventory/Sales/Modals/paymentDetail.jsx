import React from "react";
import { FaXmark } from "react-icons/fa6";
import FormattedDate from "../../../../helpers/functions/FormattedDate";

const PaymentDetail = ({ isOpen, close, payment }) => {
  if (!isOpen) return null;

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
                  Payment Method:
                </p>
                <p className="text-gray-700 font-semibold">
                  {payment.payment_option || "N/A"}
                </p>
              </div>

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

              {payment.paymentImage && (
                <div className="space-y-1 col-span-2">
                  <p className="text-gray-500 text-sm font-medium">
                    Payment Receipt:
                  </p>
                  {typeof payment.paymentImage === "string" ? (
                    <a
                      href={payment.paymentImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Receipt
                    </a>
                  ) : (
                    <p className="text-gray-700 font-semibold">File uploaded</p>
                  )}
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
