import React from "react";
import { FaXmark } from "react-icons/fa6";

const PaymentDetail = ({ isOpen, close, payment }) => {
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
                            <p className="text-xl pb-2 font-bold text-gray-700">Payment Details</p>
                        </div>
                        <button onClick={close} className='text-xl items-baseline hover:text-red-700 text-red-500'>
                            <FaXmark />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Amount:</p>
                            <p className="text-gray-700 font-semibold">{payment.amount}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Remark:</p>
                            <p className="text-gray-700 font-semibold">{payment.remark}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetail;