"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Heart, ShoppingCart, Check, Monitor, Grid, List, SlidersHorizontal, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Loading from "@/app/loading";
import CartConsent from "@/components/cart-consent";
import CartPage from "@/components/cart-page";
import {baseUrl} from "@/lib/utils";
import PreviewModal from "@/components/preview-modal";


export default function ViewAllPage() {
  const params = useParams()
  const category = params.category

  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("list") // grid or list
  // const [priceRange, setPriceRange] = useState([0, 200])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showCartPage, setShowCartPage] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)
  const [pleaseWaitWhileYourTransactionIsProcessing, setPleaseWaitWhileYourTransactionIsProcessing] = useState(false)
  const categories = ["WordPress", "eCommerce", "Site Templates", "Marketing", "CMS", "Blogging"];
  useEffect(() => {
    const mockCategories = ["WordPress", "eCommerce", "Site Templates", "Marketing", "CMS", "Blogging"];

    const fetchThemes = () => {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      setPleaseWaitWhileYourTransactionIsProcessing(true)

      fetch(`${baseUrl}/themes/fetch2`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result?.data, 'theme result');
            const data = result?.data || [];
            setPleaseWaitWhileYourTransactionIsProcessing(false)
            setItems(data);           // Populate with fetched items
            setFilteredItems(data);   // Initially show all
            setIsLoaded(true);
          })
          .catch(error => {
            setPleaseWaitWhileYourTransactionIsProcessing(false)
            console.log('Fetch error', error);
            setIsLoaded(true); // Prevent loading state hanging
          });
    };

    const savedCartItems = localStorage.getItem("cartItems");
    const savedWishlistItems = localStorage.getItem("wishlistItems");

    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems));
      } catch (e) {
        console.error("Error parsing cart items", e);
      }
    }

    if (savedWishlistItems) {
      try {
        setWishlistItems(JSON.parse(savedWishlistItems));
      } catch (e) {
        console.error("Error parsing wishlist items", e);
      }
    }

    fetchThemes();
  }, []);


  useEffect(() => {
    let result = [...items]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
          (item) =>
              item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply price range filter
    result = result.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1])

    // Apply rating filter
    if (selectedRating > 0) {
      result = result.filter((item) => item.rating >= selectedRating)
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter((item) => selectedCategories.includes(item.isCategory))
    }

    // Apply category-specific filters based on URL parameter
    const categoryTitle = getCategoryTitle()?.toLowerCase()

    if (typeof category === "string" && category.trim() !== "" && categoryTitle) {
      if (category === "featured") {
        result = result.filter((item) => item.featured)
      } else if (category === "bestsellers") {
        result = result.filter((item) => item.bestseller)
      } else if (category === "new") {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        result = result.filter((item) => new Date(item.date) > thirtyDaysAgo)
      } else if (category !== "items" && category !== "categories") {
        result = result.filter(
            (item) =>
                typeof item.isCategory === "string" &&
                (
                    item.isCategory.toLowerCase() === categoryTitle ||
                    item.isCategory.toLowerCase().includes(categoryTitle)
                )
        )
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "bestselling":
        result.sort((a, b) => b.sales - a.sales)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "featured":
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
    }

    setFilteredItems(result)
  }, [items, searchQuery, sortBy, priceRange, selectedRating, selectedCategories, category])

  const closePreview = () => {
    setShowPreview(false)
    document.body.style.overflow = "auto"
  }

  const openPreview = (item) => {
    setPreviewItem(item)
    setShowPreview(true)
    document.body.style.overflow = "hidden"
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }
  const getCategoryTitle = () => {
    if (!category) return "All Items"

    console.log(category, 'getCategoryTitle')

    switch (category) {
      case "wordpress":
        return "WordPress Themes"
      case "ecommerce":
        return "eCommerce Templates"
      case "site-templates":
        return "Site Templates"
      case "marketing":
        return "Marketing Templates"
      case "cms":
        return "CMS Templates"
      case "blogging":
        return "Blogging Templates"
      case "featured":
        return "Featured Themes"
      case "new":
        return "New Items"
      case "bestsellers":
        return "Best Sellers"
      case "categories":
        return "All Categories"
      case "items":
      default:
        return "All Items"
    }
  }

  const handleCategoryToggle = (category) => {
    console.log(category, 'handleCategoryToggle')
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 200])
    setSelectedRating(0)
    setSelectedCategories([])
    setSortBy("featured")
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
    } else {
      // New item, add with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }])
    }

    localStorage.setItem("cartItems", JSON.stringify([...cartItems, { ...item, quantity: 1 }]))
  }

  const isItemInCart = (itemId) => {
    return cartItems.some((item) => item.id === itemId)
  }

  const toggleWishlist = (item) => {
    const existingItemIndex = wishlistItems.findIndex((wishlistItem) => wishlistItem.id === item.id)

    if (existingItemIndex >= 0) {
      // Item exists, remove it
      const updatedWishlistItems = wishlistItems.filter((wishlistItem) => wishlistItem.id !== item.id)
      setWishlistItems(updatedWishlistItems)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlistItems))
    } else {
      // New item, add it
      const updatedWishlistItems = [...wishlistItems, item]
      setWishlistItems(updatedWishlistItems)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlistItems))
    }
  }

  const isItemInWishlist = (itemId) => {
    return wishlistItems.some((item) => item.id === itemId)
  }

  const viewCart = () => {
    // Open the cart page/modal
    setShowCartPage(true)
    document.body.style.overflow = "hidden"
  }
  const closeCartPage = () => {
    setShowCartPage(false)
    document.body.style.overflow = "auto"
  }

  // if(!isLoaded){
  //   return <Loading/>
  // }
  // ${isLoaded ? "opacity-100" : "opacity-0"}
  return (
    <div
      className={`min-h-screen bg-gray-50 transition-opacity duration-500`}
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
                {category !== "items" && category !== "categories" && (
                  <>
                    <Link href="/view-all/items" className="hover:text-[#82b440]">
                      All Items
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                  </>
                )}
                <span className="font-medium text-gray-900">{getCategoryTitle()}</span>
              </div>
              <h1 className="text-2xl font-bold">{getCategoryTitle()}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search in this category..."
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#82b440] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
              </div>

              <div className="md:hidden">
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Narrow down your search with these filters</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      {/* Mobile filters - same as desktop but in a sheet */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Price Range</h3>
                          <div className="px-2">
                            <Slider
                              // defaultValue={[0, 200]}
                              max={200}
                              step={1}
                              value={priceRange}
                              onValueChange={setPriceRange}
                              className="my-4"
                            />
                            <div className="flex items-center justify-between text-sm">
                              <span>${priceRange[0]}</span>
                              <span>${priceRange[1]}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Rating</h3>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center">
                                <Checkbox
                                  id={`rating-${rating}-mobile`}
                                  checked={selectedRating === rating}
                                  onCheckedChange={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                                />
                                <label htmlFor={`rating-${rating}-mobile`} className="ml-2 text-sm flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                      }`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1">& Up</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Categories</h3>
                          <div className="space-y-2">
                            {["WordPress", "eCommerce", "Site Templates", "Marketing", "CMS", "Blogging"].map((cat) => (
                              <div key={cat} className="flex items-center">
                                <Checkbox
                                  id={`category-${cat.toLowerCase()}-mobile`}
                                  checked={selectedCategories.includes(cat)}
                                  onCheckedChange={() => handleCategoryToggle(cat)}
                                />
                                <label htmlFor={`category-${cat.toLowerCase()}-mobile`} className="ml-2 text-sm">
                                  {cat}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            resetFilters()
                            setIsMobileFilterOpen(false)
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters - desktop only */}
          <div className="hidden md:block w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4">Filters</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 200]}
                      max={200}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-4"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRating === rating}
                          onCheckedChange={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                        />
                        <label htmlFor={`rating-${rating}`} className="ml-2 text-sm flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                          <span className="ml-1">& Up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center">
                        <Checkbox
                          id={`category-${cat.toLowerCase()}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => handleCategoryToggle(cat)}
                        />
                        <label htmlFor={`category-${cat.toLowerCase()}`} className="ml-2 text-sm">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Sort and filter bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="bestselling">Best Selling</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredItems.length}</span> of{" "}
                  <span className="font-medium">{items.length}</span> items
                </div>
              </div>
            </div>

            {pleaseWaitWhileYourTransactionIsProcessing
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-64 rounded-lg dark:bg-gray-800 animate-pulse"
                    >
                      <div className="space-y-2 p-4 border rounded-md bg-white dark:bg-muted animate-pulse">
                        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md" />
                        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
                      </div>

                    </div>
                ))
                :
                <>
                  {/* Items grid/list */}
                  {filteredItems.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="mb-4">
                          <Search className="h-12 w-12 mx-auto text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No items found</h3>
                        <p className="text-gray-500 mb-4">
                          We couldn't find any items matching your criteria. Try adjusting your filters.
                        </p>
                        <Button className="bg-green-600" onClick={resetFilters}>Reset Filters</Button>
                      </div>
                  ) : viewMode === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <ThemeCard
                                key={item.id}
                                openPreview={openPreview}
                                item={item}
                                addToCart={addToCart}
                                isInCart={isItemInCart(item.id)}
                                toggleWishlist={toggleWishlist}
                                isInWishlist={isItemInWishlist}
                            />
                        ))}
                      </div>
                  ) : (
                      <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <ThemeListItem
                                key={item.id}
                                openPreview={openPreview}
                                item={item}
                                addToCart={addToCart}
                                isInCart={isItemInCart(item.id)}
                                toggleWishlist={toggleWishlist}
                                isInWishlist={isItemInWishlist}
                            />
                        ))}
                      </div>
                  )}
                </>
            }


          </div>

          {showCartPage && <CartPage cartItems={cartItems} setCartItems={setCartItems} onClose={closeCartPage} />}

          {
              cartItems.length > 0 && !showCartPage &&
              <CartConsent
                  onCheckout={() => {
                    viewCart()
                  }}
                  onViewCart={() => viewCart()}
                  itemCount={cartItems.length}
                  subtotal={cartItems.reduce((sum, item) => sum + item.price, 0)}
              />
          }


          {/* Preview Modal */}
          {showPreview && (
              <PreviewModal

                  onClose={closePreview}
                  addToCart={addToCart}
                  isInCart={previewItem && isItemInCart(previewItem.id)}
                  item={previewItem}
                  cartCount={getCartCount()}
              />
          )}

        </div>
      </div>
    </div>
  )
}



function ThemeCard({ item, addToCart, isInCart, toggleWishlist, isInWishlist, openPreview }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden h-full product-card">
      <div className="relative overflow-hidden group">
        <Link href="#">
          <Image
            src={item.image || "/placeholder.svg"}
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
            toggleWishlist(item)
          }}
          aria-label={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${isInWishlist(item.id) ? "text-red-500 fill-red-500" : "text-white"} bg-black bg-opacity-30 p-1 rounded-full cursor-pointer hover:text-red-500`}
          />
        </button>
        {item.featured && <Badge className="absolute top-2 left-2 bg-green-600 text-white">Featured</Badge>}
        {item.bestseller && !item.featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Bestseller</Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1">
          <Link href="#" className="hover:text-[#82b440] transition-colors">
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
                  className={`h-3 w-3 ${i < item.rating ? "fill-current" : "text-gray-300"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({item.reviews})</span>
          </div>
          <span className="font-bold text-sm">${item.price}</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openPreview(item)} variant="outline" size="sm" className="text-xs flex-1 flex items-center justify-center">
            <Monitor className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className={`text-xs flex-1 flex items-center justify-center ${
              isInCart ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-green-600 hover:bg-[#7aa93c] text-white"
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

function ThemeListItem({ item, addToCart, isInCart, toggleWishlist, isInWishlist, openPreview }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden product-card">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 relative">
          <Link href="#">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              width={200}
              height={150}
              className="w-full h-40 sm:h-full object-cover"
            />
          </Link>
          <button
            className="absolute top-2 right-2 z-10"
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(item)
            }}
            aria-label={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-6 w-6 ${isInWishlist(item.id) ? "text-red-500 fill-red-500" : "text-white"} bg-black bg-opacity-30 p-1 rounded-full cursor-pointer hover:text-red-500`}
            />
          </button>
          {item.featured && <Badge className="absolute top-2 left-2 bg-green-600 text-white">Featured</Badge>}
          {item.bestseller && !item.featured && (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Bestseller</Badge>
          )}
        </div>

        <div className="p-4 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="font-medium text-base mb-1">
                <Link href="#" className="hover:text-[#82b440] transition-colors">
                  {item.title}
                </Link>
              </h3>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>by {item.author}</span>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3 w-3 ${i < item.rating ? "fill-current" : "text-gray-300"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({item.reviews})</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <p>Category: {item.isCategory ? item.isCategory : 'Unknown'}</p>
                <p>Sales: {item.sales}+</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="font-bold text-lg">${item.price}</span>
              <div className="flex gap-2">
                <Button onClick={() => openPreview(item)} variant="outline" size="sm" className="text-xs flex items-center justify-center">
                  <Monitor className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className={`text-xs flex items-center justify-center ${
                    isInCart
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-green-600 hover:bg-[#7aa93c] text-white"
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
        </div>
      </div>
    </div>
  )
}
