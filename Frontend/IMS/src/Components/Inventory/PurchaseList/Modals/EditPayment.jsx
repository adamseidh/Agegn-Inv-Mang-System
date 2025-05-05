import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

const EditPayment = ({ isOpen, close, payment, updatePayment }) => {
  const [editedPayment, setEditedPayment] = useState({
    amount: "",
    remark: "",
    payment_type: "",
    payment_option: "",
    check_number: "",
    payment_date: "",
    pre_notification_day: 3,
    bank_name: "",
    account_number: "",
    paymentImage: null,
  });

  // Initialize form when payment data becomes available
  useEffect(() => {
    if (payment) {
      setEditedPayment({
        amount: payment.amount || "",
        remark: payment.remark || "",
        payment_type: payment.payment_type || "",
        payment_option: payment.payment_option || "",
        check_number: payment.check_number || "",
        payment_date: payment.payment_date || "",
        pre_notification_day: payment.pre_notification_day || 3,
        bank_name: payment.bank_name || "",
        account_number: payment.account_number || "",
        paymentImage: payment.paymentImage || null,
      });
    }
  }, [payment]);

  const handleChange = (e, field) => {
    setEditedPayment({ ...editedPayment, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEditedPayment({ ...editedPayment, paymentImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePayment(editedPayment);
    close();
  };

  if (!isOpen || !payment) return null;
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
              <p className="text-2xl font-bold text-gray-700">Edit Payment</p>
            </div>
            <button
              onClick={close}
              className="text-2xl hover:text-red-700 text-red-500"
            >
              <FaXmark />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex-1 scrollable-column overflow-y-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 border rounded-lg p-6 shadow-md">
              <h4 className="col-span-3 font-bold text-lg">
                Payment Information
              </h4>

              <div className="relative">
                <label className="inputLabel">Payment Type</label>
                <select
                  value={editedPayment.payment_type}
                  onChange={(e) => handleChange(e, "payment_type")}
                  className="primaryInput peer"
                  required
                >
                  <option value="">--Select--</option>
                  <option value="Paid">Paid</option>
                  <option value="Loan">Loan</option>
                </select>
              </div>

              <div className="relative">
                <label className="inputLabel">Payment Options</label>
                <select
                  value={editedPayment.payment_option}
                  onChange={(e) => handleChange(e, "payment_option")}
                  className="primaryInput peer"
                  required
                >
                  <option value="">--Select--</option>
                  <option value={"Cash"}>Cash</option>
                  <option value={"Check"}>Check</option>
                  <option value={"Transfer"}>Transfer</option>
                </select>
              </div>

              {editedPayment.payment_option === "Check" && (
                <div className="relative">
                  <input
                    type="text"
                    className="primaryInput peer"
                    placeholder=" "
                    value={editedPayment.check_number}
                    onChange={(e) => handleChange(e, "check_number")}
                    onWheel={(e) => {
                      // Prevent increment/decrement using mouse wheel
                      e.target.blur(); // Remove focus from the input to prevent changes
                    }}
                    required
                  />
                  <label className="inputLabel">Check Number</label>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedPayment.bank_name}
                  onChange={(e) => handleChange(e, "bank_name")}
                />
                <label className="inputLabel">Bank Name</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedPayment.account_number}
                  onChange={(e) => handleChange(e, "account_number")}
                />
                <label className="inputLabel">Account Number</label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedPayment.amount}
                  onChange={(e) => handleChange(e, "amount")}
                  onWheel={(e) => e.target.blur()}
                  required
                />
                <label className="inputLabel">Amount</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedPayment.remark}
                  onChange={(e) => handleChange(e, "remark")}
                  required
                />
                <label className="inputLabel">Remark</label>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedPayment.payment_date}
                  onChange={(e) => handleChange(e, "payment_date")}
                  required
                />
                <label className="inputLabel">Payment Date</label>
              </div>

              {editedPayment.payment_type === "Loan" && (
                <div className="relative">
                  <input
                    type="number"
                    className="primaryInput peer"
                    placeholder=" "
                    value={editedPayment.pre_notification_day}
                    onChange={(e) => handleChange(e, "pre_notification_day")}
                    onWheel={(e) => e.target.blur()}
                    required
                  />
                  <label className="inputLabel">Pre-notification Days</label>
                </div>
              )}

              <div className="relative col-span-3">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="primaryInput text-gray-700 w-full"
                  accept="image/*"
                />
                {editedPayment.paymentImage &&
                  typeof editedPayment.paymentImage === "string" && (
                    <p className="text-sm mt-1">
                      Current file: {editedPayment.paymentImage}
                    </p>
                  )}
                <label className="inputLabel">Payment Receipt (if any)</label>
              </div>
            </div>

            <button
              type="submit"
              className="primaryBtn mx-auto mt-6 py-3 text-lg"
            >
              Update Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPayment;
