import React, { useState } from "react";
import { faCartPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Detail from "./onEditDetail";

function ProductItemTable({ products, addToCart }) {
  const [isDetailOpen, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});

  const openDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };

  const closeDetail = () => setOpenDetail(false);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: Math.max(1, parseInt(value) || 1),
    });
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.selling_price} birr
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.available_product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="1"
                    max={product.available_product}
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="w-16 px-2 py-1 border border-primaryColor rounded text-center"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDetail(product)}
                      className="rounded-md px-3 py-1 text-sm border border-primaryColor text-primaryColor hover:bg-gray-100 transition-colors"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      Details
                    </button>
                    <button
                      onClick={() =>
                        addToCart(product, quantities[product.id] || 1)
                      }
                      className="p-2 rounded-full text-white text-primaryColor hover:scale-105"
                    >
                      <FontAwesomeIcon
                        icon={faCartPlus}
                        className="text-xl hover:scale-115 text-primaryColor"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <Detail
          isDetailOpen={isDetailOpen}
          closeDetail={closeDetail}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default ProductItemTable;
