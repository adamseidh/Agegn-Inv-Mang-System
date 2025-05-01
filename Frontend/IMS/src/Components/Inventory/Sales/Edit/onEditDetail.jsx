import React, { useState } from "react";
import { faCartShopping, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Detail({ isDetailOpen, closeDetail, product, cart, setCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!isDetailOpen || !product) return null;

  const addToCart = () => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].totalPrice =
        product.selling_price * updatedCart[existingItemIndex].quantity;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: quantity,
          totalPrice: product.selling_price * quantity,
        },
      ]);
    }
    closeDetail();
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, product.available_product)));
  };
  return (
    <div
      onClick={closeDetail}
      className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-4 p-5 w-3/4 md:w-1/3 rounded-lg bg-white shadow-lg"
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-primaryColor">
                {product.name}
              </h2>
              <p className="text-gray-600">
                {product.brand || "No brand specified"}
              </p>
            </div>
            <button
              onClick={closeDetail}
              className="text-xl hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>

          {/* Product Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <img
                src={product.image ? product.image : product.itemImage}
                alt={product.name}
                className="h-48 w-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "/assets/default-product.jpg";
                }}
              />
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-bold">
                    Price: {product.selling_price} birr
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.available_product} available in stock
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.available_product}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 px-2 py-1 text-center border-x"
                    />
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.available_product, quantity + 1)
                        )
                      }
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={addToCart}
                    className="flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t-2 pt-4">
            <h3 className="text-xl font-bold mb-3">Product Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Description:</p>
                <p className="text-gray-700">
                  {product.description || "No description available"}
                </p>
              </div>

              <div>
                <p className="font-semibold">Category:</p>
                <p className="text-gray-700">{product.categoryName}</p>
              </div>

              <div>
                <p className="font-semibold">Type:</p>
                <p className="text-gray-700">{product.typeName || "N/A"}</p>
              </div>

              {product.expire_date && (
                <div>
                  <p className="font-semibold">Expiration Date:</p>
                  <p className="text-gray-700">
                    {new Date(product.expire_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
