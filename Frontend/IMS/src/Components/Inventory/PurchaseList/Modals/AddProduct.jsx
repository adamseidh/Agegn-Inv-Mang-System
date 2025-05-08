import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import Permission from "../../../../helpers/utils/permissions";

const AddProduct = ({ isOpen, close, addProduct }) => {
  if (!isOpen) return null;
  const [sellPrice, setSellPrice] = useState(0);

  const [product, setProduct] = useState({
    item_id: "",
    brand: "",
    quantity: "",
    expire_date: "",
    purchase_date: "",
    batch_number: "",
    description: "",
    itemCost: "",
    profitPercent: 10,
    sell_price: "",
    costs: [{ title: "", amount: "" }],
    image: null,
  });

  const [role, setRole] = useState(null);
  const [items, setItems] = useState([]);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

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

    fetchItems(); // Fetch items when component mounts
  }, []);

  const { permission1, permission2, permission3 } = Permission(role);

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

  // Function to handle opening new window for adding items
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

    // Add an event listener to check when the new window is closed
    if (newWindow) {
      const checkWindowClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkWindowClosed);
          fetchItems(); // Refresh items when the window is closed
        }
      }, 500);
    }
  };

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
    return (parseFloat(product.itemCost || 0) + additionalCosts).toFixed(2);
  };

  const calculateProfit = () => {
    const totalCost = calculateTotalCost();
    return (totalCost * (product.profitPercent / 100)).toFixed(2);
  };

  const calculateSellingPrice = () => {
    const totalCost = calculateTotalCost();
    const profit = calculateProfit();
    const sellingPrice = (parseFloat(totalCost) + parseFloat(profit)).toFixed(
      2
    );
    return sellingPrice;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalCost = calculateTotalCost();
    const sellingPrice = calculateSellingPrice();
    const additionalCost = additionalCosts();
    addProduct({ ...product, totalCost, sellingPrice, additionalCost });
    close();
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-4 p-8 w-3/4 max-w-4xl rounded-lg bg-white shadow-sm overflow-y-auto "
        style={{ height: "80vh" }}
      >
        <div className="flex flex-col h-full ">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2  border rounded-lg p-6 shadow-md ">
              <h4 className=" col-span-3 font-bold text-lg">
                Product Information
              </h4>

              <div className="relative col-span-2">
                <div className="flex items-center justify-center gap-2">
                  <select
                    value={product.item_id}
                    onChange={(e) => handleChange(e, "item_id")}
                    className="primaryInput peer flex-1"
                    required
                  >
                    <option value="">--Select Product--</option>
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

              <div className="relative">
                <input
                  type="number"
                  className="primaryInput peer"
                  placeholder=" "
                  value={product.itemCost}
                  onChange={(e) => handleChange(e, "itemCost")}
                  onWheel={(e) => {
                    e.target.blur();
                  }}
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
                  onWheel={(e) => {
                    e.target.blur();
                  }}
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
                  value={product.serial_number}
                  onChange={(e) => handleChange(e, "serial_number")}
                />
                <label className="inputLabel">Serial Number</label>
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

            {permission1 && (
              <>
                <div className="mt-6  border rounded-lg p-6 shadow-md ">
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
                          onWheel={(e) => {
                            e.target.blur();
                          }}
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
                    className="primaryBtn  mt-4"
                    onClick={addCostField}
                  >
                    + Add Cost
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-md ">
                  <h4 className="font-bold text-lg mb-4">Price Estimation</h4>
                  <div className="flex flex-row items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Item Cost:
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {product.itemCost}
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
                      {calculateTotalCost(product)}
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
                        onChange={(e) =>
                          handleChange(e, "profitPercent", e.target.value)
                        }
                        onWheel={(e) => {
                          e.target.blur();
                        }}
                        required
                      />
                      <label className="inputLabel">Profit %</label>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      X {calculateTotalCost(product)}
                    </span>
                  </div>

                  <div className="items-center gap-2 py-2 border-t mt-3 pt-3">
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-gray-500 text-sm font-medium">
                        Selling Price:
                      </p>
                      <p className="text-gray-700 font-semibold">
                        {calculateSellingPrice(product)}
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
              Save Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
