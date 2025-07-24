"use client";

import { useUserCurrency } from "@/hooks/useUserCurrency";

type PriceTagProps = {
    priceNGN: number;
    priceUSD: number;
    className?: string;
    showOnlySymbol?: boolean;
};

const PriceTag = ({
                      priceNGN,
                      priceUSD,
                      className,
                      showOnlySymbol = false,
                  }: PriceTagProps) => {
    const currency = useUserCurrency();

    const amount = currency === "NGN" ? priceNGN : priceUSD;

    const localeMap: Record<string, string> = {
        NGN: "en-NG",
        USD: "en-US",
    };

    const locale = localeMap[currency] || "en-US";

    const formatOptions = {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    };

    if (showOnlySymbol) {
        const parts = new Intl.NumberFormat(locale, formatOptions).formatToParts(amount);
        const symbolPart = parts.find((part) => part.type === "currency");
        return <span className={className}>{symbolPart?.value ?? currency}</span>;
    }

    const formatted = new Intl.NumberFormat(locale, formatOptions).format(amount);

    return <span className={className}>{formatted}</span>;
};

export default PriceTag;
