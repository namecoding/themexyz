export default async function handler(req, res) {
    const { amount, email, name, reference } = req.body;

    const payload = {
        country: "NG",
        currency: "NGN",
        amount: amount.toString(),
        reference,
        customer: { email, name },
        merchantId: process.env.OPAY_MERCHANT_ID,
        paymentMethod: "card",
        channel: "web",
    };

    try {
        const response = await fetch("https://checkout.opaycheckout.com/api/v3/checkout-initialize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPAY_PUBLIC_KEY}`,
                MerchantId: process.env.OPAY_MERCHANT_ID,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error("Init error:", err);
        res.status(500).json({ error: "Failed to initialize payment" });
    }
}
