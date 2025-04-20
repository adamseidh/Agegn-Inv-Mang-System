import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import FormattedDate from "../../../../helpers/functions/FormattedDate";

const ProductDetail = ({ isOpen, close, product, productId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCosts, setProductCosts] = useState([]);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  console.log("here what we want", productId);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const getToken = localStorage.getItem("token");
        if (!getToken) throw new Error("No token found");

        const token = JSON.parse(getToken).token;
        const response = await axios.get(`${serverHost}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setItems(response.data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchItems();
  }, [isOpen, serverHost]);

  const ProductUnit = (id) => {
    if (!id) return "No item selected";
    if (loading) return "Loading...";
    if (error) return "Error loading items";
    const item = items.find((item) => item.id == id);
    return item ? item.unit : "Unknown Item";
  };
  //read a product costs
  useEffect(() => {
    console.log("shat");
    const fetchProductCosts = async () => {
      try {
        const getToken = localStorage.getItem("token");
        if (!getToken) throw new Error("No token found");

        const token = JSON.parse(getToken).token;
        const response = await axios.get(
          `${serverHost}/productCostList/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("product costs", response.data);
        setProductCosts(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductCosts();
  }, [isOpen, serverHost]);

  const getItemNameById = (id) => {
    if (!id) return "No item selected";
    if (loading) return "Loading...";
    if (error) return "Error loading items";
    const item = items.find((item) => item.id == id);
    return item ? item.name : "Unknown Item";
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-4 p-8 w-3/4 max-w-4xl rounded-lg bg-white shadow-sm overflow-y-auto"
        style={{ height: "80vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between mb-6 border-b pb-1">
            <h2 className="text-2xl font-bold text-gray-700">
              Product Details
            </h2>
            <button
              onClick={close}
              className="text-2xl hover:text-red-700 text-red-500"
            >
              <FaXmark />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p>Loading product details...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-6 shadow-md">
                <h3 className="col-span-2 font-bold text-lg">
                  Product Information
                </h3>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">
                    Product Name
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {getItemNameById(product?.item_id)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Brand</p>
                  <p className="text-gray-700 font-semibold">
                    {product?.brand || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Unit</p>
                  <p className="text-gray-700 font-semibold">
                    {ProductUnit(product?.item_id) || "N/A"}{" "}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Quantity</p>
                  <p className="text-gray-700 font-semibold">
                    {product?.quantity || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">
                    Purchase Date
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {product?.purchase_date
                      ? FormattedDate(product.purchase_date)
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">
                    Expire Date
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {product?.expire_date
                      ? FormattedDate(product.expire_date)
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">
                    Batch Number
                  </p>
                  <p className="text-gray-700 font-semibold">
                    {product?.batch_number || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Item Cost</p>
                  <p className="text-gray-700 font-semibold">
                    {product?.purchase_price || "N/A"}
                  </p>
                </div>
              </div>

              {
                <div className="border rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4">Additional Costs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productCosts.map((cost, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-500 text-sm font-medium">
                          Cost Title
                        </p>
                        <p className="text-gray-700 font-semibold">
                          {cost.title || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm font-medium mt-2">
                          Amount
                        </p>
                        <p className="text-gray-700 font-semibold">
                          {cost.amount || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              }

              <div className="border rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg mb-4">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Selling Price
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {product?.selling_price || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {product?.description && (
                <div className="border rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
