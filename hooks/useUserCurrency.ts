import { SERVER_PUBLIC } from "@/lib/utils";
import { useEffect, useState } from "react";

type Currency = "NGN" | "USD";

export interface CountryCurrency {
    currency: Currency;
    country: string | null;
    countryCode: string | null;
    ip: string | null;
}

const VALID_CURRENCIES: Currency[] = ["NGN", "USD"];

export const useUserCurrency = (): CountryCurrency => {
    const [currency, setCurrency] = useState<Currency>("USD");
    const [country, setCountry] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState<string | null>(null);
    const [ip, setIp] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const res = await fetch(`${SERVER_PUBLIC}/geo`);
                const data = await res.json();

                console.log("Geo response:", data);

                if (data.error) {
                    console.warn("Geo service failed, using default currency USD");
                    return;
                }

                const detectedCurrency = (data.currency || "").toUpperCase() as Currency;
                if (VALID_CURRENCIES.includes(detectedCurrency)) {
                    setCurrency(detectedCurrency);
                    sessionStorage.setItem("userCurrency", detectedCurrency);
                }

                if (data.country) {
                    setCountry(data.country);
                    sessionStorage.setItem("userCountry", data.country);
                }

                if (data.countryCode) {
                    setCountryCode(data.countryCode);
                    sessionStorage.setItem("userCountryCode", data.countryCode);
                }

                if (data.ip) {
                    setIp(data.ip);
                    sessionStorage.setItem("userIp", data.ip);
                }
            } catch (error) {
                console.error("Geo fetch failed:", error);
            }
        };

        if (typeof window !== "undefined") {
            const cachedCurrency = sessionStorage.getItem("userCurrency");
            const cachedCountry = sessionStorage.getItem("userCountry");
            const cachedCountryCode = sessionStorage.getItem("userCountryCode");
            const cachedIp = sessionStorage.getItem("userIp");

            const allCached =
                cachedCurrency &&
                VALID_CURRENCIES.includes(cachedCurrency as Currency) &&
                cachedCountry &&
                cachedCountryCode &&
                cachedIp;

            if (allCached) {
                setCurrency(cachedCurrency as Currency);
                setCountry(cachedCountry);
                setCountryCode(cachedCountryCode);
                setIp(cachedIp);
            } else {
                fetchCurrency();
            }
        }
    }, []);

    return { currency, country, countryCode, ip };
};
