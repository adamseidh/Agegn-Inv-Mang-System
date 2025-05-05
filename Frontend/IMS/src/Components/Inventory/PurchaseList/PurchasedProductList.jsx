import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";
import { FormattedNumber } from "../../../helpers/functions/FormattedNumber";
import FormattedDate from "../../../helpers/functions/FormattedDate";
import ProductDetail from "./PrchsdPrdctModals/PchProductDetail";
import EditProduct from "./PrchsdPrdctModals/pchProductEditModal";
import DeleteConfirm from "../../shared/deleteConfirm";
import AddProduct from "./PrchsdPrdctModals/pchProductAddModal";
import EditPayment from "./PrchsdPrdctModals/pchPrdctPymntEdModal";
import PaymentDetail from "./PrchsdPrdctModals/puchPrdPaymentDetail";
import AddPayment from "./PrchsdPrdctModals/pchprdAddPaymnt";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Permission from "../../../helpers/utils/permissions";
const PurchasedProductList = () => {
  const { id } = useParams();
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
  const [openMenu, setOpenMenu] = useState(null);
  const [openPaymentTableMenu, setOpenPaymentTableMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [remark, setRemark] = useState("");
  const [productId, setProductId] = useState();
  const [originalSupplier, setOriginalSupplier] = useState(null);
  const [invoice_number, setInvoice_number] = useState("");
  const [originalRemark, setOriginalRemark] = useState("");
  const [originalInvoice_number, setOriginalInvoice_number] = useState("");

  // Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isProductDelete, setIsProductDelete] = useState(false);

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
  }, []);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/supplier`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/purchasedProductList/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/aPurchasePayments/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    axios
      .get(`${serverHost}/PurchaseList/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setSupplier(response.data.supplier_id);
        setOriginalSupplier(response.data.supplier_id);
        setRemark(response.data.remark);
        setOriginalRemark(response.data.remark);
        setInvoice_number(response.data.invoice_number);
        setOriginalInvoice_number(response.data.invoice_number);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log("purchase list data");

  const handleMenuToggle = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const supplierChange = (value) => {
    setSupplier(value);
  };

  const handleRemarkChange = (value) => {
    setRemark(value);
  };

  const handleInvoceNumberChange = (value) => {
    setInvoice_number(value);
  };

  const handlePaymentMenuToggle = (index) => {
    setOpenPaymentTableMenu(openPaymentTableMenu === index ? null : index);
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };
  const productUnit = (id) => {
    const Item = items.find((item) => parseInt(item.id) === parseInt(id));
    return Item ? Item.unit : "Unknown";
  };
  const addPayment = (payment) => {
    console.log("payamnt data");
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

  const handleDeleteClick = (item, isProduct) => {
    setItemToDelete(item);
    setIsProductDelete(isProduct);
    setShowDeleteConfirm(true);
    // Close the menu
    if (isProduct) {
      setOpenMenu(null);
    } else {
      setOpenPaymentTableMenu(null);
    }
  };

  const confirmDelete = () => {
    if (isProductDelete) {
      deleteProduct(itemToDelete);
    } else {
      deletePayment(itemToDelete);
    }
    setShowDeleteConfirm(false);
  };

  const deleteProduct = (product) => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;
    axios.delete(`${serverHost}/deleteProduct/${product.id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const newProducts = products.filter((p) => p !== product);
    setProducts(newProducts);
  };

  const deletePayment = (payment) => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;
    axios.delete(`${serverHost}/deletePayment/${payment.id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const newPayments = payments.filter((p) => p !== payment);
    setPayments(newPayments);
  };

  const productName = (id) => {
    const itemName = items.find((item) => parseInt(item.id) === parseInt(id));
    return itemName ? itemName.name : "Unknown";
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/PurchaseList");
  };

  const saveSupplyChange = async (e) => {
    e.preventDefault();

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken).token;

      await axios.put(
        `${serverHost}/EditPurchase/${id}`,
        { supplier, remark, invoice_number },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      alert("Changes saved successfully!");
      // Update original values after successful save
      setOriginalSupplier(supplier);
      setOriginalRemark(remark);
      setOriginalInvoice_number(invoice_number);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to save changes");
    }
  };

  // Check if there are changes to show the save button
  const hasChanges =
    supplier !== originalSupplier ||
    remark !== originalRemark ||
    invoice_number !== originalInvoice_number;

  return (
    <div className="flex-1 p-4">
      <div>
        <p className="flex items-center justify-center text-xl font-semibold text-gray-400">
          Product List
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
                    {FormattedNumber(product.purchase_price)}
                  </td>

                  <td className="p-4 text-gray-700">
                    {FormattedNumber(product.quantity)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {FormattedNumber(
                      parseFloat(product.quantity) *
                        parseFloat(product.purchase_price)
                    )}
                  </td>
                  <td className="p-4 text-gray-700">
                    {FormattedNumber(product.selling_price)}
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
                            setProductId(product.id);
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
                          onClick={() => handleDeleteClick(product, true)}
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
                              parseFloat(product.purchase_price),
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
                            onClick={() => handleDeleteClick(payment, false)}
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
              onChange={(e) => supplierChange(e.target.value)}
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
              value={invoice_number}
              onChange={(e) => handleInvoceNumberChange(e.target.value)}
              required
            />
            <label className="inputLabel">Invoice Number</label>
          </div>
          <div className="relative">
            <input
              type="text"
              className="primaryInput peer"
              placeholder=" "
              value={remark}
              onChange={(e) => handleRemarkChange(e.target.value)}
              required
            />
            <label className="inputLabel">Purchase Remark</label>
          </div>
          {hasChanges && (
            <button
              type="button"
              onClick={saveSupplyChange}
              className="primaryBtn mt-8"
            >
              Save Change
            </button>
          )}
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
                        parseFloat(product.purchase_price),
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
                )}{" "}
                ETB
              </p>
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
                )}{" "}
                ETB
              </p>
            </div>

            {/* Payment validation status - only shows if total required > 0 */}
            {(() => {
              const totalPaid = payments.reduce((sum, payment) => {
                return sum + parseFloat(payment.amount);
              }, 0);

              const totalRequired = products.reduce((sum, product) => {
                return (
                  sum +
                  parseFloat(product.quantity) *
                    parseFloat(product.purchase_price)
                );
              }, 0);

              // Only show validation if there's an actual required payment
              if (totalRequired > 0) {
                const isComplete = Math.abs(totalPaid - totalRequired) < 0.01;

                return (
                  <div
                    className={`flex items-center gap-2 ${
                      isComplete ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isComplete ? (
                      <>
                        <FaCheckCircle />
                        <span>Payment completed Payment Data</span>
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
              }
              return null;
            })()}
          </div>
        )}
      </div>
      <button type="button" onClick={handleBack} className="primaryBtn mt-8">
        Back
      </button>

      {/* Modals */}
      <AddProduct
        isOpen={isAddProductOpen}
        close={() => setAddProductOpen(false)}
        addProduct={addProduct}
        purchaseId={id}
      />
      <AddPayment
        isOpen={isAddPaymentOpen}
        close={() => setAddPaymentOpen(false)}
        addPayment={addPayment}
        purchaseId={id}
      />
      <ProductDetail
        isOpen={isProductDetailOpen}
        close={() => setProductDetailOpen(false)}
        product={selectedProduct}
        productId={productId}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirm
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        itemName={
          isProductDelete
            ? productName(itemToDelete?.item_id)
            : `Payment (${itemToDelete?.amount} ETB)`
        }
      />
    </div>
  );
};

export default PurchasedProductList;
