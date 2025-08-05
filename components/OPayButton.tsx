import { useState } from "react";
import {SERVER_PUBLIC} from "@/lib/utils";

const OPayButton = ({ amount, name, email }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        const reference = "ref_" + Date.now();

        // Call backend to get checkout token (optional)
        try {
            const res = await fetch(`${SERVER_PUBLIC}/opay-init-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, name, email, reference }),
            });

            const data = await res.json();
            setLoading(false);

            if (!window.OPay) {
                alert("OPay SDK not loaded");
                return;
            }

            const checkout = window.OPay.init({
                reference,
                amount: amount.toString(),
                currency: "NGN",
                country: "NG",
                channel: "web",
                customer: { name, email },
                merchant: { merchantId: process.env.NEXT_PUBLIC_OPAY_MERCHANT_ID },
                onSuccess: (data) => {
                    console.log("✅ Payment successful", data);
                    // Optionally call /api/verify-payment with reference
                },
                onClose: () => console.log("Payment closed by user"),
                onError: (err) => console.error("Payment error", err),
            });

            checkout.open();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={loading}
        >
            {loading ? "Processing..." : "Pay with OPay"}
        </button>
    );
};

export default OPayButton;
