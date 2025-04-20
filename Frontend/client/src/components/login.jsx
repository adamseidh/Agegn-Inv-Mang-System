import React, { useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJS from "crypto-js";
import SignUp from "./signUp";

const Login = ({ isOpen, close }) => {
  if (!isOpen) return null;
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSignUpOpen, setSignUpOpen] = useState(false);

  const openSignUp = () => setSignUpOpen(true);
  const closeSignUp = () => setSignUpOpen(false);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!phone || !pin) {
      setError("Phone and PIN are required");
      return;
    }

    try {
      // Hash the PIN with SHA-256 before sending
      const hashedPin = CryptoJS.SHA256(pin).toString();

      const response = await fetch(`${serverHost}/customerLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          pin: hashedPin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user ID to sessionStorage
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("customerId", data.customer.id);

        alert(`Welcome ${data.customer.name}!`);
        close();
        location.reload();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      {/* Dialog Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Login</h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primaryColor focus:outline-none"
                value={phone}
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                PIN
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primaryColor focus:outline-none"
                value={pin}
                type="password"
                maxLength="6"
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primaryColor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Log In
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={openSignUp}
                className="text-primaryColor hover:underline text-sm"
              >
                Create new account
              </button>
              {/* <button
                type="button"
                className="text-gray-600 hover:underline text-sm"
              >
                Forgot PIN?
              </button> */}
            </div>
          </form>
        </div>
      </div>

      <SignUp isOpen={isSignUpOpen} close={closeSignUp} />
    </div>
  );
};

export default Login;
