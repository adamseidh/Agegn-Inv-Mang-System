import React from "react";
import { FaXmark } from "react-icons/fa6";

const ProductDetail = ({ isOpen, close, product }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={close}
            className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-5 w-3/4 md:w-1/3 rounded-lg bg-white shadow-sm mb-3"
            >
                <div className="flex flex-col">
                    <div className="flex justify-between mb-3">
                        <div className="">
                            <p className="text-xl pb-2 font-bold text-gray-700">Product Details</p>
                        </div>
                        <button onClick={close} className='text-xl items-baseline hover:text-red-700 text-red-500'>
                            <FaXmark />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Brand:</p>
                            <p className="text-gray-700 font-semibold">{product.brand}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Unit:</p>
                            <p className="text-gray-700 font-semibold">{product.unit}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Quantity:</p>
                            <p className="text-gray-700 font-semibold">{product.quantity}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Item Cost:</p>
                            <p className="text-gray-700 font-semibold">{product.itemCost}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Description:</p>
                            <p className="text-gray-700 font-semibold">{product.description}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Additional Costs:</p>
                            <ul className="list-disc list-inside">
                                {product.costs.map((cost, index) => (
                                    <li key={index} className="text-gray-700 font-semibold">
                                        {cost.title}: {cost.amount}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;