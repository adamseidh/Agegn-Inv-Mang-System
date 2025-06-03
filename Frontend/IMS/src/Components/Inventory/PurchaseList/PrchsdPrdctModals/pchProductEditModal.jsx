import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import Permission from "../../../../helpers/utils/permissions";

const EditProduct = ({ isOpen, close, product, updateProduct }) => {
  const [items, setItems] = useState([]);
  const [editedProduct, setEditedProduct] = useState({
    id: "",
    item_id: "",
    brand: "",
    serial_number: "",
    quantity: "",
    expire_date: "",
    purchase_date: "",
    batch_number: "",
    description: "",
    purchase_price: "",
    profitPercent: 10,
    costs: [{ title: "", amount: "" }],
    image: null,
  });
  const [originalProduct, setOriginalProduct] = useState(null);
  const [hasProductChanges, setHasProductChanges] = useState(false);
  const [changedCosts, setChangedCosts] = useState({});
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      return response.data.filter((cost) => cost.title && cost.amount);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      return [];
    }
  };

  // Initialize form when product data becomes available
  useEffect(() => {
    const initializeProductData = async () => {
      if (product) {
        const costs = await fetchProductCosts();
        const initialProduct = {
          id: product.id || "",
          item_id: product.item_id || "",
          brand: product.brand || "",
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
                id: cost.id,
                title: cost.title,
                amount: cost.amount,
              }))
            : [{ title: "", amount: "" }],
          image: product.image || null,
        };
        setEditedProduct(initialProduct);
        setOriginalProduct(initialProduct);
      }
    };

    initializeProductData();
  }, [product]);

  const fetchItems = () => {
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken).token;

    axios
      .get(`${serverHost}/ItemsList`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddNewItem = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const width = screenWidth * 0.7;
    const height = screenHeight * 0.8;

    const left = (screenWidth - width) / 2;
    const top = (screenHeight - height) / 2;

    const newWindow = window.open(
      `${window.location.origin}/items/create`,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (newWindow) {
      const checkWindowClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkWindowClosed);
          fetchItems();
        }
      }, 500);
    }
  };

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
    }
  }, []);

  const { permission1, permission2, permission3 } = Permission(role);

  const addNewCost = () => {
    setEditedProduct({
      ...editedProduct,
      costs: [...editedProduct.costs, { title: "", amount: "" }],
    });
    setChangedCosts({ ...changedCosts, [editedProduct.costs.length]: true });
  };

  const updateCost = async (index, cost) => {
    const productId = editedProduct.id;
    const sellingPrice = calculateSellingPrice();

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
          { title: cost.title, amount: cost.amount, productId, sellingPrice },
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
          { ...cost, product_id: editedProduct.id, sellingPrice },
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

  const handleRemoveCostClick = async (index, cost) => {
    const productId = editedProduct.id;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the cost "${cost.title}" (${cost.amount} ETB)?`
    );

    if (confirmDelete) {
      try {
        const getToken = localStorage.getItem("token");
        const token = JSON.parse(getToken)?.token;

        // First remove the cost from the state to get the updated selling price
        const newCosts = editedProduct.costs.filter((_, i) => i !== index);
        const updatedProduct = { ...editedProduct, costs: newCosts };
        const sellingPrice = calculateSellingPrice(updatedProduct);

        if (cost.id) {
          // Delete cost from database if it has an ID (existing cost)
          await axios.delete(`${serverHost}/deleteProductCost/${cost.id}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          // Update the product price with the new selling price
          await axios.put(
            `${serverHost}/updateProductPrice/${productId}`,
            { sellingPrice },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
        }

        // Update the local state after successful API calls
        setEditedProduct(updatedProduct);

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

        // Call the parent component's update function with the new selling price
        updateProduct({
          ...updatedProduct,
          totalCost: calculateTotalCost(updatedProduct),
          selling_price: sellingPrice,
        });
      } catch (error) {
        console.error("Error deleting cost:", error);
        alert("Failed to delete cost");
      }
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

  const calculateTotalCost = (product = editedProduct) => {
    const additionalCosts = product.costs.reduce(
      (sum, cost) => sum + parseFloat(cost.amount || 0),
      0
    );
    return (parseFloat(product.purchase_price || 0) + additionalCosts).toFixed(
      2
    );
  };

  const calculateProfit = (product = editedProduct) => {
    const totalCost = calculateTotalCost(product);
    return (totalCost * (product.profitPercent / 100)).toFixed(2);
  };

  const calculateSellingPrice = (product = editedProduct) => {
    const totalCost = calculateTotalCost(product);
    const profit = calculateProfit(product);
    return (parseFloat(totalCost) + parseFloat(profit)).toFixed(2);
  };

  const saveProductChanges = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!hasProductChanges) {
      alert("No changes detected to save");
      setIsSubmitting(false);
      return;
    }

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken)?.token;

      const formData = new FormData();

      // Add all product fields
      formData.append("id", editedProduct.id);
      formData.append("item_id", editedProduct.item_id);
      formData.append("brand", editedProduct.brand);
      formData.append("serial_number", editedProduct.serial_number);
      formData.append("quantity", editedProduct.quantity);
      formData.append(
        "expire_date",
        formatDateToInputValue(editedProduct.expire_date)
      );
      formData.append(
        "purchase_date",
        formatDateToInputValue(editedProduct.purchase_date)
      );
      formData.append("batch_number", editedProduct.batch_number);
      formData.append("description", editedProduct.description);
      formData.append("purchase_price", editedProduct.purchase_price);
      formData.append("profitPercent", editedProduct.profitPercent);

      // Calculate and add calculated fields
      const additionalCost = editedProduct.costs
        .reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0)
        .toFixed(2);
      formData.append("additional_cost", additionalCost);

      const overallCost = calculateTotalCost();
      formData.append("overall_cost", overallCost);

      const sellingPrice = calculateSellingPrice();
      formData.append("selling_price", sellingPrice);

      // Add old image path if exists
      if (editedProduct.image && typeof editedProduct.image === "string") {
        formData.append("oldImage", editedProduct.image);
      }

      // Add server host for image path construction
      formData.append("serverHost", serverHost);

      // Append image if it's a new file
      if (editedProduct.image && typeof editedProduct.image !== "string") {
        formData.append("image", editedProduct.image);
      }

      // Send the update request
      const response = await axios.put(
        `${serverHost}/updateProduct/${editedProduct.id}`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the original product to reflect saved changes
      setOriginalProduct(editedProduct);
      setHasProductChanges(false);

      // Call the parent component's update function
      updateProduct({
        ...editedProduct,
        totalCost: calculateTotalCost(),
        selling_price: sellingPrice,
      });

      alert("Product updated successfully!");
      close();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setIsSubmitting(false);
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
            {/* Product Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 border rounded-lg p-6 shadow-md">
              <h4 className="col-span-3 font-bold text-lg">
                Product Information
              </h4>

              {/* Product Name */}
              <div className="relative col-span-2">
                <div className="flex items-center justify-center gap-2">
                  <select
                    value={editedProduct.item_id}
                    onChange={(e) => handleChange(e, "item_id")}
                    className="primaryInput peer flex-1"
                    required
                  >
                    <option value="">--Select--</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddNewItem}
                    className="primaryBtn !-mt-0.5 whitespace-nowrap"
                  >
                    + Product Name
                  </button>
                </div>
                <label className="inputLabel">Product Name</label>
              </div>

              {/* Purchase Price */}
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

              {/* Quantity */}
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

              {/* Expire Date */}
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

              {/* Purchase Date */}
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

              {/* Batch Number */}
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

              {/* Product Brand */}
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

              {/* Product Description */}
              <div className="relative col-span-3">
                <textarea
                  className="primaryInput peer"
                  placeholder=" "
                  value={editedProduct.description}
                  onChange={(e) => handleChange(e, "description")}
                />
                <label className="inputLabel">Product Description</label>
              </div>

              {/* Image Upload */}
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

            {permission1 && (
              <>
                {/* Additional Costs Section */}
                <div className="mt-6 border rounded-lg p-6 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg">Additional Costs</h4>
                    <button
                      type="button"
                      className="primaryBtn"
                      onClick={addNewCost}
                    >
                      + Add Cost
                    </button>
                  </div>

                  {editedProduct.costs.length > 0 ? (
                    editedProduct.costs.map((cost, index) => (
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

                {/* Price Estimation Section */}
                <div className="bg-white border rounded-lg p-6 shadow-md">
                  <h4 className="font-bold text-lg mb-4">Price Estimation</h4>
                  <div className="flex flex-row items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Item Cost:
                    </p>
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
              </>
            )}

            {/* Save Button */}
            <button
              type="submit"
              className={`primaryBtn mx-auto mt-6 py-3 text-lg ${
                !hasProductChanges ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!hasProductChanges || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
