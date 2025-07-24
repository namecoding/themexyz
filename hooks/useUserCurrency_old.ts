import { baseUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

type Currency = "NGN" | "USD";
type CountryCurrency = {
    currency: Currency;
    country: string | null;
};

const VALID_CURRENCIES: Currency[] = ["NGN", "USD"];

export const useUserCurrency = (): CountryCurrency => {
    const [currency, setCurrency] = useState<Currency>("USD");
    const [country, setCountry] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const cachedCurrency = sessionStorage.getItem("userCurrency");
                const cachedCountry = sessionStorage.getItem("userCountry");

                if (cachedCurrency && VALID_CURRENCIES.includes(cachedCurrency as Currency)) {
                    setCurrency(cachedCurrency as Currency);
                    if (cachedCountry) setCountry(cachedCountry);
                    return;
                }

                const res = await fetch(`${baseUrl}/geo`);
                const data = await res.json();

                const detectedCurrency = (data.currency || "").toUpperCase() as Currency;
                if (VALID_CURRENCIES.includes(detectedCurrency)) {
                    setCurrency(detectedCurrency);
                    sessionStorage.setItem("userCurrency", detectedCurrency);
                }

                if (data.country) {
                    setCountry(data.country);
                    sessionStorage.setItem("userCountry", data.country);
                }

            } catch (error) {
                console.error("Currency detection failed:", error);
            }
        };

        if (typeof window !== "undefined") {
            fetchCurrency();
        }
    }, []);

    return { currency, country };
};
