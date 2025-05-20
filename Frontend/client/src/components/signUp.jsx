import React, { useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJS from "crypto-js";

const SignUp = ({ isOpen, close }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    customer_name: "",
    phone: "",
    email: "",
    website: "",
    region: "",
    zone: "",
    wereda_or_city: "",
    kebele: "",
    tin: "",
    letter_no: "",
    pin: "",
    confirmPin: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name) newErrors.name = "Company Name is required";
    if (!formData.name) newErrors.name = "Your Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.wereda_or_city)
      newErrors.wereda_or_city = "Wereda/City is required";
    if (!formData.zone) newErrors.zone = "Zone is required";
    if (formData.pin.length < 4)
      newErrors.pin = "PIN must be at least 4 digits";
    if (formData.pin !== formData.confirmPin)
      newErrors.confirmPin = "PINs don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Hash the PIN with SHA-256 before sending
      const hashedPin = CryptoJS.SHA256(formData.pin).toString();

      const customerData = {
        ...formData,
        pin: hashedPin,
      };
      delete customerData.confirmPin;

      const response = await fetch(`${serverHost}/CustomerSignUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        close();
      } else {
        // Handle specific error cases
        if (response.status === 409) {
          setApiError(
            "An account with this phone number already exists. Please log in or use a different phone number."
          );
        } else {
          setApiError(
            data.message || "Failed to create account. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError(
        "An error occurred while creating your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primaryColor">Sign Up</h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faClose} size="lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* API Error Message */}
          {apiError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md">
              {apiError}
            </div>
          )}

          {/* Basic Information */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Name*
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Company Name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name*
              </label>
              <input
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.customer_name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Your Name"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-xs">{errors.customer_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Phone"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primaryColor"
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Region*
              </label>
              <input
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.region
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Region"
              />
              {errors.region && (
                <p className="text-red-500 text-xs">{errors.region}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Zone
              </label>
              <input
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.zone
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="zone"
              />
              {errors.zone && (
                <p className="text-red-500 text-xs">{errors.zone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Wereda/City*
              </label>
              <input
                name="wereda_or_city"
                value={formData.wereda_or_city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.wereda_or_city
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Wereda or City"
              />
              {errors.wereda_or_city && (
                <p className="text-red-500 text-xs">{errors.wereda_or_city}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kebele
              </label>
              <input
                name="kebele"
                value={formData.kebele}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.kebele
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Kebele"
              />
              {errors.kebele && (
                <p className="text-red-500 text-xs">{errors.kebele}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primaryColor"
                placeholder="Website"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                TIN Number
              </label>
              <input
                name="tin"
                value={formData.tin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primaryColor"
                placeholder="TIN"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Letter No
              </label>
              <input
                name="letter_no"
                value={formData.letter_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primaryColor"
                placeholder="Letter Number"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Create PIN* (4+ digits)
              </label>
              <input
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleChange}
                maxLength="6"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.pin
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Enter PIN"
              />
              {errors.pin && (
                <p className="text-red-500 text-xs">{errors.pin}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm PIN*
              </label>
              <input
                name="confirmPin"
                type="password"
                value={formData.confirmPin}
                onChange={handleChange}
                maxLength="6"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.confirmPin
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primaryColor"
                }`}
                placeholder="Confirm PIN"
              />
              {errors.confirmPin && (
                <p className="text-red-500 text-xs">{errors.confirmPin}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primaryColor text-white font-bold py-3 px-4 rounded-md transition-colors ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
