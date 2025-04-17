import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";

const EditPayment = ({ isOpen, close, payment, updatePayment }) => {
  const [editedPayment, setEditedPayment] = useState({
    id: "",
    amount: "",
    remark: "",
    payment_type: "",
    payment_status: "",
    payment_option: "",
    payment_date: "",
    pre_notification_day: 3,
    bank_name: "",
    account_number: "",
    paymentImage: null,
  });

  const [originalPayment, setOriginalPayment] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  // Initialize form when payment data becomes available
  useEffect(() => {
    if (payment) {
      const initialData = {
        id: payment.id || "",
        amount: payment.amount || "",
        remark: payment.remark || "",
        payment_type: payment.payment_type || "",
        payment_option: payment.payment_option || "",
        payment_status: payment.payment_status || "",
        payment_date: payment.payment_date || "",
        pre_notification_day: payment.pre_notification_day || 3,
        bank_name: payment.bank_name || "",
        account_number: payment.account_number || "",
        paymentImage: payment.payment_image || null,
      };
      setEditedPayment(initialData);
      setOriginalPayment(initialData);
    }
  }, [payment]);

  // Check for changes
  useEffect(() => {
    if (originalPayment && editedPayment) {
      const changesDetected = Object.keys(editedPayment).some((key) => {
        if (key === "paymentImage") {
          // For files, we consider them changed if a new file is selected
          return (
            editedPayment[key] !== originalPayment[key] &&
            typeof editedPayment[key] !== "string"
          );
        }
        return editedPayment[key] !== originalPayment[key];
      });
      setHasChanges(changesDetected);
    }
  }, [editedPayment, originalPayment]);

  const handleChange = (e, field) => {
    setEditedPayment({ ...editedPayment, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEditedPayment({ ...editedPayment, paymentImage: e.target.files[0] });
  };

  function formatDateToInputValue(value) {
    if (!value) return "";
    const date = new Date(value);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken).token;

      const formData = new FormData();
      formData.append("amount", editedPayment.amount);
      formData.append("remark", editedPayment.remark);
      formData.append("payment_type", editedPayment.payment_type);
      formData.append("payment_option", editedPayment.payment_option);
      formData.append("payment_status", editedPayment.payment_status);
      formData.append(
        "payment_date",
        formatDateToInputValue(editedPayment.payment_date)
      );
      formData.append(
        "pre_notification_day",
        editedPayment.pre_notification_day
      );
      formData.append("bank_name", editedPayment.bank_name);
      formData.append("account_number", editedPayment.account_number);

      // Add old image path if exists and new image is not selected
      if (typeof editedPayment.paymentImage === "string") {
        formData.append("oldImage", editedPayment.paymentImage);
      }

      // Add new image if selected
      if (
        editedPayment.paymentImage &&
        typeof editedPayment.paymentImage !== "string"
      ) {
        formData.append("image", editedPayment.paymentImage);
      }

      formData.append("serverHost", serverHost);

      const response = await axios.put(
        `${serverHost}/updatePayment/${payment.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        updatePayment({
          ...editedPayment,
          payment_image:
            response.data.updatedImage || editedPayment.paymentImage,
        });
        alert("Payment updated successfully!");
        close();
      } else {
        alert("Failed to update payment: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment");
    } finally {
      setIsSubmitting(false);
    }
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
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedPayment.payment_option}
                  onChange={(e) => handleChange(e, "payment_option")}
                  required
                />
                <label className="inputLabel">
                  Pay by(cash, transfer, check..)
                </label>{" "}
              </div>

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
                  value={formatDateToInputValue(editedPayment.payment_date)}
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

              {editedPayment.payment_type === "Loan" && (
                <div className="relative">
                  <label className="inputLabel">Payment Status</label>
                  <select
                    value={editedPayment.payment_status}
                    onChange={(e) => handleChange(e, "payment_status")}
                    className="primaryInput peer"
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="Completed">Completed</option>
                    <option value="Not Completed">Not Completed</option>
                  </select>
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
              className={`primaryBtn mx-auto mt-6 py-3 text-lg ${
                !hasChanges || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPayment;
