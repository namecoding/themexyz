import React from "react";
import { X } from "lucide-react"; // You can replace with your icon lib
import { motion } from "framer-motion";

interface PaymentProcessingProps {
    reference: string;
    status: "processing" | "success" | "cancelled" | "failed";
    onClose?: () => void;
}

export const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ reference, status, onClose }) => {
    const isProcessing = status === "processing";

    const getStatusContent = () => {
        switch (status) {
            case "processing":
                return "Processing your payment...";
            case "success":
                return "Payment Successful!";
            case "cancelled":
                return "Payment Cancelled.";
            case "failed":
                return "Payment Failed.";
            default:
                return "";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">

                {/* Disable close button while processing */}
                {!isProcessing && (
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                )}

                <div className="mb-6">
                    {isProcessing && (
                        <motion.div
                            className="mx-auto mb-4 w-20 h-20 border-8 border-green-600 border-dashed rounded-full animate-spin"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    )}

                    {!isProcessing && (
                        <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                            {status === "success" && (
                                <div className="text-green-600 text-6xl">✔</div>
                            )}
                            {status === "cancelled" && (
                                <div className="text-yellow-500 text-6xl">⚠</div>
                            )}
                            {status === "failed" && (
                                <div className="text-red-500 text-6xl">✖</div>
                            )}
                        </div>
                    )}

                    <h2 className="text-2xl font-semibold mb-2">{getStatusContent()}</h2>
                    {!isProcessing && reference && (
                        <p className="text-sm text-gray-500">Reference: {reference}</p>
                    )}

                </div>

                {(!isProcessing && onClose) && (
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};
