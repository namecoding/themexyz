"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Star,
  Heart,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Check,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CookieConsent from "@/components/cookie-consent"
import PreviewModal from "@/components/preview-modal"
import CartModal from "@/components/cart-modal"
import CartPage from "@/components/cart-page"
import SignupModal from "@/components/signup-modal"
import TestDemoScreen from "@/components/test-demo-screen"
import { LoginModal2 } from "@/components/login-modal2";
import CartConsent from "@/components/cart-consent";
import { baseUrl, defaultCurrency, metaData, serverBase } from "@/lib/utils";
import SiteHeader from "@/components/header";
import SiteFooter from "@/components/footer";
import IsThemely from "@/components/isThemely";
import toast from 'react-hot-toast';
import { SkeletonEffect } from "@/components/ui/skeleton-effect";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/lib/store/auth';
import { useActiveCurrency } from "@/lib/currencyTag";
import { signIn, signOut, useSession } from "next-auth/react";
import GoogleLoginProcessing from "@/components/GoogleLoginProcessing";

export default function Home() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, token } = useAuthStore()
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(true)
  const [isFetchingGoogleData, setIsFetchingGoogleData] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)
  const [showCartModal, setShowCartModal] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [cartInitialized, setCartInitialized] = useState(false)
  const [wishlistInitialized, setWishlistInitialized] = useState(false)
  const sliderRef = useRef(null)
  const sliderInterval = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [showCartPage, setShowCartPage] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showTestDemo, setShowTestDemo] = useState(false)
  const [pleaseWaitWhileYourTransactionIsProcessing, setPleaseWaitWhileYourTransactionIsProcessing] = useState(false)
  const { currency, symbol } = useActiveCurrency(defaultCurrency)
  const [isPurchaseFeedbackOpen, setIsPurchaseFeedbackOpen] = useState(false)
  const [isProductFeedbackOpen, setIsProductFeedbackOpen] = useState(false)

  const [heroSlides, setHeroSlides] = useState([
    {
      title: "Professional WordPress Themes & Website Templates for any project",
      description: "Thousands of high-quality, website templates, created by top authors from around the world.",
      image: "/images/ward-of-year.png?height=300&width=500",
    },
    {
      title: "Premium eCommerce Templates for Your Online Store",
      description: "Build a professional online store with our responsive and feature-rich eCommerce templates.",
      image: "/images/banner2.png?height=300&width=500",
    },
    {
      title: "Stunning Blog Themes to Share Your Story",
      description: "Express yourself with beautiful, responsive blog themes designed for content creators.",
      image: "/images/about-themeleaf3.png?height=300&width=500",
    },
  ])

  useEffect(() => {
    if (isLoggedIn && user) {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      const token2 = localStorage.getItem("token")
      console.log({ isLoggedIn, user, token, token2, loggedIn }, 'from zurad')

      setIsLoaded(false);
    }
  }, [isLoggedIn, user, token])

  useEffect(() => {
    if (session?.user?.email && !isLoggedIn) {
      (async () => {
        try {
          setIsLoaded(true);
          setIsFetchingGoogleData(true);

          const res = await fetch(`${serverBase}/api/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email, name: session.user.name }),
          });

          const data = await res.json();

          setIsFetchingGoogleData(false);

          if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", "true");
            setUser(data.user);
            setIsLoggedIn(true);
            useAuthStore.getState().setHasHydrated(true)
            useAuthStore.getState().setIsLoggedIn(true);
            useAuthStore.getState().setToken(data.token);
            useAuthStore.getState().setUser(data.user);

          } else {
            toast.error("Login failed: " + data.message);
            console.log("Login failed:", data.message);
          }
        } catch (error) {
          //setIsLoaded(false);
          setIsFetchingGoogleData(false);
          console.log("Google login error:", error);
        }
      })();
    }
  }, [session, isLoggedIn]);

  useEffect(() => {
    setIsLoaded(true);

    const hasVisited = localStorage.getItem("hasVisited");
    const cookieConsent = localStorage.getItem("cookieConsent2s");
    const lastVisit = localStorage.getItem("lastVisit");
    const savedCartItems = localStorage.getItem("cartItems");
    const savedWishlistItems = localStorage.getItem("wishlistItems");

    const now = Date.now();
    const lastVisitTime = lastVisit ? parseInt(lastVisit, 10) : null;
    const hours24 = 24 * 60 * 60 * 1000;

    if (!user && (!lastVisitTime || (now - lastVisitTime > hours24))) {
      setTimeout(() => openLoginModal(), 9000);
    }

    localStorage.setItem("lastVisit", now.toString());

    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems));
      } catch (e) {
        console.log("Error parsing cart items", e);
      }
    }

    if (savedWishlistItems) {
      try {
        setWishlistItems(JSON.parse(savedWishlistItems));
      } catch (e) {
        console.log("Error parsing wishlist items", e);
      }
    }

    setCartInitialized(true);
    setWishlistInitialized(true);

    if (!hasVisited || (lastVisit && now - Number.parseInt(lastVisit) > 7 * 24 * 60 * 60 * 1000)) {
      if (!cookieConsent || cookieConsent !== "accepted") {
        setTimeout(() => {
          setShowCookieConsent(true);
        }, 120000);
      }
    }

    localStorage.setItem("hasVisited", "true");

    startSliderInterval();

    const handleScroll = () => {
      const scrollElements = document.querySelectorAll(".scroll-animation");
      scrollElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate-in");
        }
      });
    };

    const handleClickOutside = (event) => {
      if (moreMenuOpen && !event.target.closest(".more-menu-container")) {
        setMoreMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (sliderInterval.current) {
        clearInterval(sliderInterval.current);
      }
    };
  }, [moreMenuOpen, user]);

  useEffect(() => {
    if (cartInitialized) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, cartInitialized]);

  useEffect(() => {
    if (wishlistInitialized) {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, wishlistInitialized]);

  const startSliderInterval = () => {
    if (sliderInterval.current) {
      clearInterval(sliderInterval.current)
    }

    sliderInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
  }

  const handleSlideChange = (index) => {
    setCurrentSlide(index)
    // Reset interval when manually changing slides
    startSliderInterval()
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    startSliderInterval()
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    startSliderInterval()
  }

  const handleCookieAccept = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setShowCookieConsent(false)
  }

  const handleCookieDecline = () => {
    localStorage.setItem("cookieConsent", "declined")
    setShowCookieConsent(false)
  }

  const openPreview = (item) => {
    setPreviewItem(item)
    setShowPreview(true)
    document.body.style.overflow = "hidden"
  }

  const closePreview = () => {
    setShowPreview(false)
    document.body.style.overflow = "auto"
  }

  const openTestDemo = (item) => {
    setPreviewItem(item)
    setShowTestDemo(true)
    document.body.style.overflow = "hidden"
  }

  const closeTestDemo = () => {
    setShowTestDemo(false)
    document.body.style.overflow = "auto"
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

    setShowCartModal(true)
  }

  const closeCartModal = () => {
    setShowCartModal(false)
  }

  const isItemInCart = (itemId) => {
    return cartItems.some((item) => item.id === itemId)
  }

  const getCartCount = () => {
    // return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    return cartItems.length
  }

  const toggleWishlist = (item) => {
    const existingItemIndex = wishlistItems.findIndex((wishlistItem) => wishlistItem.id === item.id)

    if (existingItemIndex >= 0) {
      // Item exists, remove it
      const updatedWishlistItems = wishlistItems.filter((wishlistItem) => wishlistItem.id !== item.id)
      setWishlistItems(updatedWishlistItems)
    } else {
      // New item, add it
      setWishlistItems([...wishlistItems, item])
    }
  }

  const isItemInWishlist = (itemId) => {
    return wishlistItems.some((item) => item.id === itemId)
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const openLoginModal = () => {
    setShowLoginModal(true)
    setShowSignupModal(false)
    document.body.style.overflow = "hidden"
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
    document.body.style.overflow = "auto"
  }

  const openSignupModal = () => {
    setShowSignupModal(true)
    setShowLoginModal(false)
    document.body.style.overflow = "hidden"
  }

  const closeSignupModal = () => {
    setShowSignupModal(false)
    document.body.style.overflow = "auto"
  }

  const handleLogin = async (email, password) => {
    const toastId = toast.loading('Uploading...');
    try {

      setPleaseWaitWhileYourTransactionIsProcessing(true)
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {

        console.log("Login failed:", data.error || data.message)
        // Optionally show error to user
        toast.error(data.message, { id: toastId });

        setPleaseWaitWhileYourTransactionIsProcessing(false)
        return
      }

      //console.log(data,'log')


      if (!data.success) {
        setPleaseWaitWhileYourTransactionIsProcessing(false)
        toast.error(data.message, { id: toastId });
        return
      }

      setPleaseWaitWhileYourTransactionIsProcessing(false)

      // avatar: "/placeholder.svg?height=40&width=40",
      //console.log(data,'gdada')

      toast.success('Login successful!', { id: toastId });

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("isLoggedIn", "true");
      useAuthStore.getState().setHasHydrated(true)
      useAuthStore.getState().setIsLoggedIn(true);
      useAuthStore.getState().setToken(data.token);
      useAuthStore.getState().setUser(data.user);

      // ✅ Update user state
      // setUser({
      //   ...data.user,
      //   avatar: data.user.avatar || "/placeholder.svg?height=40&width=40", // fallback avatar
      // })

      setIsLoggedIn(true)
      closeLoginModal()
    } catch (error) {
      setPleaseWaitWhileYourTransactionIsProcessing(false)
      console.log("Login request error:", error)
      toast.error('Login request error', { id: toastId });
    }
  }

  const handleSignup = async (name, email, password) => {
    const toastId = toast.loading('Uploading...');
    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        //alert("Signup failed: "+ data.error || data.message)
        toast.error(data.message, { id: toastId });
        return
      }

      if (!data.success) {
        toast.error(data.message, { id: toastId });
        return
      }

      //console.log(data,'data')

      toast.success(data.message, { id: toastId });

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("isLoggedIn", "true");
      useAuthStore.getState().setHasHydrated(true)
      useAuthStore.getState().setIsLoggedIn(true);
      useAuthStore.getState().setToken(data.token);
      useAuthStore.getState().setUser(data.user);

      // setUser({
      //   ...data.user,
      //   avatar: data.user.avatar || "/placeholder.svg?height=40&width=40", // fallback avatar
      // })

      setIsLoggedIn(true)
      closeSignupModal()
    } catch (error) {
      toast.error('Signup request error, if this continue, please contact us', { id: toastId });
      //console.log("Signup request error:", error)
    }
  }


  const handleLogout = () => {
    //setUser(null)
    setIsLoggedIn(false)

    useAuthStore.getState().setIsLoggedIn(false);
    //useAuthStore.getState().setUser(null);
    //useAuthStore.getState().setToken(null);


    //localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdminModalOpen")
    localStorage.removeItem("confirmedAdminType")
    signOut({
      callbackUrl: '/', // or your desired post-logout page
      redirect: true,
    });

  }


  const [featuredTheme, setFeaturedTheme] = useState([])

  const [bestSelling, setBestSelling] = useState([])

  const [newestThemes, setNewestThemes] = useState([])

  const fetchThemes = () => {
    let requestOptions = {
      method: 'GET',
      headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer token' if needed
  },
      mode: 'cors', // VERY IMPORTANT
  credentials: 'include', // Only if you need cookies/sessions
    };
    setPleaseWaitWhileYourTransactionIsProcessing(true)

    fetch(`${baseUrl}/themes/fetch`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result?.data, 'theme result')
        setFeaturedTheme(result?.data?.featured || [])
        setBestSelling(result?.data?.bestSelling || [])
        setNewestThemes(result?.data?.newest || [])

        setPleaseWaitWhileYourTransactionIsProcessing(false)
      })
      .catch(error => {
        setPleaseWaitWhileYourTransactionIsProcessing(false)
        console.log('error', error)
      });
  }

  useEffect(() => {
    fetchThemes()
  }, [])

  if (!isLoaded) {
    return <IsThemely />
  }


  return (
    <div
      className={`flex min-h-screen flex-col ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      <SiteHeader
        isLoggedIn={isLoggedIn}
        user={user}
        cartItems={cartItems}
        wishlistItems={wishlistItems}
        getCartCount={getCartCount}
        getWishlistCount={getWishlistCount}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        handleLogout={handleLogout}
        viewCart={viewCart}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        moreMenuOpen={moreMenuOpen}
        setMoreMenuOpen={setMoreMenuOpen}
      />


      <main>
        {/* Hero section with slider - full width */}
        <section className="bg-white relative">
          <div className="relative overflow-hidden" ref={sliderRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="py-12 px-4">
                    <div className="container mx-auto max-w-5xl">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2">
                          <h1 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h1>
                          <p className="text-gray-600 mb-4 text-sm">{slide.description}</p>
                          <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white">
                            <Link href="/view-all/categories">Browse Items</Link>
                          </Button>
                        </div>
                        <div className="md:w-1/2">
                          <Image
                            src={slide.image || "/placeholder.svg"}
                            alt="Theme showcase"
                            width={500}
                            height={300}
                            className="rounded-md shadow-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider controls */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-r-md hover:bg-opacity-50 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-l-md hover:bg-opacity-50 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slider indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? "bg-green-500 w-4" : "bg-gray-300"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category grid */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CategoryCard
                title="WordPress Themes"
                count="Thousands of Premium Themes"
                image="/wordpress-theme.png?height=150&width=300"
              />
              <CategoryCard
                title="eCommerce Templates"
                count="Beautiful, responsive templates"
                image="/ecommerce-templates.png?height=150&width=300"
              />
              <CategoryCard
                title="Site Templates"
                count="HTML and website templates"
                image="/HTML-and-website-templates.png?height=150&width=300"
              />
              <CategoryCard
                title="Marketing Templates"
                count="Email and marketing assets"
                image="/marketing-templates.png?height=150&width=300"
              />
              <CategoryCard
                title="CMS Templates"
                count="Templates for popular CMS"
                image="/CMS-templates.png?height=150&width=300"
              />
              <CategoryCard
                title="Blogging"
                count="Templates for bloggers"
                image="/bloggers.png?height=150&width=300"
              />
            </div>
            <div className="text-center mt-8">
              <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white">
                <Link href="/view-all/categories">View All Categories</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Unique themes section */}
        <section className="py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-2">
                  Unique themes and templates for every budget and every project
                </h2>
                <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white mt-4">
                  <Link href="/view-all/items">View All Items</Link>
                </Button>
              </div>
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-md shadow-sm">
                    <Image
                      src="/theme_budget2.jpg?height=150&width=300"
                      alt="Theme preview"
                      width={300}
                      height={150}
                      className="w-full h-auto object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="overflow-hidden rounded-md shadow-sm">
                    <Image
                      src="/theme_budget.jpg?height=150&width=300"
                      alt="Theme preview"
                      width={300}
                      height={150}
                      className="w-full h-auto object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 px-4 bg-gray-50 dark:bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-xl font-bold mb-6">Featured themes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pleaseWaitWhileYourTransactionIsProcessing
                ? Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonEffect key={index} index={index} />
                ))
                : featuredTheme.map((item, index) => (
                  <div key={index} className="scroll-animation opacity-0 translate-y-4">
                    <ThemeCard
                      id={item.id}
                      openPreview={openPreview}
                      openTestDemo={openTestDemo}
                      addToCart={addToCart}
                      isInCart={isItemInCart(item.id)}
                      toggleWishlist={toggleWishlist}
                      isInWishlist={isItemInWishlist}
                      featuredTheme={item}
                      currency={currency}
                      symbol={symbol}
                    />
                  </div>
                ))}
            </div>

            {!pleaseWaitWhileYourTransactionIsProcessing && (
              <div className="text-center mt-8">
                <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white">
                  <Link href="/view-all/featured">View All Featured</Link>
                </Button>
              </div>
            )}
          </div>
        </section>


        {/* Themely promo */}
        <section className="py-10 px-4 bg-green-50">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-4">
                  <Badge className="bg-green-500 text-white mr-2">{metaData.name}</Badge>
                </div>
                <h2 className="text-xl font-bold mb-2">The only subscription you need</h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Access thousands of creative assets with a single subscription. Download themes, plugins, and more.
                </p>
                <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white text-xs">
                  <Link href="#">Learn More About {metaData.name}</Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/images/about-themeleaf2.png?height=200&width=400"
                  alt="Themely subscription"
                  width={400}
                  height={200}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recent themes */}
        <section className="py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-xl font-bold mb-2">Check out our newest themes and templates</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Our authors are adding new items every day. Here are some of their latest creations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {pleaseWaitWhileYourTransactionIsProcessing
                ? Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonEffect key={index} index={index} />
                ))
                : newestThemes.map((item, index) => (
                  <div key={index} className="scroll-animation opacity-0 translate-y-4">
                    <NewestThemeCard
                      id={item.id}
                      openPreview={openPreview}
                      openTestDemo={openTestDemo}
                      addToCart={addToCart}
                      isInCart={isItemInCart(item.id)}
                      toggleWishlist={toggleWishlist}
                      isInWishlist={isItemInWishlist}
                      newestThemes={item}
                      currency={currency}
                      symbol={symbol}
                    />
                  </div>
                ))}
            </div>

            {!pleaseWaitWhileYourTransactionIsProcessing && (
              <div className="text-center mt-8">
                <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white">
                  <Link href="/view-all/new">View All New Items</Link>
                </Button>
              </div>
            )}
          </div>
        </section>


        {/* Best selling section */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-xl font-bold mb-6">Browse this week's best selling WordPress themes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {pleaseWaitWhileYourTransactionIsProcessing
                ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-64 rounded-lg dark:bg-gray-800 animate-pulse">
                    <div className="space-y-2 p-4 border rounded-md bg-white dark:bg-muted animate-pulse">
                      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md" />
                      <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))
                : bestSelling.map((item, index) => (
                  <div key={index} className="scroll-animation opacity-0 translate-y-4">
                    <BestSellingCard
                      id={item.id}
                      openPreview={openPreview}
                      openTestDemo={openTestDemo}
                      addToCart={addToCart}
                      isInCart={isItemInCart(item.id)}
                      toggleWishlist={toggleWishlist}
                      isInWishlist={isItemInWishlist}
                      bestSelling={item}
                      currency={currency}
                      symbol={symbol}
                    />
                  </div>
                ))}
            </div>

            {!pleaseWaitWhileYourTransactionIsProcessing && (
              <div className="text-center mt-8">
                <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white">
                  <Link href="/view-all/bestsellers">View All Best Sellers</Link>
                </Button>
              </div>
            )}
          </div>
        </section>


        {/* Unlimited downloads */}
        <section className="py-10 px-4 bg-green-50">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-4">
                  <Badge className="bg-green-500 text-white mr-2">{metaData.name}</Badge>
                </div>
                <h2 className="text-xl font-bold mb-2">Want to earn by selling your themes?</h2>
                <ul className="text-gray-600 mb-4 text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-[#82b440] rounded-full mr-2"></div>
                    <span>Join a growing community of creatives</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-[#82b440] rounded-full mr-2"></div>
                    <span>Earn passive income from your work</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-[#82b440] rounded-full mr-2"></div>
                    <span>Full control over your products</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-[#82b440] rounded-full mr-2"></div>
                    <span>Full control over your products</span>
                  </li>

                </ul>
                <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white text-xs">
                  <Link href="./become-author">Become an Author on {metaData.name}</Link>
                </Button>
                <p className="text-foreground text-sm mt-4">No setup fees • No monthly charges • Start earning immediately</p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/images/unlimited.png?height=200&width=400"
                  alt="Become an author"
                  width={400}
                  height={200}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white dark:bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Top Trusted Partners & Services</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We proudly collaborate with these businesses and use their services.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-center">
              {/* Example logos */}
              <div className="flex justify-center items-center">
                <img src="https://zikaexpresslogistics.com/images/paystack.png" alt="Paystack" className="h-10 grayscale hover:grayscale-0 transition" />
              </div>
              <div className="flex justify-center items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png" alt="AWS" className="h-10 grayscale hover:grayscale-0 transition" />
              </div>
              <div className="flex justify-center items-center">
                <img src="https://www.c-sharpcorner.com/article/create-github-repository-and-add-newexisting-project-using-github-desktop/Images/github.png" alt="GitHub" className="h-10 grayscale hover:grayscale-0 transition" />
              </div>
              <div className="flex justify-center items-center">
                <img src="https://ml.globenewswire.com/Resource/Download/3a54c241-a668-4c94-9747-3d3da9da3bf2" alt="Vercel" className="h-10 grayscale hover:grayscale-0 transition" />
              </div>
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <SiteFooter />


      {isFetchingGoogleData && <GoogleLoginProcessing />}

      {/* Cookie Consent */}
      {showCookieConsent && <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />}

      {
        !showCookieConsent && cartItems.length > 0 &&
        <CartConsent
          onCheckout={() => {
            viewCart()
          }}
          onViewCart={() => viewCart()}
          itemCount={cartItems.length}
          subtotal={cartItems.reduce((sum, item) => {
            const price = currency === 'NGN' ? item.priceNGN : item.priceUSD;
            return sum + (price || 0);
          }, 0)}

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

      {/* Test Demo Screen */}
      {showTestDemo && (
        <TestDemoScreen
          onClose={closeTestDemo}
          addToCart={addToCart}
          isInCart={previewItem && isItemInCart(previewItem.id)}
          item={previewItem}
        />
      )}

      {/* Cart Modal */}
      {showCartModal && <CartModal onClose={closeCartModal} item={cartItems[cartItems.length - 1]} onViewChat={() => {
        closeCartModal()
        viewCart()
      }} />}

      {/* Cart Page */}
      {showCartPage && <CartPage cartItems={cartItems} setCartItems={setCartItems} onClose={closeCartPage} userData={user} />}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal2 onClose={closeLoginModal} onLogin={handleLogin} onSwitchToSignup={openSignupModal} pleaseWaitWhileYourTransactionIsProcessing={pleaseWaitWhileYourTransactionIsProcessing} />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal onClose={closeSignupModal} onSignup={handleSignup} onSwitchToLogin={openLoginModal} />
      )}

      {/*<FeedbackModal*/}
      {/*    isOpen={isPurchaseFeedbackOpen}*/}
      {/*    onClose={() => setIsPurchaseFeedbackOpen(false)}*/}
      {/*    type="purchase"*/}
      {/*    data={sampleFeedbackData}*/}
      {/*    onSubmit={handleFeedbackSubmit}*/}
      {/*/>*/}
      {/*<FeedbackModal*/}
      {/*    isOpen={isProductFeedbackOpen}*/}
      {/*    onClose={() => setIsProductFeedbackOpen(false)}*/}
      {/*    type="product"*/}
      {/*    data={sampleFeedbackData}*/}
      {/*    onSubmit={handleFeedbackSubmit}*/}
      {/*/>*/}


      <style jsx global>{`
        .scroll-animation {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}

function CategoryCard({ title, count, image }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden product-card">
      <div className="relative overflow-hidden">
        <Link href={`/view-all/${title.toLowerCase().replace(/\s+/g, "-")}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={300}
            height={150}
            className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
          />
        </Link>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">
          <Link
            href={`/view-all/${title.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:text-[#82b440] transition-colors"
          >
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm">{count}</p>
      </div>
    </div>
  )
}

function ThemeCard({ id, openPreview, openTestDemo, addToCart, isInCart, toggleWishlist, isInWishlist, featuredTheme, currency, symbol }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden h-full product-card">
      <div className="relative overflow-hidden group">
        <Link href={`product/${featuredTheme?.slug}`}>
          <Image
            src={featuredTheme?.galleryImages[0] || "/placeholder.svg"}
            alt="Theme preview"
            width={300}
            height={200}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <button
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(featuredTheme)
          }}
          aria-label={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-6 w-6 ${isInWishlist(id) ? "text-red-500 fill-red-500" : "text-white"} bg-black bg-opacity-30 p-1 rounded-full cursor-pointer hover:text-red-500`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1">
          <Link href="#" className="hover:text-[#82b440] transition-colors capitalize">
            {featuredTheme.title}
          </Link>
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>by {featuredTheme.author}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-xs text-gray-500 ml-1">({featuredTheme.reviews})</span>
          </div>
          <span className="font-bold text-sm">{symbol}{currency === 'NGN' ? featuredTheme.priceNGN.toLocaleString() : featuredTheme.priceUSD.toLocaleString()}</span>
          {/*<PriceTag priceNGN={featuredTheme.priceNGN} priceUSD={featuredTheme.priceUSD} className="font-bold text-xs"/>*/}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1 flex items-center justify-center"
            onClick={() => openPreview(featuredTheme)}
          >
            <Monitor className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className={`text-xs flex-1 flex items-center justify-center ${isInCart ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-green-500 hover:bg-[#7aa93c] text-white"
              }`}
            onClick={() => !isInCart && addToCart(featuredTheme)}
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

function NewestThemeCard({ id, openPreview, openTestDemo, addToCart, isInCart, toggleWishlist, isInWishlist, newestThemes, currency, symbol }) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden h-full product-card">
      <div className="relative overflow-hidden group">
        <Link href={`product/${newestThemes?.slug}`}>
          <Image
            src={newestThemes?.galleryImages[0] || "/placeholder.svg"}
            alt="Theme preview"
            width={200}
            height={150}
            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <button
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(newestThemes)
          }}
          aria-label={isInWishlist(newestThemes.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-6 w-6 ${isInWishlist(newestThemes.id) ? "text-red-500 fill-red-500" : "text-white"} bg-black bg-opacity-30 p-0.5 rounded-full cursor-pointer hover:text-red-500`}
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-xs mb-1 truncate">
          <Link href="#" className="hover:text-[#82b440] transition-colors capitalize">
            {newestThemes.title}
          </Link>
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>by {newestThemes.author}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>
          {/*<span className="font-bold text-xs">${newestThemes.price}</span>*/}
          <span className="font-bold text-sm">{symbol}{currency === 'NGN' ? newestThemes.priceNGN.toLocaleString() : newestThemes.priceUSD.toLocaleString()}</span>
          {/*<PriceTag priceNGN={newestThemes.priceNGN} priceUSD={newestThemes.priceUSD} className="font-bold text-xs"/>*/}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 flex-1 flex items-center justify-center"
            onClick={() => openPreview(newestThemes)}
          >
            <Monitor className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className={`text-xs h-7 px-2 flex-1 flex items-center justify-center ${isInCart ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-green-500 hover:bg-[#7aa93c] text-white"
              }`}
            onClick={() => !isInCart && addToCart(newestThemes)}
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

function BestSellingCard({ id, openPreview, openTestDemo, addToCart, isInCart, toggleWishlist, isInWishlist, bestSelling, currency, symbol }) {
  //console.log(bestSelling, 'bestSelling')
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden h-full product-card">
      <div className="relative overflow-hidden group">
        <Link href={`product/${bestSelling?.slug}`}>
          <Image
            src={bestSelling?.galleryImages[0] || "/placeholder.svg"}
            alt="Theme preview"
            width={200}
            height={150}
            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <button
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(bestSelling)
          }}
          aria-label={isInWishlist(bestSelling.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-6 w-6 ${isInWishlist(bestSelling.id) ? "text-red-500 fill-red-500" : "text-white"} bg-black bg-opacity-30 p-0.5 rounded-full cursor-pointer hover:text-red-500`}
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-xs mb-1 truncate">
          <Link href="#" className="hover:text-[#82b440] transition-colors capitalize">
            {bestSelling.title}
          </Link>
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>by {bestSelling.author}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>
          {/*<span className="font-bold text-xs">${bestSelling.priceNGN}</span>*/}
          <span className="font-bold text-sm">{symbol}{currency === 'NGN' ? bestSelling.priceNGN.toLocaleString() : bestSelling.priceUSD.toLocaleString()}</span>
          {/*<PriceTag priceNGN={bestSelling.priceNGN} priceUSD={bestSelling.priceUSD} className="font-bold text-xs"/>*/}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 flex-1 flex items-center justify-center"
            onClick={() => openPreview(bestSelling)}
          >
            <Monitor className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className={`text-xs h-7 px-2 flex-1 flex items-center justify-center ${isInCart ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-green-500 hover:bg-[#7aa93c] text-white"
              }`}
            onClick={() => !isInCart && addToCart(bestSelling)}
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
