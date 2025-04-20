import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaEdit,
  FaTrash,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaIdCard,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import CryptoJS from "crypto-js";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [pin, setPin] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  // Get customer ID from session storage
  const customerId = sessionStorage.getItem("customerId");
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else {
      fetchProfile();
    }
    const token = sessionStorage.getItem("authToken");
    setToken(token);
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${serverHost}/CustomerOrders/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${serverHost}/fetchAcustomer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${serverHost}/deleteOrder/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchOrders(); // Refresh orders list
      } catch (err) {
        setError("Failed to delete order");
      }
    }
  };

  const handleViewOrder = (order) => {
    navigate("/order-detail", { state: { orderId: order.id } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare updated form data
    const updatedFormData = {
      ...formData,
      ...(pin && { pin: CryptoJS.SHA256(pin).toString() }),
    };

    try {
      await axios.put(
        `${serverHost}/updateCustomer/${customerId}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditMode(false);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("customerId");

    // Redirect to home page and reload
    navigate("/login");
    window.location.reload();
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <FaUser className="inline-block mr-2 text-primaryColor" />
            My Account
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your profile and orders
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tabs with Logout Button */}
          <div className="border-b border-gray-200 flex justify-between items-center">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center py-4 px-6 ${
                  activeTab === "profile"
                    ? "border-b-2 border-primaryColor text-primaryColor font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaUser className="mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center py-4 px-6 ${
                  activeTab === "orders"
                    ? "border-b-2 border-primaryColor text-primaryColor font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaShoppingBag className="mr-2" />
                My Orders
              </button>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center mr-6 py-2 px-4 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Personal Information
                  </h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center text-primaryColor hover:text-blue-700"
                    >
                      <FaEdit className="mr-1" /> Edit Profile
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={formData.website || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Region
                        </label>
                        <input
                          type="text"
                          name="region"
                          value={formData.region || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Wereda/City
                        </label>
                        <input
                          type="text"
                          name="wereda_or_city"
                          value={formData.wereda_or_city || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kebele
                        </label>
                        <input
                          type="text"
                          name="kebele"
                          value={formData.kebele || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          TIN Number
                        </label>
                        <input
                          type="text"
                          name="tin"
                          value={formData.tin || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Letter No
                        </label>
                        <input
                          type="text"
                          name="letter_no"
                          value={formData.letter_no || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New PIN (leave blank to keep current)
                        </label>
                        <input
                          type="password"
                          name="pin"
                          value={pin || ""}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                          placeholder="Enter new PIN"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-50 rounded-full text-primaryColor">
                        <FaUser className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {profile.name}
                        </h3>
                        <p className="text-gray-500">Full Name</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-50 rounded-full text-primaryColor">
                        <FaPhone className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {profile.phone}
                        </h3>
                        <p className="text-gray-500">Phone Number</p>
                      </div>
                    </div>
                    {profile.email && (
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-50 rounded-full text-primaryColor">
                          <FaEnvelope className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {profile.email}
                          </h3>
                          <p className="text-gray-500">Email</p>
                        </div>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-50 rounded-full text-primaryColor">
                          <FaGlobe className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {profile.website}
                          </h3>
                          <p className="text-gray-500">Website</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-50 rounded-full text-primaryColor">
                        <FaMapMarkerAlt className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {[
                            profile.region,
                            profile.wereda_or_city,
                            profile.kebele,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </h3>
                        <p className="text-gray-500">Address</p>
                      </div>
                    </div>
                    {profile.tin && (
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-50 rounded-full text-primaryColor">
                          <FaIdCard className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {profile.tin}
                          </h3>
                          <p className="text-gray-500">TIN Number</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Order History
                </h2>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {order.total_items}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {order.total_price.toFixed(2)} ETB
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  order.sells_status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.sells_status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.sells_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="text-primaryColor hover:text-blue-700 mr-4"
                              >
                                <FaEye className="inline mr-1" /> View
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash className="inline mr-1" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
