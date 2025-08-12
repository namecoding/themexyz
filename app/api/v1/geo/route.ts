export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function GET() {
    const IPDATA_API_KEY = process.env.IPDATA_API_KEY;
    const IPINFO_API_KEY = process.env.IPINFO_API_KEY;
    const IPGEOLOCATION_API_KEY = process.env.IPGEOLOCATION_API_KEY;

    let result = null;

    // 1️⃣ Try ipapi.co
    try {
        const res = await fetch("https://ipapi.co/json/", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
            const data = await res.json();
            //console.log("ipapi.co:", data);
            result = {
                ip: data.ip,
                country: data.country_name,
                countryCode: data.country_code,
                currency: typeof data.currency === "string" ? data.currency : (data.currency?.code || "USD"),
            };
        }
    } catch (err) {
        console.warn("ipapi.co failed:", err);
    }

    // 2️⃣ Try ipdata.co
    if (!result && IPDATA_API_KEY) {
        try {
            const res = await fetch(`https://api.ipdata.co?api-key=${IPDATA_API_KEY}`);
            if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
                const data = await res.json();
                //console.log("ipdata.co:", data);
                result = {
                    ip: data.ip,
                    country: data.country_name,
                    countryCode: data.country_code,
                    currency: data.currency?.code || "USD",
                };
            }
        } catch (err) {
            console.warn("ipdata.co failed:", err);
        }
    }

    // 3️⃣ Try ipinfo.io
    if (!result && IPINFO_API_KEY) {
        try {
            const res = await fetch(`https://ipinfo.io?token=${IPINFO_API_KEY}`);
            if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
                const data = await res.json();
                //console.log("ipinfo.io:", data);
                result = {
                    ip: data.ip,
                    country: data.country,
                    countryCode: data.country,
                    currency: "USD" // ipinfo doesn't give currency
                };
            }
        } catch (err) {
            //console.warn("ipinfo.io failed:", err);
        }
    }

    // 4️⃣ Try ipgeolocation.io
    if (!result && IPGEOLOCATION_API_KEY) {
        try {
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEOLOCATION_API_KEY}`);
            if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
                const data = await res.json();
                //console.log("ipgeolocation.io:", data);
                result = {
                    ip: data.ip,
                    country: data.country_name,
                    countryCode: data.country_code2,
                    currency: data.currency?.code || "USD",
                };
            }
        } catch (err) {
            console.warn("ipgeolocation.io failed:", err);
        }
    }

    if (result) {
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    } else {
        return new Response(JSON.stringify({ error: "Geo detection failed" }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
//{ status: 400, headers: corsHeaders }