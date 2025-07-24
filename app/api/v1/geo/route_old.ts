export const runtime = "nodejs";

export async function GET(req: Request) {
    let realIp =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        null;

    if (process.env.NODE_ENV === "development") {
        // Use a dummy public IP for testing
        realIp = "8.8.8.8";
    }

    if (!realIp) {
        return Response.json({ error: "IP not found" }, { status: 400 });
    }

    try {
        const geoRes = await fetch(`https://ipapi.co/${realIp}/json/`, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const data = await geoRes.json();

        console.log("IPAPI Response:", data);

        return Response.json({
            ip: realIp,
            country: data.country_name,
            countryCode: data.country_code,
            currency: data.currency,
        });
    } catch (error) {
        console.error("Geo detection error:", error);
        return Response.json({ error: "Geo detection failed" }, { status: 500 });
    }
}
