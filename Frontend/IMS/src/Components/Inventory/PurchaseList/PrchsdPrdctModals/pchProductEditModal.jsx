import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";

const EditProduct = ({ isOpen, close, product, updateProduct }) => {
  const [items, setItems] = useState([]);
  const [editedProduct, setEditedProduct] = useState({
    id: "",
    item_id: "",
    brand: "",
    unit: "",
    serial_number: "",
    quantity: "",
    expire_date: "",
    purchase_date: "",
    batch_number: "",
    description: "",
    purchase_price: "",
    profitPercent: 10,
    costs: [{ id: "", title: "", amount: "" }],
    image: null,
  });
  const [originalProduct, setOriginalProduct] = useState(null);
  const [hasProductChanges, setHasProductChanges] = useState(false);
  const [changedCosts, setChangedCosts] = useState({});
  const fileInputRef = useRef(null);

  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const fetchProductCosts = async () => {
    try {
      const getToken = localStorage.getItem("token");
      if (!getToken) throw new Error("No token found");
      const productId = product.id
        ? product.id
        : sessionStorage.getItem("productId");
      const token = JSON.parse(getToken).token;
      const response = await axios.get(
        `${serverHost}/productCostList/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter out costs with empty titles or amounts
      return response.data.filter((cost) => cost.title && cost.amount);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      return [];
    }
  };

  console.log("product slist form edit", product);
  // Initialize form when product data becomes available
  useEffect(() => {
    const initializeProductData = async () => {
      if (product) {
        const costs = await fetchProductCosts();
        const initialProduct = {
          id: product.id || "",
          item_id: product.item_id || "",
          brand: product.brand || "",
          unit: product.unit || "",
          serial_number: product.serial_number || "",
          quantity: product.quantity || "",
          expire_date: product.expire_date || "",
          purchase_date: product.purchase_date || "",
          batch_number: product.batch_number || "",
          description: product.description || "",
          purchase_price: product.purchase_price || "",
          profitPercent: product.profitPercent || 10,
          costs: costs?.length
            ? costs.map((cost) => ({
                title: cost.title,
                amount: cost.amount,
                id: cost.id,
              }))
            : [],
          image: product.image || null,
        };
        setEditedProduct(initialProduct);
        setOriginalProduct(initialProduct);
      }
    };

    initializeProductData();
  }, [product]);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;

    if (token) {
      axios
        .get(`${serverHost}/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setItems(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  // Check for product changes
  useEffect(() => {
    if (originalProduct && editedProduct) {
      const changesDetected = Object.keys(editedProduct).some((key) => {
        if (key === "costs" || key === "image") return false;
        return editedProduct[key] !== originalProduct[key];
      });
      setHasProductChanges(changesDetected);
    }
  }, [editedProduct, originalProduct]);

  const handleChange = (e, field) => {
    setEditedProduct({ ...editedProduct, [field]: e.target.value });
  };

  const handleCostChange = (index, field, value) => {
    const newCosts = [...editedProduct.costs];
    newCosts[index][field] = value;
    setEditedProduct({ ...editedProduct, costs: newCosts });
    setChangedCosts({ ...changedCosts, [index]: true });
  };

  const addNewCost = () => {
    setEditedProduct({
      ...editedProduct,
      costs: [...editedProduct.costs, { title: "", amount: "" }],
    });
    setChangedCosts({ ...changedCosts, [editedProduct.costs.length]: true });
  };

  const updateCost = async (index, cost) => {
    // Don't save if title or amount is empty
    if (!cost.title || !cost.amount) {
      alert("Please fill in both title and amount before saving");
      return;
    }

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken)?.token;

      if (cost.id) {
        // Update existing cost
        await axios.put(
          `${serverHost}/updateProductCost/${cost.id}`,
          { title: cost.title, amount: cost.amount },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      } else {
        // Create new cost
        const response = await axios.post(
          `${serverHost}/createProductCost`,
          { ...cost, product_id: product.id },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        // Update the cost in state with the returned ID
        const newCosts = [...editedProduct.costs];
        newCosts[index] = { ...newCosts[index], id: response.data.id };
        setEditedProduct({ ...editedProduct, costs: newCosts });
      }

      // Update original product to reflect the saved changes
      const updatedOriginal = { ...originalProduct };
      updatedOriginal.costs[index] = { ...cost };
      setOriginalProduct(updatedOriginal);

      // Remove from changed costs
      setChangedCosts((prev) => {
        const newChanged = { ...prev };
        delete newChanged[index];
        return newChanged;
      });

      alert("Cost saved successfully!");
    } catch (error) {
      console.error("Error saving cost:", error);
      alert("Failed to save cost");
    }
  };

  const handleRemoveCostClick = (index, cost) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the cost "${cost.title}" (${cost.amount} ETB)?`
    );

    if (confirmDelete) {
      if (cost.id) {
        // Delete cost from database if it has an ID (existing cost)
        const getToken = localStorage.getItem("token");
        const token = JSON.parse(getToken)?.token;
        axios.delete(`${serverHost}/deleteProductCost/${cost.id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
      }

      // Remove cost from local state
      const newCosts = editedProduct.costs.filter((_, i) => i !== index);
      setEditedProduct({ ...editedProduct, costs: newCosts });

      // Update original product
      const updatedOriginal = { ...originalProduct };
      updatedOriginal.costs = updatedOriginal.costs.filter(
        (_, i) => i !== index
      );
      setOriginalProduct(updatedOriginal);

      // Remove from changed costs
      setChangedCosts((prev) => {
        const newChanged = { ...prev };
        delete newChanged[index];
        return newChanged;
      });
    }
  };

  function formatDateToInputValue(value) {
    if (!value) return "";
    const date = new Date(value);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  const handleImageChange = (e) => {
    setEditedProduct({ ...editedProduct, image: e.target.files[0] });
    setHasProductChanges(true);
  };

  const calculateTotalCost = () => {
    const additionalCosts = editedProduct.costs.reduce(
      (sum, cost) => sum + parseFloat(cost.amount || 0),
      0
    );
    return (
      parseFloat(editedProduct.purchase_price || 0) + additionalCosts
    ).toFixed(2);
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

  const saveProductChanges = async (e) => {
    e.preventDefault();

    if (!hasProductChanges) {
      alert("No changes detected to save");
      return;
    }

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken)?.token;

      const formData = new FormData();
      // Add all product fields except costs and image
      Object.keys(editedProduct).forEach((key) => {
        if (
          key !== "costs" &&
          key !== "image" &&
          key !== "selling_price" &&
          key !== "expire_date" &&
          key !== "purchase_date" &&
          key !== "id"
        ) {
          formData.append(key, editedProduct[key]);
        }
      });

      let additionalCost = editedProduct.costs
        .reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0)
        .toFixed(2);
      formData.append("additional_cost", additionalCost);

      let overAllCost = calculateTotalCost();
      formData.append("overall_cost", overAllCost);

      let SellingPrice = calculateSellingPrice();
      formData.append("selling_price", SellingPrice);

      let expireDate = formatDateToInputValue(editedProduct.expire_date);
      let purchaseDate = formatDateToInputValue(editedProduct.purchase_date);
      formData.append("expire_date", expireDate);
      formData.append("purchase_date", purchaseDate);

      formData.append("oldImage", product.image);
      formData.append("serverHost", serverHost);

      // Append image if it's a new file
      if (editedProduct.image && typeof editedProduct.image !== "string") {
        formData.append("image", editedProduct.image);
      }

      // Send the update request
      await axios.put(`${serverHost}/updateProduct/${product.id}`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the original product to reflect saved changes
      setOriginalProduct(editedProduct);
      setHasProductChanges(false);

      // Call the parent component's update function
      updateProduct({
        ...editedProduct,
        totalCost: calculateTotalCost(),
        selling_price: calculateSellingPrice(),
      });

      alert("Product updated successfully!");
      close();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
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
            onSubmit={saveProductChanges}
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
                  value={editedProduct.purchase_price}
                  onChange={(e) => handleChange(e, "purchase_price")}
                  onWheel={(e) => e.target.blur()}
                  required
                />
                <label className="inputLabel">Purchase Price</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.unit}
                  onChange={(e) => handleChange(e, "unit")}
                  required
                />
                <label className="inputLabel">Measurement Unit</label>
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
                  value={formatDateToInputValue(editedProduct.expire_date)}
                  onChange={(e) => handleChange(e, "expire_date")}
                />
                <label className="inputLabel">Expire Date</label>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="primaryInput peer"
                  placeholder=" "
                  value={formatDateToInputValue(editedProduct.purchase_date)}
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
                  ref={fileInputRef}
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

            <div className="mt-6 border rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">Additional Costs</h4>
                {/* <button
                  type="button"
                  className="primaryBtn"
                  onClick={addNewCost}
                >
                  + Add Cost
                </button> */}
              </div>

              {editedProduct.costs.filter((cost) => cost.title || cost.amount)
                .length > 0 ? (
                editedProduct.costs
                  .filter((cost) => cost.title || cost.amount)
                  .map((cost, index) => (
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
                      {changedCosts[index] && (
                        <button
                          type="button"
                          className="primaryBtn"
                          onClick={() => updateCost(index, cost)}
                        >
                          Save
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-xl"
                        onClick={() => handleRemoveCostClick(index, cost)}
                      >
                        <FaXmark />
                      </button>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No additional costs
                </p>
              )}
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-md">
              <h4 className="font-bold text-lg mb-4">Price Estimation</h4>
              <div className="flex flex-row items-center gap-2 mt-1">
                <p className="text-gray-500 text-sm font-medium">Item Cost:</p>
                <p className="text-gray-700 font-semibold">
                  {editedProduct.purchase_price || "0.00"}
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

            <button
              type="submit"
              className={`primaryBtn mx-auto mt-6 py-3 text-lg ${
                !hasProductChanges ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!hasProductChanges}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
