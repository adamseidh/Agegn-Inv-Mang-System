import React, { useState, useEffect } from "react";
import { faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_SERVER;

  const [cart, setCart] = useState(() => {
    return (
      location.state?.cart || JSON.parse(localStorage.getItem("cart")) || []
    );
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState();

  const [remark, setRemark] = useState();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${apiUrl}/customers`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setCustomers(response.data);
      })

      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const handleSubmit = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setError(null);
    const storedToken = JSON.parse(localStorage.getItem("token"));
    const token = storedToken?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

      const response = await axios.post(
        `${apiUrl}/addSells`,
        {
          items: cart,
          totalPrice,
          totalItems,
          customer,
          remark,
        },
        config
      );

      if (response.data.success) {
        // Clear cart on successful submission
        setCart([]);
        alert("Sales osuccessfully submitted!");
        navigate("/salesList", {
          state: {
            saleSuccess: true,
            saleId: response.data.saleId,
          },
        });
        localStorage.setItem("cart", JSON.stringify([]));
      } else {
        setError("Failed to process your order. Please try again.");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(
      cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.selling_price * newQuantity,
            }
          : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="lex items-center justify-center mt-5 w-full h-20 shadow-lg">
        <div className="flex flex-row items-center justify-center p-4">
          <Link
            to="/salesList/create"
            className="text-primaryColor text-xl md:text-2xl font-bold capitalize mb-4 text-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back To Products
          </Link>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-primaryColor">
                Product List ({cart.length} items)
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Product is not added</p>
                  <Link
                    to="/salesList/create"
                    className="inline-block mt-4 px-6 py-2 rounded-full text-white bg-primaryColor"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="w-full md:w-1/4">
                        <img
                          src={item.image || "/assets/default-product.jpg"}
                          alt={item.name}
                          className="w-full h-32 object-contain rounded-lg"
                          onError={(e) => {
                            e.target.src = "/assets/default-product.jpg";
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primaryColor">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Brand: {item.brand || "N/A"}</p>
                          <p>Category: {item.categoryName}</p>
                          <p>Available: {item.available_product}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center mb-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 border border-primaryColor rounded-l"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.available_product}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-12 px-2 py-1 border-t border-b border-primaryColor text-center"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 border border-primaryColor rounded-r"
                          >
                            +
                          </button>
                        </div>

                        <p className="font-bold">{item.totalPrice} birr</p>
                        <p className="text-sm text-gray-500">
                          {item.selling_price} birr each
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-primaryColor">
                Sales Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{totalPrice} birr</span>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalPrice} birr</span>
                </div>

                <div className="border p-2 rounded-lg">
                  <div className="relative">
                    <label className="inputLabel">Customer</label>
                    <select
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="primaryInput peer"
                      required
                    >
                      <option value="">--Select--</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      className="primaryInput peer"
                      placeholder=" "
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      required
                    />
                    <label className="inputLabel">Remark</label>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={cart.length === 0 || isSubmitting}
                  className={`w-full py-3 rounded-full text-white font-bold mt-6 transition-opacity bg-primaryColor ${
                    cart.length === 0 || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Sales"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
