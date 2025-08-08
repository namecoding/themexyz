"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart, Minus, Plus, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ConfirmationModal from "./confirmation-modal"
import CheckoutPage from "./checkout-page"
import { defaultCurrency, getAuthorHelpDuration, getHelpDurationByType, metaData, helpDurationLabels, SERVER_PUBLIC } from "@/lib/utils"
import { useActiveCurrency } from "@/lib/currencyTag"
import Leaf from "@/components/leaf"
import { useRouter } from "next/navigation";

interface CartPageProps {
  cartItems: any[]
  setCartItems: (items: any[]) => void
  onClose: () => void
  userData: any
}

export default function CartPage({ cartItems, setCartItems, onClose, userData }: CartPageProps) {
  const [extendSupport, setExtendSupport] = useState<Record<string, boolean>>({})
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [supportExtensionTotal, setSupportExtensionTotal] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showConfirmation2, setShowConfirmation2] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<number | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const { currency, symbol } = useActiveCurrency(defaultCurrency)
  const router = useRouter();

  const [reupdatingCart, setReupdatingCart] = useState(true)

  useEffect(() => {
    const itemsWithQuantity = cartItems.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }))
    setCartItems(itemsWithQuantity)
  }, [])

  useEffect(() => {
    const verifyCartItems = async () => {
      const productIds = cartItems.map(item => item.id);
      if (productIds.length === 0) return;

      setReupdatingCart(true);

      try {
        const res = await fetch(`${SERVER_PUBLIC}/themes/verify-cart-items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productIds })
        });

        if (!res.ok) throw new Error('Failed to fetch updated cart data');

        const result = await res.json();
        setReupdatingCart(false);

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid data from server');
        }

        const updatedProducts = result.data;

        const verifiedCartItems = cartItems
          .map(cartItem => {
            const updatedProduct = updatedProducts.find(p => p.id === cartItem.id);
            if (!updatedProduct || !updatedProduct.isPublished) return null;
            return {
              ...cartItem,
              priceNGN: updatedProduct.priceNGN,
              priceUSD: updatedProduct.priceUSD,
              isPublished: updatedProduct.isPublished,
              license: updatedProduct.license,
              helpDurationSettings: updatedProduct.helpDurationSettings
            };
          })
          .filter(Boolean); // Remove nulls (unavailable products)

        // Only update cart if it actually changed
        const isChanged = JSON.stringify(cartItems) !== JSON.stringify(verifiedCartItems);

        if (isChanged) {
          setCartItems(verifiedCartItems as any[]);
          localStorage.setItem('cartItems', JSON.stringify(verifiedCartItems));
        }
      } catch (error) {
        setReupdatingCart(false);
        console.log('Error verifying cart items:', error);
      }
    };

    verifyCartItems();

    const intervalId = setInterval(verifyCartItems, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []); // 🔁 Removed `cartItems.length` dependency


  useEffect(() => {
    let itemSubtotal = 0
    let supportTotal = 0

    cartItems.forEach((item) => {
      const quantity = item.quantity || 1
      const itemPrice = currency === 'NGN' ? item.priceNGN : item.priceUSD
      itemSubtotal += itemPrice * quantity

      if (extendSupport[item.id]) {
        const extendedData = getHelpDurationByType(item.helpDurationSettings, "extended")[0]
        if (extendedData) {
          const supportFee = currency === 'NGN' ? extendedData.feeNGN : extendedData.feeUSD
          supportTotal += supportFee * quantity
        }
      }
    })

    setSubtotal(itemSubtotal)
    setSupportExtensionTotal(supportTotal)
    setTotal(itemSubtotal + supportTotal)
  }, [cartItems, extendSupport, currency])

  const formatPrice__ = (amountNGN: number, amountUSD?: number) =>
    currency === "NGN"
      ? `${amountNGN.toLocaleString()}`
      : `${(amountUSD ?? amountNGN)?.toLocaleString()}`

  const formatPrice = (amountNGN: number, amountUSD?: number) =>
    (currency === "NGN" ? amountNGN : amountUSD ?? amountNGN).toLocaleString()


  const handleExtendSupportChange = (itemId: string) => {
    setExtendSupport((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }


  const increaseQuantity = (itemId: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    )
  }

  const decreaseQuantity = (itemId: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const confirmRemoveItem = (itemId: number) => {
    setItemToRemove(itemId)
    setShowConfirmation(true)
  }

  const removeAll = () => {
    setShowConfirmation2(false)
    setCartItems([])
  }

  const handleClearCart = () => setShowConfirmation2(true)

  const removeItem = () => {
    if (itemToRemove !== null) {
      setCartItems(cartItems.filter((item) => item.id !== itemToRemove))
      setShowConfirmation(false)
      setItemToRemove(null)
    }
  }

  const proceedToCheckout = () => setShowCheckout(true)
  const returnToCart = () => setShowCheckout(false)

  const getCombinedHelpDuration_old = (item: any) => {
    const baseDurationStr = getAuthorHelpDuration(item.helpDurationSettings) || ""
    const extendedData = getHelpDurationByType(item.helpDurationSettings, "extended")[0]
    const extendedDurationStr = extendedData?.duration || ""

    // Helper to extract numeric value in months
    const parseDuration = (str: string): number => {
      if (!str) return 0
      const match = str.match(/(\d+)\s*(m|month|months)/i)
      return match ? parseInt(match[1], 10) : 0
    }

    const baseMonths = parseDuration(baseDurationStr)
    const extendedMonths = parseDuration(extendedDurationStr)

    const totalMonths = extendSupport[item.id] ? baseMonths + extendedMonths : baseMonths

    return totalMonths > 0 ? `${totalMonths} month${totalMonths > 1 ? "s" : ""}` : "N/A"
  }


  const getCombinedHelpDuration = (item: any, help: "author" | "extended") => {
    const data = getHelpDurationByType(item.helpDurationSettings, help)[0];
    const durationStr = data?.duration || "";

    const parseDuration = (str: string): { value: number; unit: "week" | "month" | null } => {
      if (!str) return { value: 0, unit: null };

      const weekMatch = str.match(/^(\d+)\s*(w|week|weeks)$/i);
      if (weekMatch) return { value: parseInt(weekMatch[1], 10), unit: "week" };

      const monthMatch = str.match(/^(\d+)\s*(m|month|months)$/i);
      if (monthMatch) return { value: parseInt(monthMatch[1], 10), unit: "month" };

      return { value: 0, unit: null };
    };

    const parsed = parseDuration(durationStr);

    if (parsed.value > 0 && parsed.unit) {
      const unitLabel = parsed.value > 1 ? `${parsed.unit}s` : parsed.unit;
      return `${parsed.value} ${unitLabel}`;
    }

    return "N/A";
  };



  if (showCheckout) {
    return (
      <CheckoutPage
        onBack={returnToCart}
        cartItems={cartItems}
        subtotal={subtotal}
        supportExtensionTotal={supportExtensionTotal}
        total={total}
        onClose={onClose}
        userData={userData}
      />
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <header className="bg-[#333333] text-white py-3 px-4">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <Leaf small={'s'} />
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
              <X size={24} />
            </button>
          </div>
        </header>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <header className="bg-[#333333] text-white py-3 px-4">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <Leaf small={'s'} />
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>

        {
          reupdatingCart ?
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-md shadow-sm p-4 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                    {[...Array(1)].map((_, j) => (
                      <div key={j} className="flex gap-4 border-b pb-4 last:border-b-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-md" />
                        <div className="flex flex-col gap-2 flex-grow">
                          <div className="h-4 w-3/4 bg-gray-200 rounded" />
                          <div className="h-3 w-1/2 bg-gray-200 rounded" />
                          <div className="h-3 w-2/3 bg-gray-200 rounded" />
                          <div className="h-4 w-1/3 bg-gray-200 rounded" />
                        </div>
                        <div className="flex-shrink-0">
                          <div className="h-4 w-12 bg-gray-200 rounded mb-2" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-md shadow-sm p-4 space-y-4 sticky top-4">
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-3 w-10 bg-gray-200 rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            </div>
            :
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-md shadow-sm mb-6">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold">
                      Cart Items (
                      {
                        // cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
                        cartItems.length
                      }
                      )
                    </h2>
                    {cartItems.length > 1 && (
                      <button onClick={handleClearCart} className="text-red-500 hover:text-red-700 text-sm">
                        Delete All
                      </button>
                    )}
                  </div>

                  {cartItems.map((item) => {
                    const extendedData = getHelpDurationByType(item.helpDurationSettings, "extended")[0]
                    const feeUSD = extendedData?.feeUSD ?? 0
                    const feeNGN = extendedData?.feeNGN ?? 0

                    return (
                      <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                              src={item?.galleryImages[0] || "/placeholder.svg?height=80&width=80"}
                              alt={item.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-sm mb-1 capitalize">{item.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">by {item.author || metaData.name + ' Author'}</p>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-600 mb-3">
                              <div className="capitalize"><span className="font-medium">License:</span> {item.license}</div>
                              <div><span className="font-medium">Support:</span> {getCombinedHelpDuration(item, 'author')}</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  onClick={() => decreaseQuantity(item.id)}
                                  disabled={(item.quantity || 1) <= 1}>
                                  <Minus size={14} />
                                </button>
                                <span className="px-2 py-1 text-sm">{item.quantity || 1}</span>
                                <button className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => increaseQuantity(item.id)}>
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button onClick={() => confirmRemoveItem(item.id)} className="text-red-500 hover:text-red-700 flex items-center text-xs">
                                <Trash2 size={14} className="mr-1" /> Remove
                              </button>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            {/* Always show the price */}
                            <div className="font-bold">{symbol + formatPrice(item.priceNGN, item.priceUSD)}</div>

                            {/* Only conditionally show the extend support checkbox */}
                            {extendedData && (
                              <div className="mt-4">
                                <label className="flex items-center text-xs cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="mr-2 h-3 w-3 rounded border-gray-300 text-[#82b440] focus:ring-[#82b440]"
                                    checked={!!extendSupport[item.id]}
                                    onChange={() => handleExtendSupportChange(item.id)}
                                  />
                                  <span>
                                    Extend support (
                                    +{currency === 'NGN'
                                      ? symbol + feeNGN.toLocaleString()
                                      : symbol + feeUSD.toLocaleString()}
                                    )
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-md shadow-sm p-4 sticky top-4">
                  <h2 className="font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{symbol + formatPrice(subtotal)}</span>
                    </div>
                    {supportExtensionTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Support Extension</span>
                        <span>{symbol + formatPrice(supportExtensionTotal)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span>{symbol + formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white mb-3" onClick={proceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-gray-500 mb-4">
                    Price is in {currency === 'NGN' ? 'Naira' : 'US dollars'} and excludes tax
                  </p>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <Link href="#" className="flex items-center hover:text-[#82b440]" onClick={(e) => { e.preventDefault(); onClose() }}>
                      Continue Shopping <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        }


      </div>

      {showConfirmation && (
        <ConfirmationModal
          title="Remove Item"
          message="Are you sure you want to remove this item from your cart?"
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={removeItem}
          onCancel={() => { setShowConfirmation(false); setItemToRemove(null) }}
          isDestructive={true}
        />
      )}

      {showConfirmation2 && (
        <ConfirmationModal
          title="Remove All Items"
          message="Are you sure you want to remove all items from your cart?"
          confirmText="Remove All"
          cancelText="Cancel"
          onConfirm={removeAll}
          onCancel={() => setShowConfirmation2(false)}
          isDestructive={true}
        />
      )}


      {/* Real-time cart update notice */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-300 text-yellow-800 text-center p-2 text-xs z-50">
        Note: Items in your cart can change in real-time. Prices may update or items may become unavailable.
      </div>


    </div>
  )
}
