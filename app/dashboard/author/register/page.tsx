"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import AuthorRegistrationFlow from "@/components/author/author-registration-flow"
import ScreenLoading from "@/components/screenLoading";
import { useAuthStore } from "@/lib/store/auth";

export default function AuthorRegisterPage() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, token, hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
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
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [user, setUser] = useState(null)
  const [pleaseWaitWhileYourTransactionIsProcessing, setPleaseWaitWhileYourTransactionIsProcessing] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const hasVisited = localStorage.getItem("hasVisited")
    const cookieConsent = localStorage.getItem("cookieConsent2s")
    const lastVisit = localStorage.getItem("lastVisit")
    const savedCartItems = localStorage.getItem("cartItems")
    const savedWishlistItems = localStorage.getItem("wishlistItems")

    // 💥 Removed savedUser block completely

    const now = Date.now()
    const lastVisitTime = lastVisit ? parseInt(lastVisit, 10) : null
    const hours24 = 24 * 60 * 60 * 1000

    if (!lastVisitTime || now - lastVisitTime > hours24) {
      setTimeout(() => {
        // openLoginModal() // If needed later
      }, 9000)
    }

    localStorage.setItem("lastVisit", now.toString())

    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems))
      } catch (e) {
        //console.log("Error parsing cart items", e)
      }
    }

    if (savedWishlistItems) {
      try {
        setWishlistItems(JSON.parse(savedWishlistItems))
      } catch (e) {
        //console.log("Error parsing wishlist items", e)
      }
    }

    setCartInitialized(true)
    setWishlistInitialized(true)

    if (
      !hasVisited ||
      (lastVisit && now - Number.parseInt(lastVisit) > 7 * 24 * 60 * 60 * 1000)
    ) {
      if (!cookieConsent || cookieConsent !== "accepted") {
        setTimeout(() => {
          setShowCookieConsent(true)
        }, 120000)
      }
    }

    localStorage.setItem("hasVisited", "true")

    const handleScroll = () => {
      const scrollElements = document.querySelectorAll(".scroll-animation")
      scrollElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate-in")
        }
      })
    }

    const handleClickOutside = (event: any) => {
      if (moreMenuOpen && !event.target.closest(".more-menu-container")) {
        setMoreMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      if (sliderInterval.current) {
        clearInterval(sliderInterval.current)
      }
    }
  }, [])

  useEffect(() => {
    //console.log(user, 'user on the become author')
  }, [])


  useEffect(() => {
    // console.log(user, 'user on the become author')
    // Wait for hydration and user load
    const timer = setTimeout(() => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      if (!loggedIn || !user) {
        router.push("/?unauthorized")
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [user, router])


  if (!hasHydrated) {
    return (
      <ScreenLoading />
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorRegistrationFlow user={user} />
    </div>
  )
}
