import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";

const EditProduct = ({ isOpen, close, product, updateProduct }) => {
    if (!isOpen) return null;

    const [editedProduct, setEditedProduct] = useState(product);

    const handleChange = (e, field) => {
        setEditedProduct({ ...editedProduct, [field]: e.target.value });
    };

    const handleCostChange = (index, field, value) => {
        const newCosts = [...editedProduct.costs];
        newCosts[index][field] = value;
        setEditedProduct({ ...editedProduct, costs: newCosts });
    };

    const addCostField = () => {
        setEditedProduct({ ...editedProduct, costs: [...editedProduct.costs, { title: "", amount: "" }] });
    };

    const removeCostField = (index) => {
        const newCosts = editedProduct.costs.filter((_, i) => i !== index);
        setEditedProduct({ ...editedProduct, costs: newCosts });
    };

    const handleImageChange = (e) => {
        setEditedProduct({ ...editedProduct, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProduct(editedProduct);
        close();
    };

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
                            <p className="text-xl pb-2 font-bold text-gray-700">Edit Product</p>
                        </div>
                        <button onClick={close} className='text-xl items-baseline hover:text-red-700 text-red-500'>
                            <FaXmark />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className='flex items-center flex-col'>
                        <input
                            value={editedProduct.brand}
                            onChange={(e) => handleChange(e, "brand")}
                            type="text"
                            placeholder="Product Brand"
                            className="primaryInput text-gray-700 w-full mb-3"
                            required
                        />
                        <input
                            value={editedProduct.unit}
                            onChange={(e) => handleChange(e, "unit")}
                            type="text"
                            placeholder="Measurement Unit"
                            className="primaryInput text-gray-700 w-full mb-3"
                            required
                        />
                        <input
                            value={editedProduct.quantity}
                            onChange={(e) => handleChange(e, "quantity")}
                            type="number"
                            placeholder="Quantity"
                            className="primaryNumberInput text-gray-700 w-full mb-3"
                            required
                        />
                        <input
                            value={editedProduct.itemCost}
                            onChange={(e) => handleChange(e, "itemCost")}
                            type="number"
                            placeholder="Item Cost"
                            className="primaryNumberInput text-gray-700 w-full mb-3"
                            required
                        />
                        <textarea
                            value={editedProduct.description}
                            onChange={(e) => handleChange(e, "description")}
                            placeholder="Product Description"
                            className="primaryInput text-gray-700 w-full mb-3"
                        />
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="primaryInput text-gray-700 w-full mb-3"
                            accept="image/*"
                        />
                        <h4 className="font-bold mt-2">Additional Costs</h4>
                        {editedProduct.costs.map((cost, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Cost Title"
                                    value={cost.title}
                                    onChange={(e) => handleCostChange(index, "title", e.target.value)}
                                    className="primaryInput text-gray-700 w-1/2"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={cost.amount}
                                    onChange={(e) => handleCostChange(index, "amount", e.target.value)}
                                    className="primaryNumberInput text-gray-700 w-1/2"
                                    required
                                />
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeCostField(index)}
                                >
                                    <FaXmark />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="primaryBtn" onClick={addCostField}>
                            + Cost
                        </button>
                        <button type="submit" className="primaryBtn mt-4">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;