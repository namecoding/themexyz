"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
// import PriceTag from "@/components/PriceTag";
import { useActiveCurrency } from "@/lib/currencyTag";
import { defaultCurrency, getAuthorHelpDuration, getInitials } from "@/lib/utils";

interface CartModalProps {
  onClose: () => void
  item: any
}

export default function CartModal({ onClose, item, onViewChat }: CartModalProps) {
  const [extendSupport, setExtendSupport] = useState(false)
  const { currency, symbol } = useActiveCurrency(defaultCurrency)
  if (!item) return null

  const handleExtendSupportChange = () => {
    setExtendSupport(!extendSupport)
  }

  useEffect(() => {
    console.log(item);

    // Disable scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scroll
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full">
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-500 rounded-full p-2">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-6">Item added to your cart</h2>
        </div>

        <div className="border-t border-gray-200 p-4 flex items-center">
          <div className="flex-shrink-0 mr-4">
            {
              item.authorImage ?
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-4">
                  <img
                    src={item.authorImage}
                    alt={'item.author'}
                    width={80}
                    height={80}
                  />
                </div>

                :
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-black font-bold uppercase text-lg">{getInitials(item.author)}</span>
                </div>
            }

          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-sm capitalize">{item.title}</h3>
            <p className="text-xs text-gray-500">by {item.author}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-xl font-bold">{symbol}{currency === 'NGN' ? item.priceNGN.toLocaleString() : item.priceUSD.toLocaleString()}</div>
            {/*<PriceTag priceNGN={item.priceNGN} priceUSD={item.priceUSD} className="font-bold text-xl"/>*/}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between text-sm mb-1">
            <span>License:</span>
            <span className="text-blue-500">{item?.license}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Support:</span>
            <span>{getAuthorHelpDuration(item.helpDurationSettings)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-500 text-center mb-4">
            Price is in {currency === 'NGN' ? 'Naira' : 'US dollars'} and excludes tax and handling fees
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Keep Browsing
            </Button>
            <Button onClick={onViewChat} className="flex-1 bg-green-500 hover:bg-green-600 text-white">Go to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
