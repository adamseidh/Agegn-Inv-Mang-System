import React, { useState, useEffect, useRef } from "react";
import {
  faTrash,
  faArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";
import { FormattedNumber } from "../../../../helpers/functions/FormattedNumber";
import AddPayment from "./payemnts/AddEditSalesPyment";
import PaymentDetail from "./payemnts/DetailEditSalesPayment";
import EditPayment from "./payemnts/EditEditSalesPayment";
import Permission from "../../../../helpers/utils/permissions";

function EditSales() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_SERVER;

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUserId && storedRole && storedToken) {
      const parsedUserId = JSON.parse(storedUserId).userId;
      const parsedRole = JSON.parse(storedRole).role;
      const token = JSON.parse(storedToken).token;

      setRole(parsedRole);

      console.log("User Role:", parsedRole);
    }
  }, []);
  const { permission1, permission2, permission3 } = Permission(role);
  console.log("here is fs number: ", location.state?.FsNumber);
  console.log("here is customer ", location.state?.customer);
  // Store initial data to compare changes
  const initialData = useRef({
    salesData: location.state?.salesData || [],
    customer: location.state?.customer || "",
    remark: location.state?.remark || "",
    FsNumber: location.state?.FsNumber || "",
  });

  const [salesData, setSalesData] = useState(initialData.current.salesData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(initialData.current.customer);
  const [customerName, setCustomerName] = useState(
    salesData[0]?.customerName || ""
  );
  const [payments, setPayments] = useState([]);
  const [isAddPaymentOpen, setAddPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setEditPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openPaymentTableMenu, setOpenPaymentTableMenu] = useState(null);
  const [isPaymentDetailOpen, setPaymentDetailOpen] = useState(false);
  const [remark, setRemark] = useState(salesData[0]?.remark || "");
  const [FsNumber, setFsNumber] = useState(salesData[0]?.FsNumber || "");
  const userId = JSON.parse(localStorage.getItem("userId")).userId;
  const [saleId, setSaleId] = useState(location.state?.saleId || "");
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  // Check for changes whenever relevant state changes
  // Check for changes whenever relevant state changes
  useEffect(() => {
    const dataChanged =
      JSON.stringify(salesData) !==
        JSON.stringify(initialData.current.salesData) ||
      customer !== initialData.current.customer ||
      remark !== initialData.current.remark ||
      FsNumber !== initialData.current.FsNumber;
    setHasChanges(dataChanged);
  }, [salesData, customer, remark, FsNumber]);

  const handlePaymentMenuToggle = (index) => {
    setOpenPaymentTableMenu(openPaymentTableMenu === index ? null : index);
  };

  const addPayment = (payment) => {
    setPayments([...payments, payment]);
  };

  const updatePayment = (updatedPayment) => {
    const newPayments = payments.map((payment) =>
      payment === selectedPayment ? updatedPayment : payment
    );
    setPayments(newPayments);
  };

  const deletePayment = (payment) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirmDelete) return;

    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .delete(`${serverHost}/deleteSalesPayment/${payment.id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then(() => {
        const newPayments = payments.filter((p) => p !== payment);
        setPayments(newPayments);
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
        alert("Failed to delete the payment. Please try again.");
      });
  };

  // Function to update product quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setSalesData((prevSales) =>
      prevSales.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: newQuantity,
            total_price: newQuantity * item.unit_price,
          };
        }
        return item;
      })
    );
  };

  const RemoveSalesData = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sales data?"
    );
    if (!confirmDelete) return;

    setSalesData((prevSales) =>
      prevSales.filter((item) => item.id !== productId)
    );

    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .delete(`${serverHost}/deleteSalesProduct/${productId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .catch((error) => {
        console.error("Error deleting sales data:", error);
        alert("Failed to delete the sales data. Please try again.");
      });
  };

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/aSalesPayments/${saleId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // In the useEffect that loads initial data, add FsNumber:
  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    if (location.state?.saleData) {
      const { items, customer, remark, FsNumber, saleId } =
        location.state.saleData;
      setSalesData(items);
      setCustomer(customer);
      setRemark(remark);
      setFsNumber(FsNumber);
      setSaleId(saleId);
      initialData.current = {
        salesData: items,
        customer,
        remark,
        FsNumber,
      };
    }
  }, [location.state]);

  const fetchCustomers = () => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${apiUrl}/customersCount`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setCustomers(response.data);
      })

      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddNewCustomer = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const width = screenWidth * 0.7;
    const height = screenHeight * 0.8;

    const left = (screenWidth - width) / 2;
    const top = (screenHeight - height) / 2;

    const newWindow = window.open(
      `${window.location.origin}/customers/create`,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Add an event listener to check when the new window is closed
    if (newWindow) {
      const checkWindowClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkWindowClosed);
          fetchCustomers(); // Refresh items when the window is closed
        }
      }, 500);
    }
  };

  const handleSubmit = async () => {
    if (salesData.length === 0) return;

    setIsSubmitting(true);
    setError(null);
    const storedToken = JSON.parse(localStorage.getItem("token"));
    const token = storedToken?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const requestData = {
      items: salesData,
      totalPrice: totalPrice,
      totalItems: totalItems,
      customer: customer,
      remark: remark || "",
      userId: userId,
      saleId: saleId,
      FsNumber: FsNumber,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/updateSale`,
        requestData,
        config
      );

      console.log("response ", response.data);

      if (response.data.success) {
        alert("Sales successfully updated!");
        // Update initial data to current values
        initialData.current = {
          salesData: [...salesData],
          customer,
          remark,
          FsNumber,
        };
        setHasChanges(false);
        navigate("/salesList", {
          state: {
            saleSuccess: true,
            saleId: response.data.saleId,
          },
        });
      } else {
        setError("Failed to update your sale. Please try again.");
      }
    } catch (err) {
      console.error("Sale update error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update your sale. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = salesData.reduce((sum, item) => sum + item.total_price, 0);
  const totalItems = salesData.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleChange = (e) => {
    const selected = JSON.parse(e.target.value);
    setCustomer(selected.id);
    setCustomerName(selected.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="lex items-center justify-center mt-5 w-full h-20 shadow-lg">
        <div className="flex flex-row items-center justify-center p-4">
          <Link
            to="/addProductOnEdit"
            state={{ saleId }}
            className="text-primaryColor text-xl md:text-2xl font-bold capitalize mb-4 text-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Product
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
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-primaryColor">
                Product List ({salesData.length} items)
              </h2>

              {salesData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No products added</p>
                  <Link
                    to="/salesList/create"
                    className="inline-block mt-4 px-6 py-2 rounded-full text-white bg-primaryColor"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {salesData.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primaryColor">
                          {item.productName}
                        </h3>
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

                        <p className="font-bold">{item.total_price} birr</p>
                        <p className="text-sm text-gray-500">
                          {item.unit_price} birr each
                        </p>

                        <button
                          onClick={() => RemoveSalesData(item.id)}
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
          <div className="lg:w-2/5">
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
                  <div className=" flex flex-col justify-between">
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
                            {customer.name}({customer.zone}{" "}
                            {customer.wereda_or_city} {customer.tin})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleAddNewCustomer}
                      className="primaryBtn"
                    >
                      New Customer
                    </button>
                  </div>

                  <p className="mb-6">Customer: {customerName}</p>

                  <div className="relative">
                    <input
                      type="text"
                      className="primaryInput peer"
                      placeholder=" "
                      value={FsNumber}
                      onChange={(e) => setFsNumber(e.target.value)}
                      required
                    />
                    <label className="inputLabel">Update FsNumber</label>
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
                    <label className="inputLabel">Update Remark</label>
                  </div>
                </div>

                {hasChanges && (
                  <button
                    onClick={handleSubmit}
                    disabled={salesData.length === 0 || isSubmitting}
                    className={`w-full py-3 rounded-full text-white font-bold mt-6 transition-opacity bg-primaryColor ${
                      salesData.length === 0 || isSubmitting
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
                      "Save Changes"
                    )}
                  </button>
                )}

                {permission1 && (
                  <>
                    {/**payment section */}
                    <div className="mt-8">
                      <div className="flex flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                          Payments
                        </h2>
                        <button
                          onClick={() => setAddPaymentOpen(true)}
                          className="primaryBtn"
                        >
                          + Add Payment
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-lg shadow-md border border-gray-200">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="p-4 text-left text-white font-semibold">
                                Payment Type
                              </th>

                              <th className="p-4 text-left text-white font-semibold">
                                Amount
                              </th>

                              <th className="p-4 text-left text-white font-semibold">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment, index) => (
                              <tr key={index}>
                                <td className="p-4 text-gray-700">
                                  {payment.payment_type}
                                </td>

                                <td className="p-4 text-gray-700">
                                  {payment.amount}
                                </td>

                                <td className="p-4 relative">
                                  <button
                                    onClick={() =>
                                      handlePaymentMenuToggle(index)
                                    }
                                    className="text-gray-500 hover:text-gray-700 "
                                  >
                                    <FaEllipsisV />
                                  </button>
                                  {openPaymentTableMenu === index && (
                                    <div className="flex absolute left-[-210px] py-1 px-2 -top-0.5 bg-white border border-gray-200  shadow-lg z-10 rounded-lg">
                                      <button
                                        onClick={() => {
                                          setSelectedPayment(payment);
                                          setPaymentDetailOpen(true);
                                          handlePaymentMenuToggle(index);
                                        }}
                                        className="block w-full px-4 py-2 text-sm text-primaryColor hover:bg-blue-100 hover:rounded-lg "
                                      >
                                        Detail
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedPayment(payment);
                                          setEditPaymentOpen(true);
                                          handlePaymentMenuToggle(index);
                                        }}
                                        className="block w-full px-4 py-2 text-sm  text-green-500 hover:bg-green-100 hover:rounded-lg"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          deletePayment(payment);
                                          handlePaymentMenuToggle(index);
                                        }}
                                        className="block w-full px-4  text-sm  text-red-500 hover:bg-red-100 hover:rounded-lg"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>

                          {/* Footer row for totals */}
                          <tfoot>
                            <tr className="bg-gray-200 font-semibold">
                              <td className="p-4 text-gray-800"> Total</td>
                              <td className="p-4 text-gray-800  " colSpan={2}>
                                <div className="flex flex-row gap-1">
                                  <p>
                                    {" "}
                                    {FormattedNumber(
                                      payments.reduce(
                                        (sum, payment) =>
                                          sum + parseFloat(payment.amount),
                                        0
                                      )
                                    )}
                                  </p>
                                  <p>ETB</p>
                                </div>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    {/**end of payment section */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddPayment
        isOpen={isAddPaymentOpen}
        close={() => setAddPaymentOpen(false)}
        addPayment={addPayment}
        saleId={saleId}
      />

      <PaymentDetail
        isOpen={isPaymentDetailOpen}
        close={() => setPaymentDetailOpen(false)}
        payment={selectedPayment}
      />
      <EditPayment
        isOpen={isEditPaymentOpen}
        close={() => setEditPaymentOpen(false)}
        payment={selectedPayment}
        updatePayment={updatePayment}
      />
    </div>
  );
}

export default EditSales;
