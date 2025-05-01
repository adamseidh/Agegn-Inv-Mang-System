import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";

const AddPayment = ({ isOpen, close, addPayment }) => {
  if (!isOpen) return null;

  const [payment, setPayment] = useState({
    amount: "",
    remark: "",
    payment_type: "",
    payment_option: "",
    payment_date: "",
    pre_notification_day: 3,
    bank_name: "",
    account_number: "",
    paymentImage: null,
  });

  const handleChange = (e, field) => {
    setPayment({ ...payment, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    setPayment({ ...payment, paymentImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPayment(payment);
    close();
  };
  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-4 p-8 w-3/4 max-w-4xl rounded-lg bg-white shadow-sm overflow-y-auto "
        style={{ height: "80vh" }}
      >
        <div className="flex flex-col h-full ">
          <div className="flex justify-between mb-4 border-b pb-1">
            <div className="">
              <p className="text-2xl font-bold text-gray-700">Add Payment</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2  border rounded-lg p-6 shadow-md ">
              <h4 className=" col-span-3 font-bold text-lg">
                Payment Information
              </h4>

              <div className="relative">
                <label className="inputLabel">Payment Type</label>
                <select
                  value={payment.payment_type}
                  onChange={(e) => handleChange(e, "payment_type")}
                  className="primaryInput peer"
                  required
                >
                  <option value="">--Select--</option>
                  <option value={"Paid"}>Paid</option>
                  <option value={"Loan"}>Loan</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={payment.payment_option}
                  onChange={(e) => handleChange(e, "payment_option")}
                  required
                />
                <label className="inputLabel">
                  Pay by(cash, transfer, check..)
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={payment.bank_name}
                  onChange={(e) => handleChange(e, "bank_name")}
                />
                <label className="inputLabel">Bank Name</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={payment.account_number}
                  onChange={(e) => handleChange(e, "account_number")}
                />
                <label className="inputLabel">Account Number</label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  className="primaryInput peer"
                  placeholder=" "
                  value={payment.amount}
                  onChange={(e) => handleChange(e, "amount")}
                  onWheel={(e) => {
                    // Prevent increment/decrement using mouse wheel
                    e.target.blur(); // Remove focus from the input to prevent changes
                  }}
                  required
                />
                <label className="inputLabel">Amount</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={payment.remark}
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
                  value={payment.payment_date}
                  onChange={(e) => handleChange(e, "payment_date")}
                  required
                />
                <label className="inputLabel">Payment Date</label>
              </div>

              {payment.payment_type === "Loan" && (
                <div className="relative">
                  <input
                    type="number"
                    className="primaryInput peer"
                    placeholder=" "
                    value={payment.pre_notification_day}
                    onChange={(e) => handleChange(e, "pre_notification_day")}
                    onWheel={(e) => {
                      // Prevent increment/decrement using mouse wheel
                      e.target.blur(); // Remove focus from the input to prevent changes
                    }}
                    required
                  />
                  <label className="inputLabel">Pre notification Day</label>
                </div>
              )}

              <div className="relative col-span-2">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="primaryInput text-gray-700 w-full mb-3"
                  accept="image/*"
                />
                <label className="inputLabel">Payment file if any</label>
              </div>
            </div>

            <button type="submit" className="primaryBtn mt-4">
              Save Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
