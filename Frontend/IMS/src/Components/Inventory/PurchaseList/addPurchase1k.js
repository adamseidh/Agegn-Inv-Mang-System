import { useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Importing the trash icon from react-icons

const AddPurchase = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
    const [supplierName, setSupplierName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [products, setProducts] = useState([{ brand: "", description: "", image: null, costs: [{ title: "", amount: "" }] }]);
    const [payments, setPayments] = useState([{ amount: "", remark: "", paymentImage: null }]);

    const handleProductChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };

    const handleCostChange = (productIndex, costIndex, field, value) => {
        const newProducts = [...products];
        newProducts[productIndex].costs[costIndex][field] = value;
        setProducts(newProducts);
    };

    const handleImageChange = (productIndex, file) => {
        const newProducts = [...products];
        newProducts[productIndex].image = file;
        setProducts(newProducts);
    };

    const handlePaymentChange = (index, field, value) => {
        const newPayments = [...payments];
        newPayments[index][field] = value;
        setPayments(newPayments);
    };

    const handlePaymentImageChange = (index, file) => {
        const newPayments = [...payments];
        newPayments[index].paymentImage = file;
        setPayments(newPayments);
    };

    const addProductField = () => {
        setProducts([...products, { brand: "", description: "", image: null, costs: [{ title: "", amount: "" }] }]);
    };

    const addCostField = (productIndex) => {
        const newProducts = [...products];
        newProducts[productIndex].costs.push({ title: "", amount: "" });
        setProducts(newProducts);
    };

    const addPaymentField = () => {
        setPayments([...payments, { amount: "", remark: "", paymentImage: null }]);
    };

    const removeProductField = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const removeCostField = (productIndex, costIndex) => {
        const newProducts = [...products];
        newProducts[productIndex].costs = newProducts[productIndex].costs.filter((_, i) => i !== costIndex);
        setProducts(newProducts);
    };

    const removePaymentField = (index) => {
        const newPayments = payments.filter((_, i) => i !== index);
        setPayments(newPayments);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("supplierName", supplierName);
        formData.append("purchaseDate", purchaseDate);
        formData.append("serverHost", serverHost);

        // Append products data
        products.forEach((product, productIndex) => {
            formData.append(`products[${productIndex}][brand]`, product.brand);
            formData.append(`products[${productIndex}][description]`, product.description);
            if (product.image) {
                formData.append("productsImages", product.image); // Use the same field name for all images
            }
            product.costs.forEach((cost, costIndex) => {
                formData.append(`products[${productIndex}][costs][${costIndex}][title]`, cost.title);
                formData.append(`products[${productIndex}][costs][${costIndex}][amount]`, cost.amount);
            });
        });

        // Append payments data
        payments.forEach((payment, paymentIndex) => {
            formData.append(`payments[${paymentIndex}][amount]`, payment.amount);
            formData.append(`payments[${paymentIndex}][remark]`, payment.remark);
            if (payment.paymentImage) {
                formData.append("paymentImages", payment.paymentImage); // Use the same field name for all payment images
            }
        });

        try {
            const res = await axios.post(`${serverHost}/addPurchase`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="grid grid-cols-9 gap-4 my-6">
                    <div className="col-span-4 p-4 bg-white shadow-md rounded-md">
                        product information
                        <h3 className="font-bold mt-2">Products</h3>
                        {products.map((product, productIndex) => (
                            <div key={productIndex} className="mb-4 border p-2 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold">Product {productIndex + 1}</h4>
                                    <button type="button" className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center" onClick={() => removeProductField(productIndex)}>
                                        <FaTrash /> {/* Remove product button */}
                                    </button>
                                </div>
                                <input type="text" className="border p-2 w-full mb-2" placeholder="Product Brand" value={product.brand} onChange={(e) => handleProductChange(productIndex, "brand", e.target.value)} required />
                                <textarea className="border p-2 w-full mb-2" placeholder="Product Description" value={product.description} onChange={(e) => handleProductChange(productIndex, "description", e.target.value)}></textarea>

                                <input type="file" className="border p-2 w-full mb-2" onChange={(e) => handleImageChange(productIndex, e.target.files[0])} accept="image/*" />

                                <h4 className="font-bold mt-2">Cost Details</h4>
                                {product.costs.map((cost, costIndex) => (
                                    <div key={costIndex} className="flex gap-2 mb-2">
                                        <input type="text" className="border p-2 w-1/2" placeholder="Cost Title" value={cost.title} onChange={(e) => handleCostChange(productIndex, costIndex, "title", e.target.value)} required />
                                        <input type="number" className="border p-2 w-1/2" placeholder="Amount" value={cost.amount} onChange={(e) => handleCostChange(productIndex, costIndex, "amount", e.target.value)} required />
                                        <button type="button" className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center" onClick={() => removeCostField(productIndex, costIndex)}>
                                            <FaTrash /> {/* Remove cost button */}
                                        </button>
                                    </div>
                                ))}

                                <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => addCostField(productIndex)}>
                                    Add More Cost
                                </button>
                            </div>
                        ))}
                        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addProductField}>
                            Add More Product
                        </button>

                    </div>
                    <div className="col-span-3 p-4 bg-white shadow-md rounded-md">
                        purchase information
                        <h3 className="font-bold mt-4">Payments</h3>
                        {payments.map((payment, paymentIndex) => (
                            <div key={paymentIndex} className="mb-4 border p-2 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold">Payment {paymentIndex + 1}</h4>
                                    <button type="button" className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center" onClick={() => removePaymentField(paymentIndex)}>
                                        <FaTrash /> {/* Remove payment button */}
                                    </button>
                                </div>
                                <input type="number" className="border p-2 w-full mb-2" placeholder="Amount" value={payment.amount} onChange={(e) => handlePaymentChange(paymentIndex, "amount", e.target.value)} required />
                                <textarea className="border p-2 w-full mb-2" placeholder="Remark" value={payment.remark} onChange={(e) => handlePaymentChange(paymentIndex, "remark", e.target.value)}></textarea>
                                <input type="file" className="border p-2 w-full mb-2" onChange={(e) => handlePaymentImageChange(paymentIndex, e.target.files[0])} accept="image/*" />
                            </div>
                        ))}

                        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addPaymentField}>
                            Add More Payment
                        </button>

                    </div>
                    <div className="p-4 col-span-2 bg-white shadow-md rounded-md">
                        calculation section
                    </div>

                </div>
                <div>
                    submit section
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full mt-3">
                        Submit
                    </button>
                </div>
            </form>


        </>
    );
};

export default AddPurchase;