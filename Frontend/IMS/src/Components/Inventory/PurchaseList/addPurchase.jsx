import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddProduct from "./Modals/AddProduct";
import AddPayment from "./Modals/AddPayment";
import ProductDetail from "./Modals/ProductDetail";
import EditProduct from "./Modals/EditProduct";
import PaymentDetail from "./Modals/PaymentDetail";
import EditPayment from "./Modals/EditPayment";
import { FaEllipsisV } from "react-icons/fa";
import { FormattedNumber } from "../../../helpers/functions/FormattedNumber";
import FormattedDate from "../../../helpers/functions/FormattedDate";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Permission from "../../../helpers/utils/permissions";

const AddPurchase = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isAddProductOpen, setAddProductOpen] = useState(false);
  const [isAddPaymentOpen, setAddPaymentOpen] = useState(false);
  const [isProductDetailOpen, setProductDetailOpen] = useState(false);
  const [isEditProductOpen, setEditProductOpen] = useState(false);
  const [isPaymentDetailOpen, setPaymentDetailOpen] = useState(false);
  const [isEditPaymentOpen, setEditPaymentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openMenu, setOpenMenu] = useState(null); // Track open menu index for the product table
  const [openPaymentTableMenu, setOpenPaymentTableMenu] = useState(null); // toggle for payment table
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [remark, setRemark] = useState([]);

  const navigate = useNavigate();

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

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/ItemsList`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => setItems(response.data))

      .catch((error) => console.error("Error fetching data:", error));
    console.log("here is the items data", items);
  }, []);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/supplierCount`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => setSuppliers(response.data))

      .catch((error) => console.error("Error fetching data:", error));
    console.log("here is the items data", items);
  }, []);

  const handleMenuToggle = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const handlePaymentMenuToggle = (index) => {
    setOpenPaymentTableMenu(openPaymentTableMenu === index ? null : index);
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const addPayment = (payment) => {
    setPayments([...payments, payment]);
  };

  const updateProduct = (updatedProduct) => {
    const newProducts = products.map((product) =>
      product === selectedProduct ? updatedProduct : product
    );
    setProducts(newProducts);
  };

  const updatePayment = (updatedPayment) => {
    const newPayments = payments.map((payment) =>
      payment === selectedPayment ? updatedPayment : payment
    );
    setPayments(newPayments);
  };

  const deleteProduct = (product) => {
    const newProducts = products.filter((p) => p !== product);
    setProducts(newProducts);
  };

  const deletePayment = (payment) => {
    const newPayments = payments.filter((p) => p !== payment);
    setPayments(newPayments);
  };

  // Function to get product name by id
  const productName = (id) => {
    console.log("items", items);
    console.log("passed id", id);

    const itemName = items.find((item) => parseInt(item.id) == parseInt(id));
    return itemName ? itemName.name : "Unknown";
  };

  const productUnit = (id) => {
    const Item = items.find((item) => parseInt(item.id) === parseInt(id));
    return Item ? Item.unit : "Unknown";
  };
  const handleSubmit = async (e) => {
    const userId = JSON.parse(localStorage.getItem("userId")).userId;
    e.preventDefault();

    const formData = new FormData();
    formData.append("serverHost", serverHost);
    formData.append("supplier", supplier);
    formData.append("remark", remark);
    formData.append("userId", userId);

    // Append products data
    products.forEach((product, productIndex) => {
      formData.append(`products[${productIndex}][item_id]`, product.item_id);
      formData.append(`products[${productIndex}][brand]`, product.brand);
      formData.append(
        `products[${productIndex}][description]`,
        product.description
      );
      formData.append(`products[${productIndex}][quantity]`, product.quantity);
      formData.append(
        `products[${productIndex}][expire_date]`,
        product.expire_date
      );
      formData.append(
        `products[${productIndex}][purchase_date]`,
        product.purchase_date
      );
      formData.append(
        `products[${productIndex}][serial_number]`,
        product.serial_number
      );
      formData.append(
        `products[${productIndex}][batch_number]`,
        product.batch_number
      );
      formData.append(
        `products[${productIndex}][purchase_price]`,
        product.itemCost
      );
      formData.append(
        `products[${productIndex}][additional_cost]`,
        product.additionalCost
      );
      formData.append(
        `products[${productIndex}][overall_cost]`,
        product.totalCost
      );
      formData.append(
        `products[${productIndex}][selling_price]`,
        product.sellingPrice
      );

      if (product.image) {
        formData.append("productsImages", product.image);
      }
      product.costs.forEach((cost, costIndex) => {
        formData.append(
          `products[${productIndex}][costs][${costIndex}][title]`,
          cost.title
        );
        formData.append(
          `products[${productIndex}][costs][${costIndex}][amount]`,
          cost.amount
        );
      });
    });

    // Append payments data
    payments.forEach((payment, paymentIndex) => {
      formData.append(
        `payments[${paymentIndex}][payment_type]`,
        payment.payment_type
      );
      formData.append(
        `payments[${paymentIndex}][payment_option]`,
        payment.payment_option
      );
      formData.append(
        `payments[${paymentIndex}][check_number]`,
        payment.check_number
      );
      formData.append(
        `payments[${paymentIndex}][payment_date]`,
        payment.payment_date
      );
      formData.append(
        `payments[${paymentIndex}][pre_notification_day]`,
        payment.pre_notification_day
      );
      formData.append(
        `payments[${paymentIndex}][bank_name]`,
        payment.bank_name
      );
      formData.append(
        `payments[${paymentIndex}][account_number]`,
        payment.account_number
      );
      formData.append(`payments[${paymentIndex}][amount]`, payment.amount);
      formData.append(`payments[${paymentIndex}][remark]`, payment.remark);
      if (payment.paymentImage) {
        formData.append("paymentImages", payment.paymentImage);
      }
    });

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken).token;

      const res = await axios.post(`${serverHost}/addPurchase`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      alert(res.data.message);
      navigate("/PurchaseList");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
    }
  };

  console.log("products", products);

  return (
    <div className="flex-1 p-4">
      <div>
        <p className="flex items-center justify-center text-xl font-semibold text-gray-400">
          Add Product List
        </p>

        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Products</h2>
          <button
            onClick={() => setAddProductOpen(true)}
            className="primaryBtn"
          >
            + Add Product
          </button>
        </div>
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-white font-semibold">No.</th>
                <th className="p-4 text-left text-white font-semibold">
                  Product Name
                </th>
                <th className="p-4 text-left text-white font-semibold">
                  Purch. Price
                </th>
                <th className="p-4 text-left text-white font-semibold">
                  Quantity
                </th>
                <th className="p-4 text-left text-white font-semibold">
                  Total
                </th>
                <th className="p-4 text-left text-white font-semibold">
                  Price
                </th>
                <th className="p-4 text-left text-white font-semibold">
                  Expire Date
                </th>
                <th className="p-4 text-left text-white font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="p-4 text-gray-700">{index + 1}</td>
                  <td className="p-4 text-gray-700">
                    {productName(product.item_id)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {FormattedNumber(product.itemCost)}
                  </td>

                  <td className="p-4 text-gray-700">
                    {FormattedNumber(product.quantity)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {FormattedNumber(product.quantity * product.itemCost)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {FormattedNumber(product.sellingPrice)}
                  </td>

                  <td className="p-4 text-gray-700">
                    {FormattedDate(product.expire_date)}
                  </td>
                  <td className="p-4 relative">
                    <button
                      onClick={() => handleMenuToggle(index)}
                      className="text-gray-500 hover:text-gray-700 "
                    >
                      <FaEllipsisV />
                    </button>
                    {openMenu === index && (
                      <div className="flex absolute left-[-210px] py-1 px-2 -top-0.5 bg-white border border-gray-200 shadow-lg z-10 rounded-lg">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setProductDetailOpen(true);
                            handleMenuToggle(index);
                          }}
                          className="block w-full px-4 py-2 text-sm text-primaryColor hover:bg-blue-100 hover:rounded-lg"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditProductOpen(true);
                            handleMenuToggle(index);
                          }}
                          className="block w-full px-4 py-2 text-sm text-green-500 hover:bg-green-100 hover:rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteProduct(product);
                            handleMenuToggle(index);
                          }}
                          className="block w-full px-4 text-sm text-red-500 hover:bg-red-100 hover:rounded-lg"
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
                <td className="p-4 text-gray-800"></td>
                <td className="p-4 text-gray-800"></td>
                <td className="p-4 text-gray-800" colSpan={2}>
                  {" "}
                  Total
                </td>
                <td className="p-4 text-gray-800">
                  {FormattedNumber(
                    products.reduce(
                      (sum, product) => sum + parseFloat(product.quantity),
                      0
                    )
                  )}
                </td>
                <td className="p-4 text-gray-800  " colSpan={2}>
                  <div className="flex flex-row gap-1">
                    <p>
                      {" "}
                      {FormattedNumber(
                        products.reduce(
                          (sum, product) =>
                            sum +
                            parseFloat(product.quantity) *
                              parseFloat(product.itemCost),
                          0
                        )
                      )}
                    </p>
                    <p>ETB</p>
                  </div>
                </td>
                <td className="p-4 text-gray-800"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {permission1 && (
        <div className="mt-8">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Payments</h2>
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
                    No.
                  </th>
                  <th className="p-4 text-left text-white font-semibold">
                    Payment Type
                  </th>
                  <th className="p-4 text-left text-white font-semibold">
                    Pay By
                  </th>
                  <th className="p-4 text-left text-white font-semibold">
                    Amount
                  </th>
                  <th className="p-4 text-left text-white font-semibold">
                    Remark
                  </th>
                  <th className="p-4 text-left text-white font-semibold">
                    Payment Date
                  </th>
                  <th className="p-4 text-left text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="p-4 text-gray-700">{index + 1}</td>
                    <td className="p-4 text-gray-700">
                      {payment.payment_type}
                    </td>
                    <td className="p-4 text-gray-700">
                      {payment.payment_option}
                    </td>
                    <td className="p-4 text-gray-700">{payment.amount}</td>
                    <td className="p-4 text-gray-700">{payment.remark}</td>
                    <td className="p-4 text-gray-700">
                      {FormattedDate(payment.payment_date)}
                    </td>
                    <td className="p-4 relative">
                      <button
                        onClick={() => handlePaymentMenuToggle(index)}
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
                  <td className="p-4 text-gray-800"></td>
                  <td className="p-4 text-gray-800" colSpan={2}>
                    {" "}
                    Total
                  </td>
                  <td className="p-4 text-gray-800  " colSpan={2}>
                    <div className="flex flex-row gap-1">
                      <p>
                        {" "}
                        {FormattedNumber(
                          payments.reduce(
                            (sum, payment) => sum + parseFloat(payment.amount),
                            0
                          )
                        )}
                      </p>
                      <p>ETB</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-800"></td>
                  <td className="p-4 text-gray-800"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white my-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="border p-2 rounded-lg">
          <div className="relative">
            <label className="inputLabel">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="primaryInput peer"
              required
            >
              <option value="">--Select--</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
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
            <label className="inputLabel">Purchase Remark</label>
          </div>
        </div>

        {permission1 && (
          <div className="space-y-2 border p-2 rounded-lg">
            <div className="flex flex-row gap-1">
              <p>Overall Total Price amount:</p>
              <p className="font-semibold">
                {FormattedNumber(
                  products.reduce(
                    (sum, product) =>
                      sum +
                      parseFloat(product.quantity) *
                        parseFloat(product.itemCost),
                    0
                  )
                )}
              </p>
              <p className="font-semibold">ETB</p>
            </div>

            <div className="flex flex-row gap-1">
              <p>Completed Payment:</p>
              <p className="font-semibold">
                {FormattedNumber(
                  payments.reduce((sum, payment) => {
                    if (payment.payment_type === "Paid") {
                      return sum + parseFloat(payment.amount);
                    }
                    return sum;
                  }, 0)
                )}
              </p>
              <p className="font-semibold">ETB</p>
            </div>

            <div className="flex flex-row gap-1">
              <p>Loan:</p>
              <p className="font-semibold">
                {FormattedNumber(
                  payments.reduce((sum, payment) => {
                    if (payment.payment_type === "Loan") {
                      return sum + parseFloat(payment.amount);
                    }
                    return sum;
                  }, 0)
                )}
              </p>
              <p className="font-semibold">ETB</p>
            </div>

            {/* Payment validation status */}
            {(() => {
              const totalPaid = payments.reduce((sum, payment) => {
                return sum + parseFloat(payment.amount);
              }, 0);

              const totalRequired = products.reduce((sum, product) => {
                return (
                  sum +
                  parseFloat(product.quantity) * parseFloat(product.itemCost)
                );
              }, 0);

              const isComplete = Math.abs(totalPaid - totalRequired) < 0.01; // Account for floating point

              return (
                <div
                  className={`flex items-center gap-2 ${
                    isComplete ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalRequired === 0 ? (
                    ""
                  ) : isComplete ? (
                    <>
                      <FaCheckCircle />
                      <span>Payment Data Completed</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle />
                      <span>
                        Remaining Payment Data:{" "}
                        {FormattedNumber(totalRequired - totalPaid)} ETB
                      </span>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <button type="button" onClick={handleSubmit} className="primaryBtn mt-8">
        Submit
      </button>

      {/* Modals */}
      <AddProduct
        isOpen={isAddProductOpen}
        close={() => setAddProductOpen(false)}
        addProduct={addProduct}
      />
      <AddPayment
        isOpen={isAddPaymentOpen}
        close={() => setAddPaymentOpen(false)}
        addPayment={addPayment}
      />
      <ProductDetail
        isOpen={isProductDetailOpen}
        close={() => setProductDetailOpen(false)}
        product={selectedProduct}
      />
      <EditProduct
        isOpen={isEditProductOpen}
        close={() => setEditProductOpen(false)}
        product={selectedProduct}
        updateProduct={updateProduct}
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
};

export default AddPurchase;
