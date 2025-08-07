"use client"

import { X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActiveCurrency } from "@/lib/currencyTag";
import { defaultCurrency } from "@/lib/utils";
import { useEffect } from "react";

interface CartConsentProps {
  onCheckout: () => void
  onViewCart: () => void
  itemCount: number
  subtotal: number
}

export default function CartConsent({ onCheckout, onViewCart, itemCount, subtotal }: CartConsentProps) {

  useEffect(() => {
    console.log(subtotal)
  }, [])
  const { currency, symbol } = useActiveCurrency(defaultCurrency)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200 animate-slide-up">
      <div className="container mx-auto p-4 md:p-2 max-w-5xl relative">
        {/* Close Button (X) Positioned at Top-Right of the Whole Box */}
        {/*<button*/}
        {/*    onClick={onViewCart}*/}
        {/*    className="absolute top-4 right-0 text-gray-400 hover:text-gray-600"*/}
        {/*    aria-label="Close cart preview"*/}
        {/*>*/}
        {/*    <X size={18} />*/}
        {/*</button>*/}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <ShoppingCart className="text-green-600" size={20} />
            <div>
              <span className="font-semibold">
                {itemCount} item{itemCount !== 1 && "s"} in your cart
              </span>
              <p className="text-gray-600 text-xs md:text-sm">
                Subtotal:{" "}
                <span className="font-medium text-black">
                  {symbol}{subtotal.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            {/*<Button*/}
            {/*    variant="outline"*/}
            {/*    size="sm"*/}
            {/*    onClick={onViewCart}*/}
            {/*    className="text-xs"*/}
            {/*>*/}
            {/*    View Cart*/}
            {/*</Button>*/}
            <Button
              size="sm"
              onClick={onCheckout}
              className="bg-green-500 hover:bg-green-600 text-white text-xs"
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
