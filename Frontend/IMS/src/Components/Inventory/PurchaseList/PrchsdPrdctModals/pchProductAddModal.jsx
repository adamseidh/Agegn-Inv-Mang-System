import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";

const AddProduct = ({ isOpen, close, addProduct, purchaseId }) => {
  if (!isOpen) return null;

  const [product, setProduct] = useState({
    item_id: "",
    brand: "",
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

  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const handleChange = (e, field) => {
    setProduct({ ...product, [field]: e.target.value });
  };

  const handleCostChange = (index, field, value) => {
    const newCosts = [...product.costs];
    newCosts[index][field] = value;
    setProduct({ ...product, costs: newCosts });
  };

  const addCostField = () => {
    setProduct({
      ...product,
      costs: [...product.costs, { title: "", amount: "" }],
    });
  };

  const removeCostField = (index) => {
    const newCosts = product.costs.filter((_, i) => i !== index);
    setProduct({ ...product, costs: newCosts });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const additionalCosts = () => {
    const additionalCosts = product.costs.reduce(
      (sum, cost) => sum + parseFloat(cost.amount || 0),
      0
    );
    return additionalCosts;
  };

  const calculateTotalCost = () => {
    const additionalCosts = product.costs.reduce(
      (sum, cost) => sum + parseFloat(cost.amount || 0),
      0
    );
    return (parseFloat(product.purchase_price || 0) + additionalCosts).toFixed(
      2
    );
  };

  const calculateProfit = () => {
    const totalCost = calculateTotalCost();
    return (totalCost * (product.profitPercent / 100)).toFixed(2);
  };

  const calculateSellingPrice = () => {
    const totalCost = calculateTotalCost();
    const profit = calculateProfit();
    return (parseFloat(totalCost) + parseFloat(profit)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const totalCost = calculateTotalCost();
    const selling_price = calculateSellingPrice();
    const costs = additionalCosts();
    addProduct({ ...product, totalCost, selling_price, costs });

    try {
      const getToken = localStorage.getItem("token");
      const token = JSON.parse(getToken).token;

      const formData = new FormData();

      // Add product data
      formData.append("item_id", product.item_id);
      formData.append("brand", product.brand);
      formData.append("quantity", product.quantity);
      formData.append("expire_date", product.expire_date);
      formData.append("purchase_date", product.purchase_date);
      formData.append("batch_number", product.batch_number);
      formData.append("description", product.description);
      formData.append("purchase_price", product.purchase_price);
      formData.append("profitPercent", product.profitPercent);
      formData.append("purchase_id", purchaseId);

      // Calculate and add calculated fields
      const additionalCost = product.costs
        .reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0)
        .toFixed(2);
      formData.append("additional_cost", additionalCost);

      const overallCost = calculateTotalCost();
      formData.append("overall_cost", overallCost);

      const sellingPrice = calculateSellingPrice();
      formData.append("selling_price", sellingPrice);

      // Add costs as JSON string
      formData.append(
        "costs",
        JSON.stringify(
          product.costs.filter((cost) => cost.title && cost.amount)
        )
      );

      // Add image if exists
      if (product.image) {
        formData.append("image", product.image);
      }

      const response = await axios.post(`${serverHost}/addProduct`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Product added successfully!");
        sessionStorage.setItem("productId", response.data.productId);
        console.log("response dta", response.data.productId);

        close();
      } else {
        alert("Failed to add product: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <p className="text-2xl font-bold text-gray-700">Add Product</p>
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
                  value={product.item_id}
                  onChange={(e) => handleChange(e, "item_id")}
                  className="primaryInput peer"
                  required
                >
                  <option value="">--Select--</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
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
                  value={product.purchase_price}
                  onChange={(e) => handleChange(e, "purchase_price")}
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
                  value={product.quantity}
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
                  value={product.expire_date}
                  onChange={(e) => handleChange(e, "expire_date")}
                />
                <label className="inputLabel">Expire Date</label>
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="primaryInput peer"
                  placeholder=" "
                  value={product.purchase_date}
                  onChange={(e) => handleChange(e, "purchase_date")}
                />
                <label className="inputLabel">Purchase Date</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={product.batch_number}
                  onChange={(e) => handleChange(e, "batch_number")}
                />
                <label className="inputLabel">Batch Number</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="primaryInput peer"
                  placeholder=" "
                  value={product.brand}
                  onChange={(e) => handleChange(e, "brand")}
                />
                <label className="inputLabel">Product Brand</label>
              </div>

              <div className="relative col-span-3">
                <textarea
                  className="primaryInput peer"
                  placeholder=" "
                  value={product.description}
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
              </div>
            </div>

            <div className="mt-6 border rounded-lg p-6 shadow-md">
              <h4 className="font-bold text-lg mb-4">Additional Costs</h4>
              {product.costs.map((cost, index) => (
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
                      required
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
                      required
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
                <p className="text-gray-500 text-sm font-medium">Item Cost:</p>
                <p className="text-gray-700 font-semibold">
                  {product.purchase_price || "0.00"}
                </p>
              </div>

              <div className="flex flex-row items-center gap-2 mt-2">
                <p className="text-gray-500 text-sm font-medium">
                  Additional Costs:
                </p>
                <p className="text-gray-700 font-semibold">
                  {product.costs
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
                    value={product.profitPercent}
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
              className="primaryBtn mx-auto mt-6 py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
