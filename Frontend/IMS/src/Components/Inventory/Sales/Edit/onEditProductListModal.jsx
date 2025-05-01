import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

const ProductListModal = ({ show, onClose, products }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!show) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-primaryColor">Product List</h3>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 flex items-center font-medium"
          >
            <FontAwesomeIcon icon={faXmark} className="mr-2" />
            Close
          </button>
        </div>

        {/* Product list */}
        <div className="overflow-y-auto flex-grow">
          {products.map(([productName], index) => (
            <div
              key={productName}
              className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50 group"
            >
              <div className="flex items-center">
                <span className="text-gray-500 w-8">{index + 1}.</span>
                <span className="capitalize">{productName}</span>
              </div>

              {/* Copy button with feedback */}
              <button
                onClick={() => handleCopy(productName, index)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                  copiedIndex === index
                    ? "bg-green-100 text-green-700"
                    : "text-primaryColor hover:bg-gray-100"
                }`}
                title="Copy product name"
              >
                {copiedIndex === index ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="text-sm" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCopy} className="text-sm" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListModal;
