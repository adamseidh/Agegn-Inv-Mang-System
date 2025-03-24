import { useState, useEffect } from "react";
import axios from "axios";
import { FaRemoveFormat, FaTrash } from "react-icons/fa";
import CloseIcon from '@mui/icons-material/Close';

const AddPurchase = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
    const [supplierName, setSupplierName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [products, setProducts] = useState([{ brand: "", unit: "", quantity: "", description: "", image: null, itemCost: "", profitPercent: 10, costs: [{ title: "", amount: "" }] }]);
    const [payments, setPayments] = useState([{ amount: "", remark: "", paymentImage: null }]);

    // Calculate total cost for a product
    const calculateTotalCost = (product) => {
        console.log('product', product);
        const additionalCosts = product.costs.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0);
        return (parseFloat(product.itemCost || 0) + additionalCosts).toFixed(2);
    };


    // Calculate Additional cost
    const calculateAdditionalCost = (product) => {
        const additionalCosts = product.costs.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0);
        return additionalCosts;
    };

    // Calculate profit for a product
    const calculateProfit = (product) => {
        const totalCost = calculateTotalCost(product);
        return (totalCost * (product.profitPercent / 100)).toFixed(2);
    };

    // Calculate selling price for a product
    const calculateSellingPrice = (product) => {
        const totalCost = calculateTotalCost(product);
        const profit = calculateProfit(product);
        return (parseFloat(totalCost) + parseFloat(profit)).toFixed(2);
    };

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
        setProducts([...products, { brand: "", unit: "", quantity: "", description: "", image: null, itemCost: "", profitPercent: 10, costs: [{ title: "", amount: "" }] }]);
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

    const compeltedPayment = () => {
        const completed_payment = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0).toFixed(2);
        return completed_payment;
    }


    const productTotalCost = () => {
        const product_totalCost = products.reduce((sum, product) => sum + parseFloat(product.itemCost || 0), 0).toFixed(2)
        return product_totalCost;
    }

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
            formData.append(`products[${productIndex}][itemCost]`, product.itemCost);
            formData.append(`products[${productIndex}][unit]`, product.unit);
            formData.append(`products[${productIndex}][quantity]`, product.quantity);
            formData.append(`products[${productIndex}][totalPrice]`, parseFloat(product.quantity) * parseFloat(itemCost));
            formData.append(`products[${productIndex}][sellingPrice]`, calculateSellingPrice(product));
            if (product.image) {
                formData.append("productsImages", product.image);
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
                formData.append("paymentImages", payment.paymentImage);
            }
        });

        // Log FormData for debugging
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const res = await axios.post(`${serverHost}/addPurchase`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(res.data.message);
        } catch (error) {
            console.error("Error submitting form:", error.response ? error.response.data : error.message);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-9 gap-4 my-6">
                    {/* Product Information Column */}
                    <div className="col-span-4 p-4 bg-white shadow-md rounded-md scrollable-column" style={{ height: "100vh", overflowY: "auto" }}>
                        <h3 className="font-bold mt-2">Products</h3>
                        {products.map((product, productIndex) => (
                            <div key={productIndex} className="mb-4 bg-gray-50 shadow-md border p-2 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold">Product {productIndex + 1}</h4>
                                    <button type="button" className="text-red-500 flex items-center justify-center font-bold text-3xl hover:bg-red-500 rounded-sm hover:text-white" onClick={() => removeProductField(productIndex)}>
                                        <CloseIcon />
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="primaryInput peer"
                                        placeholder=" "
                                        value={product.brand}
                                        onChange={(e) => handleProductChange(productIndex, "brand", e.target.value)}
                                        required
                                    />
                                    <label className="inputLabel">Product Brand</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="primaryInput peer"
                                        placeholder=" "
                                        value={product.itemCost}
                                        onChange={(e) => handleProductChange(productIndex, "itemCost", e.target.value)}
                                        required
                                    />
                                    <label className="inputLabel">Item Cost</label>
                                </div>


                                <div className="relative">
                                    <input
                                        type="text"
                                        className="primaryInput peer"
                                        placeholder=" "
                                        value={product.unit}
                                        onChange={(e) => handleProductChange(productIndex, "unit", e.target.value)}
                                        required
                                    />
                                    <label className="inputLabel">Measurement Unit</label>
                                </div>


                                <div className="relative">
                                    <input
                                        type="text"
                                        className="primaryInput peer"
                                        placeholder=" "
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(productIndex, "quantity", e.target.value)}
                                        required
                                    />
                                    <label className="inputLabel">Quantity</label>
                                </div>

                                <div className="relative mt-1">
                                    <textarea className="primaryInput peer" placeholder="" value={product.description} onChange={(e) => handleProductChange(productIndex, "description", e.target.value)}></textarea>
                                    <label className="inputLabel">Product Description</label>
                                </div>
                                <input type="file" className="border p-2 w-full mb-2" onChange={(e) => handleImageChange(productIndex, e.target.files[0])} accept="image/*" />

                                <h4 className="font-bold mt-2">Additional Costs</h4>
                                <div className="bg-white border rounded p-4">
                                    {product.costs.map((cost, costIndex) => (
                                        <div key={costIndex} className="flex gap-2 mb-2 bg-gray-50 shadow-md border p-2 rounded">
                                            <input type="text" className="border p-2 w-1/2" placeholder="Cost Title" value={cost.title} onChange={(e) => handleCostChange(productIndex, costIndex, "title", e.target.value)} required />
                                            <input type="number" className="border p-2 w-1/2" placeholder="Amount" value={cost.amount} onChange={(e) => handleCostChange(productIndex, costIndex, "amount", e.target.value)} required />
                                            <button type="button" className="text-red-500 flex items-center justify-center font-bold text-3xl hover:bg-red-500 rounded-sm hover:text-white" onClick={() => removeCostField(productIndex, costIndex)}>
                                                <CloseIcon />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="primaryBtn" onClick={() => addCostField(productIndex)}>
                                        + Cost
                                    </button>
                                </div>

                                <h4 className="font-bold mt-2">Price Estimation Per Product</h4>
                                <div className="bg-white border rounded-lg p-6 shadow-md">
                                    <div className="flex flex-row items-center gap-2 mt-1">
                                        <p className="text-gray-500 text-sm font-medium">Item Cost:</p>
                                        <p className="text-gray-700 font-semibold">{product.itemCost}</p>
                                    </div>



                                    <div className="flex flex-row items-center gap-2 mt-2">
                                        <p className="text-gray-500 text-sm font-medium">Additional Costs:</p>
                                        <p className="text-gray-700 font-semibold">
                                            {product.costs.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex flex-row items-center gap-2 mt-2">
                                        <p className="text-gray-500 text-sm font-medium">Overall Cost:</p>
                                        <p className="text-gray-700 font-semibold">{calculateTotalCost(product)}</p>
                                    </div>

                                    <div className="flex flex-row items-center gap-2 py-2 border-t mt-3 pt-3">
                                        <p className="text-gray-500 text-sm font-medium">Profit:</p>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="primaryInput peer"
                                                placeholder=" "
                                                value={product.profitPercent}
                                                onChange={(e) => handleProductChange(productIndex, "profitPercent", e.target.value)}
                                                required
                                            />
                                            <label className="inputLabel">Profit %</label>
                                        </div>
                                        <span className="text-gray-700 font-semibold">X {calculateTotalCost(product)}</span>
                                    </div>

                                    <div className="items-center gap-2 py-2 border-t mt-3 pt-3">
                                        <div className="flex flex-row items-center gap-2">
                                            <p className="text-gray-500 text-sm font-medium">Selling Price:</p>
                                            <p className="text-gray-700 font-semibold">{calculateSellingPrice(product)}</p>
                                        </div>

                                        <div className="flex flex-row items-center gap-2 mt-1">
                                            <p className="text-gray-500 text-sm font-medium">Optional price</p>
                                            <div className="relative mt-3">
                                                <input
                                                    type="number"
                                                    className="primaryInput peer"
                                                    placeholder=" "
                                                    value={calculateSellingPrice(product)}
                                                    onChange={(e) => handleProductChange(productIndex, "sellingPrice", e.target.value)}
                                                    required
                                                />
                                                <label className="inputLabel">Custom Price</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="primaryBtn" onClick={addProductField}>
                            + Product
                        </button>
                    </div>

                    {/* Payment Information Column */}
                    <div className="col-span-3 p-4 bg-white shadow-md rounded-md scrollable-column" style={{ height: "100vh", overflowY: "auto" }}>
                        <h3 className="font-bold mt-4">Payments</h3>
                        {payments.map((payment, paymentIndex) => (
                            <div key={paymentIndex} className="mb-4 bg-gray-50 shadow-md border p-2 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold">Payment {paymentIndex + 1}</h4>
                                    <button type="button" className="text-red-500 flex items-center justify-center font-bold text-3xl hover:bg-red-500 rounded-sm hover:text-white" onClick={() => removePaymentField(paymentIndex)}>
                                        <CloseIcon />
                                    </button>
                                </div>
                                <input type="number" className="border p-2 w-full mb-2" placeholder="Amount" value={payment.amount} onChange={(e) => handlePaymentChange(paymentIndex, "amount", e.target.value)} required />
                                <textarea className="border p-2 w-full mb-2" placeholder="Remark" value={payment.remark} onChange={(e) => handlePaymentChange(paymentIndex, "remark", e.target.value)}></textarea>
                                <input type="file" className="border p-2 w-full mb-2" onChange={(e) => handlePaymentImageChange(paymentIndex, e.target.files[0])} accept="image/*" />
                            </div>
                        ))}

                        <button type="button" className="primaryBtn" onClick={addPaymentField}>
                            + Payment Term
                        </button>
                    </div>

                    {/* Purchase summary Section Column */}
                    <div className="p-4 col-span-2 bg-white shadow-md rounded-md scrollable-column" style={{ height: "100vh", overflowY: "auto" }}>
                        <h3 className="font-bold">Purchase Summary</h3>

                        <div className="mt-4">
                            <h4 className="font-bold">List of Product Brands</h4>
                            {products.map((product, index) => (
                                <div key={index} className="mt-2">
                                    <p className="text-gray-700 font-semibold">{product.brand}</p>
                                    <p className="text-gray-500 text-sm">Purchase Cost: {product.itemCost}</p>
                                    <p className="text-gray-500 text-sm">Unit: {product.unit}</p>
                                    <p className="text-gray-500 text-sm">Quantity: {product.quantity}</p>
                                    <p className="text-gray-500 text-sm">Total Amount: {parseFloat(product.quantity) * parseFloat(product.itemCost)}</p>
                                    <p className="text-gray-500 text-sm">Additional Cost: {calculateAdditionalCost(product)}</p>
                                    <p className="text-gray-500 text-sm">Overall Cost: {calculateTotalCost(product)}</p>
                                    <p className="text-gray-500 text-sm">Overall Total: {calculateTotalCost(product) * parseFloat(product.quantity)}</p>
                                    <p className="text-gray-500 text-sm">Selling Price: {calculateSellingPrice(product)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 border p-1 rounded-md ">
                            <div>Product Payments</div>
                            <p className="text-gray-500 text-sm underline">This is purchase price of the product without additional costs</p>
                            <div className="flex flex-row items-center gap-2 mt-1">
                                <p className="text-gray-500 text-sm font-medium">Total Product Cost:</p>
                                <p className="text-gray-700 font-semibold">
                                    {productTotalCost()}
                                </p>
                            </div>


                            <div className="flex flex-row items-center gap-2 mt-1">
                                <p className="text-gray-500 text-sm font-medium">Completed Payment</p>
                                <p className="text-gray-700 font-semibold">
                                    {compeltedPayment()}
                                </p>
                            </div>


                            <div className="flex flex-row items-center gap-2 mt-1">
                                <p className="text-gray-500 text-sm font-medium">Not Completed</p>
                                <p className="text-gray-700 font-semibold">
                                    {productTotalCost() - compeltedPayment()}
                                </p>
                            </div>
                        </div>

                        <button type="submit" className="primaryBtn mt-4">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddPurchase;
