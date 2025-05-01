import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import Permission from "../../../../helpers/utils/permissions";

const EditProduct = ({ isOpen, close, product, updateProduct }) => {
  const [items, setItems] = useState([]);
  const [editedProduct, setEditedProduct] = useState({
    item_id: "",
    brand: "",
    quantity: "",
    expire_date: "",
    purchase_date: "",
    batch_number: "",
    description: "",
    itemCost: "",
    profitPercent: 10,
    costs: [{ title: "", amount: "" }],
    image: null,
  });
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  // Initialize form when product data becomes available
  useEffect(() => {
    if (product) {
      setEditedProduct({
        item_id: product.item_id || "",
        brand: product.brand || "",
        quantity: product.quantity || "",
        expire_date: product.expire_date || "",
        purchase_date: product.purchase_date || "",
        batch_number: product.batch_number || "",
        description: product.description || "",
        itemCost: product.itemCost || "",
        profitPercent: product.profitPercent || 10,
        costs: product.costs || [{ title: "", amount: "" }],
        image: product.image || null,
      });
    }
  }, [product]);

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

    if (token) {
      axios
        .get(`${serverHost}/ItemsList`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setItems(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  const handleChange = (e, field) => {
    setEditedProduct({ ...editedProduct, [field]: e.target.value });
  };

  const handleCostChange = (index, field, value) => {
    const newCosts = [...editedProduct.costs];
    newCosts[index][field] = value;
    setEditedProduct({ ...editedProduct, costs: newCosts });
  };

  const addCostField = () => {
    setEditedProduct({
      ...editedProduct,
      costs: [...editedProduct.costs, { title: "", amount: "" }],
    });
  };

  const removeCostField = (index) => {
    const newCosts = editedProduct.costs.filter((_, i) => i !== index);
    setEditedProduct({ ...editedProduct, costs: newCosts });
  };

  const handleImageChange = (e) => {
    setEditedProduct({ ...editedProduct, image: e.target.files[0] });
  };

  const calculateTotalCost = () => {
    const additionalCosts = editedProduct.costs.reduce(
      (sum, cost) => sum + parseFloat(cost.amount || 0),
      0
    );
    return (parseFloat(editedProduct.itemCost || 0) + additionalCosts).toFixed(
      2
    );
  };

  const calculateProfit = () => {
    const totalCost = calculateTotalCost();
    return (totalCost * (editedProduct.profitPercent / 100)).toFixed(2);
  };

  const calculateSellingPrice = () => {
    const totalCost = calculateTotalCost();
    const profit = calculateProfit();
    return (parseFloat(totalCost) + parseFloat(profit)).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalCost = calculateTotalCost();
    const sellingPrice = calculateSellingPrice();
    updateProduct({
      ...editedProduct,
      totalCost,
      sellingPrice,
    });
    close();
  };

  if (!isOpen || !product) return null;
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
              <p className="text-2xl font-bold text-gray-700">Edit Product</p>
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
                Product Information
              </h4>

              <div className="relative">
                <label className="inputLabel">Product Name</label>
                <select
                  value={editedProduct.item_id}
                  onChange={(e) => handleChange(e, "item_id")}
                  className="primaryInput peer"
                  required
                >
                  <option value="">--Select--</option>
                  {items.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      selected={item.id === editedProduct.item_id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type="number"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.itemCost}
                  onChange={(e) => handleChange(e, "itemCost")}
                  onWheel={(e) => e.target.blur()}
                  required
                />
                <label className="inputLabel">Purchase Price</label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.quantity}
                  onChange={(e) => handleChange(e, "quantity")}
                  onWheel={(e) => e.target.blur()}
                  required
                />
                <label className="inputLabel">Quantity</label>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.expire_date}
                  onChange={(e) => handleChange(e, "expire_date")}
                />
                <label className="inputLabel">Expire Date</label>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.purchase_date}
                  onChange={(e) => handleChange(e, "purchase_date")}
                />
                <label className="inputLabel">Purchase Date</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.batch_number}
                  onChange={(e) => handleChange(e, "batch_number")}
                />
                <label className="inputLabel">Batch Number</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.brand}
                  onChange={(e) => handleChange(e, "brand")}
                />
                <label className="inputLabel">Product Brand</label>
              </div>

              <div className="relative col-span-3">
                <textarea
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.description}
                  onChange={(e) => handleChange(e, "description")}
                />
                <label className="inputLabel">Product Description</label>
              </div>

              <div className="relative col-span-3">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="primaryInput text-gray-700 w-full"
                  accept="image/*"
                />
                {editedProduct.image &&
                  typeof editedProduct.image === "string" && (
                    <p className="text-sm mt-1">
                      Current image: {editedProduct.image}
                    </p>
                  )}
              </div>
            </div>

            {permission1 && (
              <>
                <div className="mt-6 border rounded-lg p-6 shadow-md">
                  <h4 className="font-bold text-lg mb-4">Additional Costs</h4>
                  {editedProduct.costs.map((cost, index) => (
                    <div key={index} className="flex gap-4 mb-4 items-center">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          className="primaryInput peer"
                          placeholder=" "
                          value={cost.title}
                          onChange={(e) =>
                            handleCostChange(index, "title", e.target.value)
                          }
                        />
                        <label className="inputLabel">Cost Title</label>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          className="primaryInput peer"
                          placeholder=" "
                          value={cost.amount}
                          onChange={(e) =>
                            handleCostChange(index, "amount", e.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                        <label className="inputLabel">Amount</label>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-xl"
                        onClick={() => removeCostField(index)}
                      >
                        <FaXmark />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="primaryBtn mt-4"
                    onClick={addCostField}
                  >
                    + Add Cost
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-md">
                  <h4 className="font-bold text-lg mb-4">Price Estimation</h4>
                  <div className="flex flex-row items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Item Cost:
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {editedProduct.itemCost}
                    </p>
                  </div>

                  <div className="flex flex-row items-center gap-2 mt-2">
                    <p className="text-gray-500 text-sm font-medium">
                      Additional Costs:
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {editedProduct.costs
                        .reduce(
                          (sum, cost) => sum + parseFloat(cost.amount || 0),
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-row items-center gap-2 mt-2">
                    <p className="text-gray-500 text-sm font-medium">
                      Overall Cost:
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {calculateTotalCost()}
                    </p>
                  </div>

                  <div className="flex flex-row items-center gap-2 py-2 border-t mt-3 pt-3">
                    <p className="text-gray-500 text-sm font-medium">Profit:</p>
                    <div className="relative">
                      <input
                        type="number"
                        className="primaryInput peer"
                        placeholder=" "
                        value={editedProduct.profitPercent}
                        onChange={(e) => handleChange(e, "profitPercent")}
                        onWheel={(e) => e.target.blur()}
                        required
                      />
                      <label className="inputLabel">Profit %</label>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      X {calculateTotalCost()}
                    </span>
                  </div>

                  <div className="items-center gap-2 py-2 border-t mt-3 pt-3">
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-gray-500 text-sm font-medium">
                        Selling Price:
                      </p>
                      <p className="text-gray-700 font-semibold">
                        {calculateSellingPrice()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="primaryBtn mx-auto mt-6 py-3 text-lg"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
