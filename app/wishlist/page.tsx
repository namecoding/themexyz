"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronRight, Heart, ShoppingCart, Check, Monitor, Trash2, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import IsThemely from "@/components/isThemely";
import Loading from "@/app/wishlist/loading";
import {useActiveCurrency} from "@/lib/currencyTag";
import {defaultCurrency} from "@/lib/utils";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const {currency, symbol} = useActiveCurrency(defaultCurrency)
  useEffect(() => {
    const savedWishlistItems = localStorage.getItem("wishlistItems")
    const savedCartItems = localStorage.getItem("cartItems")

    if (savedWishlistItems) {
      try {
        const parsedItems = JSON.parse(savedWishlistItems)
        setWishlistItems(parsedItems)
        setFilteredItems(parsedItems)
      } catch (e) {
        console.error("Error parsing wishlist items", e)
      }
    }

    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems))
      } catch (e) {
        console.error("Error parsing cart items", e)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = wishlistItems.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(wishlistItems)
    }
  }, [searchQuery, wishlistItems])

  const removeFromWishlist = (itemId) => {
    const updatedItems = wishlistItems.filter((item) => item.id !== itemId)
    setWishlistItems(updatedItems)
    localStorage.setItem("wishlistItems", JSON.stringify(updatedItems))
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.setItem("wishlistItems", JSON.stringify([]))
  }

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id)

    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: (updatedCartItems[existingItemIndex].quantity || 1) + 1,
      }
      setCartItems(updatedCartItems)
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems))
    } else {
      // New item, add with quantity 1
      const updatedCartItems = [...cartItems, { ...item, quantity: 1 }]
      setCartItems(updatedCartItems)
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems))
    }
  }

  const isItemInCart = (itemId) => {
    return cartItems.some((item) => item.id === itemId)
  }

  const addAllToCart = () => {
    const newCartItems = [...cartItems]

    wishlistItems.forEach((item) => {
      if (!isItemInCart(item.id)) {
        newCartItems.push({ ...item, quantity: 1 })
      }
    })

    setCartItems(newCartItems)
    localStorage.setItem("cartItems", JSON.stringify(newCartItems))
  }

  if(!isLoaded){
    return <Loading/>
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      {/* Header with breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link href="/" className="hover:text-[#82b440]">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-gray-900">My Wishlist</span>
              </div>
              <h1 className="text-2xl font-bold">My Wishlist</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search in wishlist..."
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#82b440] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <Heart className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-4">
              Browse our marketplace and add items to your wishlist to save them for later.
            </p>
            <Button asChild className="bg-green-500">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{filteredItems.length}</span> items in your wishlist
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={addAllToCart} className="text-xs">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add All to Cart
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear Wishlist
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear your wishlist?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all items from your wishlist. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearWishlist} className="bg-red-500 hover:bg-red-600">
                          Clear Wishlist
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  removeFromWishlist={removeFromWishlist}
                  addToCart={addToCart}
                  isInCart={isItemInCart(item.id)}
                  currency={currency}
                  symbol={symbol}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function WishlistCard({ item, removeFromWishlist, addToCart, isInCart,currency, symbol }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden h-full product-card">
      <div className="relative overflow-hidden group">
        <Link href="#">
          <Image
            src={item?.galleryImages[0] || "/placeholder.svg"}
            alt={item.title}
            width={300}
            height={200}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <button
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.preventDefault()
            removeFromWishlist(item.id)
          }}
          aria-label="Remove from wishlist"
        >
          <X className="h-5 w-5 text-white bg-black bg-opacity-50 p-1 rounded-full cursor-pointer hover:bg-red-500" />
        </button>
        {item.featured && <Badge className="absolute top-2 left-2 bg-green-500 text-white">Featured</Badge>}
        {item.bestseller && !item.featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Bestseller</Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1">
          <Link href="#" className="hover:text-[#82b440] transition-colors capitalize">
            {item.title}
          </Link>
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>by {item.author}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${i < (item.marketData?.rating || 0) ? "fill-current" : "text-gray-300"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({item.marketData?.reviews || 0})</span>
          </div>
          <span className="font-bold text-sm">{symbol}{currency === 'NGN' ? item.priceNGN.toLocaleString() : item.priceUSD.toLocaleString() }</span>
        </div>
        <div className="flex gap-2">
          {/*<Button variant="outline" size="sm" className="text-xs flex-1 flex items-center justify-center">*/}
          {/*  <Monitor className="h-3 w-3 mr-1" />*/}
          {/*  Preview*/}
          {/*</Button>*/}
          <Button
            size="sm"
            className={`text-xs flex-1 flex items-center justify-center ${
              isInCart ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-green-500 hover:bg-[#7aa93c] text-white"
            }`}
            onClick={() => !isInCart && addToCart(item)}
            disabled={isInCart}
          >
            {isInCart ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 mr-1" />
                Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
