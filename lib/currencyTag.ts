import { useUserCurrency } from "@/hooks/useUserCurrency";

type Currency = "NGN" | "USD";
const VALID_CURRENCIES: Currency[] = ["NGN", "USD"];

const CURRENCY_AVAILABILITY: Record<Currency, boolean> = {
    NGN: true,
    USD: true,
};

export const useActiveCurrency = (
    forceCurrency?: string
): {
    currency: Currency;
    symbol: string;
    country: string | null;
    countryCode: string | null;
    ip: string | null;
} => {
    const {
        currency: userCurrency,
        country,
        countryCode,
        ip
    } = useUserCurrency();

    const normalizedForce = (forceCurrency || "").toUpperCase() as Currency;
    const normalizedUser = (userCurrency || "").toUpperCase() as Currency;

    let activeCurrency: Currency = "USD"; // Fallback

    if (
        VALID_CURRENCIES.includes(normalizedForce) &&
        CURRENCY_AVAILABILITY[normalizedForce]
    ) {
        activeCurrency = normalizedForce;
    } else if (
        VALID_CURRENCIES.includes(normalizedUser) &&
        CURRENCY_AVAILABILITY[normalizedUser]
    ) {
        activeCurrency = normalizedUser;
    } else if (
        country?.toLowerCase() === "nigeria" &&
        CURRENCY_AVAILABILITY["NGN"]
    ) {
        activeCurrency = "NGN";
    }

    const symbol = activeCurrency === "NGN" ? "₦" : "$";

    return {
        currency: activeCurrency,
        symbol,
        country,
        countryCode,
        ip
    };
};
