import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";

const AddPayment = ({ isOpen, close, addPayment }) => {
    if (!isOpen) return null;

    const [payment, setPayment] = useState({
        amount: "",
        remark: "",
        paymentImage: null
    });

    const handleChange = (e, field) => {
        setPayment({ ...payment, [field]: e.target.value });
    };

    const handleImageChange = (e) => {
        setPayment({ ...payment, paymentImage: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addPayment(payment);
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
                            <p className="text-xl pb-2 font-bold text-gray-700">Add Payment</p>
                        </div>
                        <button onClick={close} className='text-xl items-baseline hover:text-red-700 text-red-500'>
                            <FaXmark />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className='flex items-center flex-col'>
                        <input
                            value={payment.amount}
                            onChange={(e) => handleChange(e, "amount")}
                            type="number"
                            placeholder="Amount"
                            className="primaryNumberInput text-gray-700 w-full mb-3"
                            required
                        />
                        <textarea
                            value={payment.remark}
                            onChange={(e) => handleChange(e, "remark")}
                            placeholder="Remark"
                            className="primaryInput text-gray-700 w-full mb-3"
                        />
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="primaryInput text-gray-700 w-full mb-3"
                            accept="image/*"
                        />
                        <button type="submit" className="primaryBtn mt-4">
                            Save Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPayment;