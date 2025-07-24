"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart, Heart, Monitor, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {useActiveCurrency} from "@/lib/currencyTag";
import {defaultCurrency} from "@/lib/utils";

interface WishlistPageProps {
  wishlistItems: any[]
  setWishlistItems: (items: any[]) => void
  addToCart: (item: any) => void
  isItemInCart: (itemId: number) => boolean
  onClose?: () => void
}

export default function WishlistPage({
  wishlistItems,
  setWishlistItems,
  addToCart,
  isItemInCart,
  onClose,
}: WishlistPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "themes" | "plugins">("all")
  const filteredItems = wishlistItems.filter((item) => {
    if (activeFilter !== "all" && item.type !== activeFilter) {
      return false
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId))
  }

  const clearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      setWishlistItems([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#333333] text-white py-3 px-4">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-bold text-lg">
              Themely
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-white hover:text-gray-300 hidden md:flex items-center text-sm">
              Dashboard
            </Link>
            <Link href="#" className="text-white hover:text-gray-300 relative">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            {onClose && (
              <button onClick={onClose} className="text-white hover:text-gray-300">
                <X size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved to your wishlist
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {wishlistItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-500 hover:text-red-700"
                  onClick={clearWishlist}
                >
                  Clear Wishlist
                </Button>
              )}
              <Button asChild className="bg-[#82b440] hover:bg-[#7aa93c] text-white text-xs">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {wishlistItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex bg-gray-100 rounded-md p-0.5">
                <button
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeFilter === "all" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeFilter === "themes" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveFilter("themes")}
                >
                  Themes
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeFilter === "plugins" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveFilter("plugins")}
                >
                  Plugins
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden product-card">
                <div className="relative overflow-hidden">
                  <Link href="#">
                    <Image
                      src={item.image || "/placeholder.svg?height=200&width=300"}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 bg-black bg-opacity-30 text-white p-1 rounded-full hover:bg-opacity-50"
                    aria-label="Remove from wishlist"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    <Link href="#" className="hover:text-[#82b440] transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>by {item.author || "ThemelyAuthor"}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 capitalize">
                      {item.type || "theme"}
                    </Badge>
                    <span className="font-bold text-sm">${item.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs flex-1 flex items-center justify-center">
                      <Monitor className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className={`text-xs flex-1 flex items-center justify-center ${
                        isItemInCart(item.id)
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-[#82b440] hover:bg-[#7aa93c] text-white"
                      }`}
                      onClick={() => !isItemInCart(item.id) && addToCart(item)}
                      disabled={isItemInCart(item.id)}
                    >
                      {isItemInCart(item.id) ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you like to your wishlist and they'll appear here.</p>
            <Button asChild className="bg-[#82b440] hover:bg-[#7aa93c] text-white">
              <Link href="/">Browse Marketplace</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
