"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SiteHeader from "@/components/header"
import SiteFooter from "@/components/footer"
import {
  DollarSign,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Headphones,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
} from "lucide-react"
import CookieConsent from "@/components/cookie-consent";
import { LoginModal2 } from "@/components/login-modal2";
import SignupModal from "@/components/signup-modal";
import toast from "react-hot-toast";
import { baseUrl, metaData } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import { signIn, signOut, useSession } from "next-auth/react";

export default function BecomeAuthorLanding() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, token, hasHydrated } = useAuthStore()
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
  const [pleaseWaitWhileYourTransactionIsProcessing, setPleaseWaitWhileYourTransactionIsProcessing] = useState(false)

  const sliderContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideDuration = 5000; // 5 seconds total slide time
  const progressInterval = 100; // update every 100ms



  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Up to 70% Commission",
      description: "Keep the majority of your earnings with our industry-leading commission rates.",
      color: "text-green-600",
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Reach millions of customers worldwide and expand your business internationally.",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your products and earnings are protected with enterprise-grade security.",
      color: "text-purple-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated author support team.",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Marketing Support",
      description: "We promote your products through our marketing channels and featured sections.",
      color: "text-red-600",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a thriving community of creators and learn from successful authors.",
      color: "text-indigo-600",
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Sign Up & Complete Profile",
      description: "Create your author account and tell us about your expertise and specialties.",
      icon: Users,
    },
    {
      step: 2,
      title: "Upload Your Products",
      description: "Add your themes, templates, or digital products with detailed descriptions and previews.",
      icon: Upload,
    },
    {
      step: 3,
      title: "Get Approved",
      description: "Our team reviews your products to ensure they meet our quality standards.",
      icon: CheckCircle,
    },
    {
      step: 4,
      title: "Start Earning",
      description: "Your products go live and you start earning money from every sale automatically.",
      icon: DollarSign,
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "WordPress Theme Developer",
      avatar: "/placeholder.svg?height=60&width=60",
      quote: "{metaData.name} has transformed my freelance business. I've earned over $50,000 in my first year!",
      earnings: "$50,000+",
      products: 12,
    },
    {
      name: "Mike Chen",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=60&width=60",
      quote: "The platform is incredibly user-friendly and the support team is amazing. Highly recommended!",
      earnings: "$35,000+",
      products: 8,
    },
    {
      name: "Elena Rodriguez",
      role: "Full-Stack Developer",
      avatar: "/placeholder.svg?height=60&width=60",
      quote: "I love the global reach. My templates are being used by customers from over 40 countries!",
      earnings: "$75,000+",
      products: 25,
    },
  ]

  const stats = [
    { number: "50,000+", label: "Active Authors" },
    { number: "$2M+", label: "Paid to Authors" },
    { number: "150+", label: "Countries Reached" },
    { number: "1M+", label: "Products Sold" },
  ]

  const productTypes = [
    {
      title: "WordPress Themes",
      description: "Professional WordPress themes for businesses, blogs, and portfolios",
      icon: Globe,
      examples: ["Business Themes", "Blog Themes", "eCommerce Themes", "Portfolio Themes"],
    },
    {
      title: "HTML Templates",
      description: "Responsive HTML/CSS templates for modern websites",
      icon: Code,
      examples: ["Landing Pages", "Admin Dashboards", "Corporate Sites", "Creative Portfolios"],
    },
    {
      title: "UI Components",
      description: "Reusable UI components and design systems",
      icon: Zap,
      examples: ["React Components", "Vue Components", "CSS Frameworks", "Icon Sets"],
    },
    {
      title: "Graphics & Assets",
      description: "Visual assets and design resources",
      icon: Heart,
      examples: ["Logo Templates", "Icon Packs", "Illustrations", "Stock Photos"],
    },
  ]

  const faqs = [
    {
      question: "What types of products can I sell?",
      answer:
        "You can sell a wide range of digital products, including WordPress themes and plugins, HTML/CSS templates, React, Vue, and Next.js components or full projects, mobile app templates (iOS, Android, Flutter, React Native), backend scripts (Node.js, PHP, Python, Laravel, etc.), APIs, SaaS starters, UI kits, admin dashboards, desktop software, scripts and utilities, as well as digital design assets like graphics, icons, illustrations, fonts, and animations. All products must be your original work or properly licensed for resale.",
    },
    {
      question: "How do I submit a product?",
      answer:
        "To submit a product, go to your dashboard and click 'Submit New Product'. Fill in the required details such as title, description, pricing, category, and upload your files. Make sure your product includes a demo (if applicable), documentation, and follows our quality guidelines. Once submitted, our team will review and approve it within 2-5 business days.",
    },
    {
      question: "How is pricing determined?",
      answer:
        "You set the base price for your product. However, we may suggest adjustments based on quality, market trends, and demand. Additional fees may apply for extended support. It's recommended to research similar products to remain competitive.",
    },
    {
      question: "Can I offer discounts or run promotions?",
      answer:
        "Yes, you can offer promotional pricing or participate in site-wide sales and events. You’ll find these options in your dashboard under 'Promotions'. Discounting is a powerful way to increase visibility and drive more sales.",
    },
    {
      question: "How long does the approval process take?",
      answer:
        "The review process typically takes 2-5 business days. We review each product for quality, originality, and compliance with our guidelines. You'll receive detailed feedback if any changes are needed.",
    },
    {
      question: "Can I update my product after publishing?",
      answer:
        "Yes, you can update your product at any time. Simply go to your dashboard, select the product, and click 'Edit'. You can update the files, description, pricing, and support terms. Updates may go through a short review process to ensure quality is maintained.",
    },
    {
      question: "What happens if my product is rejected?",
      answer:
        "If your product doesn't meet our standards, you'll receive detailed feedback explaining the reason for rejection. You can make the necessary improvements and resubmit the product for review. Repeated violations may lead to account warnings.",
    },
    {
      question: "Can I remove a product after it has been published?",
      answer:
        "Yes, you can unpublish or permanently delete a product from your dashboard. Note that unpublishing a product removes it from the marketplace but keeps your existing customer access intact. Permanent deletion is irreversible.",
    },
    {
      question: "How much can I earn as an author?",
      answer:
        "Authors earn 80% from every product sale, and keep 95% of what they earn by offering support services. Top authors make over $10,000 per month, while many new authors earn between $500–$2,000 in their first few months. Your earnings depend on the quality and popularity of your products.",
    },
    {
      question: "When and how do I get paid?",
      answer:
        "Payouts are processed monthly via Paystack, direct bank transfer, or other supported methods. The minimum payout threshold is $100 for USD and ₦50,000 for NGN. However, subscribing to a membership plan can lower your threshold limit, allowing you to access your earnings faster. You'll also receive detailed earnings reports and can track your performance in real time from your dashboard.",
    },
    {
      question: "In what currency do I earn?",
      answer:
        "You can earn in both USD and NGN, depending on the buyer's location and selected currency at checkout. If a buyer makes a purchase using USD, your earnings will reflect in your USD wallet. If the buyer pays in NGN, it goes into your NGN wallet. This dual-currency system helps maximize your sales potential by catering to both local and international buyers. You can view your earnings separately and request withdrawals based on your wallet balances.",
    },
    {
      question: "Do I need to provide customer support?",
      answer:
        "Yes, all authors must provide customer support to help buyers set up and use their products more easily and quickly. Authors are required to define their support timeframe and may charge an additional fee for extended support if desired. Failing to provide the promised support within the stated timeframe may result in the author losing part or all of the support-related earnings. High-quality support builds trust and increases your chances of more sales.",
    },
    {
      question: "Can I sell my products on other platforms too?",
      answer:
        `Yes, you retain full ownership of your products and are free to sell them on other platforms. By default, we operate under non-exclusive rights, allowing you to list your items elsewhere, not only on ${metaData.name}`,
    },
    {
      question: "What happens if someone resells or copies my product illegally?",
      answer:
        "We take copyright violations seriously. If you suspect someone is illegally distributing your product, report it to our support team immediately. We’ll investigate and take appropriate action, including issuing takedown notices or banning offending accounts.",
    }
  ];

  const heroSlides = [
    {
      title: "Turn Your Creative Skills Into a Profitable Business",
      subtitle: `Join ${metaData.name} and start earning money by selling your digital products to millions of customers worldwide. No upfront costs, no monthly fees.`,
      backgroundImage: "./images/creative.png",
    },
    {
      title: "Start Selling Globally Today",
      subtitle: "Reach buyers from over 150+ countries and watch your income grow exponentially.",
      backgroundImage: "images/globally.png",  // Replace with second image
    },
    {
      title: "Join 50,000+ Authors Already Earning",
      subtitle: "No technical barriers. Easy onboarding. Full support.",
      backgroundImage: "./developers-banners.png",  // Replace with third image
    }
  ];

  useEffect(() => {
    console.log({ isLoggedIn, setIsLoggedIn, user, setUser, token, hasHydrated }, 'zurd 2')
  }, [hasHydrated, user, isLoggedIn])

  useEffect(() => {
    let progressTimer = null;
    let sliderTimer = null;

    if (!isHovered) {
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const next = prev + (progressInterval / slideDuration) * 100;
          return next >= 100 ? 100 : next;
        });
      }, progressInterval);

      sliderTimer = setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
        setProgress(0);
      }, slideDuration);
    }

    return () => {
      clearInterval(progressTimer);
      clearTimeout(sliderTimer);
    };
  }, [currentSlide, isHovered]);


  // useEffect(() => {
  //   setIsLoaded(true)
  //
  //   const hasVisited = localStorage.getItem("hasVisited")
  //   const cookieConsent = localStorage.getItem("cookieConsent2s")
  //   const lastVisit = localStorage.getItem("lastVisit")
  //   const savedCartItems = localStorage.getItem("cartItems")
  //   const savedWishlistItems = localStorage.getItem("wishlistItems")
  //   const savedUser = localStorage.getItem("user")
  //
  //   if (savedUser) {
  //     try {
  //       const parsedUser = JSON.parse(savedUser)
  //       setUser(parsedUser)
  //       setIsLoggedIn(true)
  //     } catch (e) {
  //       console.log("Error parsing user data", e)
  //     }
  //   } else {
  //     const now = Date.now()
  //     const lastVisitTime = lastVisit ? parseInt(lastVisit, 10) : null
  //     const hours24 = 24 * 60 * 60 * 1000
  //
  //     if (!lastVisitTime || (now - lastVisitTime > hours24)) {
  //       //console.log("Calling openLoginModal() — first visit in 24h")
  //       setTimeout(() => {
  //         openLoginModal()
  //       }, 9000) // 6 seconds
  //     }
  //
  //     // Always update lastVisit after check
  //     localStorage.setItem("lastVisit", now.toString())
  //   }
  //
  //   if (savedCartItems) {
  //     try {
  //       setCartItems(JSON.parse(savedCartItems))
  //     } catch (e) {
  //       console.log("Error parsing cart items", e)
  //     }
  //   }
  //
  //   if (savedWishlistItems) {
  //     try {
  //       setWishlistItems(JSON.parse(savedWishlistItems))
  //     } catch (e) {
  //       console.log("Error parsing wishlist items", e)
  //     }
  //   }
  //
  //   setCartInitialized(true)
  //   setWishlistInitialized(true)
  //
  //   const now = new Date().getTime()
  //
  //   if (!hasVisited || (lastVisit && now - Number.parseInt(lastVisit) > 7 * 24 * 60 * 60 * 1000)) {
  //     if (!cookieConsent || cookieConsent !== "accepted") {
  //       setTimeout(() => {
  //         setShowCookieConsent(true)
  //       }, 120000)
  //     }
  //   }
  //
  //   localStorage.setItem("hasVisited", "true")
  //
  //  // startSliderInterval()
  //
  //   const handleScroll = () => {
  //     const scrollElements = document.querySelectorAll(".scroll-animation")
  //     scrollElements.forEach((element) => {
  //       const elementPosition = element.getBoundingClientRect().top
  //       const windowHeight = window.innerHeight
  //       if (elementPosition < windowHeight - 100) {
  //         element.classList.add("animate-in")
  //       }
  //     })
  //   }
  //
  //   const handleClickOutside = (event) => {
  //     if (moreMenuOpen && !event.target.closest(".more-menu-container")) {
  //       setMoreMenuOpen(false)
  //     }
  //   }
  //
  //   window.addEventListener("scroll", handleScroll)
  //   document.addEventListener("mousedown", handleClickOutside)
  //   handleScroll()
  //
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //     document.removeEventListener("mousedown", handleClickOutside)
  //     if (sliderInterval.current) {
  //       clearInterval(sliderInterval.current)
  //     }
  //   }
  // }, [moreMenuOpen, isLoggedIn])

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
        console.log("Error parsing cart items", e)
      }
    }

    if (savedWishlistItems) {
      try {
        setWishlistItems(JSON.parse(savedWishlistItems))
      } catch (e) {
        console.log("Error parsing wishlist items", e)
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
  }, [moreMenuOpen, isLoggedIn])

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

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
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


  const closeSignupModal = () => {
    setShowSignupModal(false)
    document.body.style.overflow = "auto"
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
    signOut({
      callbackUrl: '/', // or your desired post-logout page
      redirect: true,
    });

  }

  const openSignupModal = () => {
    setShowSignupModal(true)
    setShowLoginModal(false)
    document.body.style.overflow = "hidden"
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

      // ✅ Update user state
      setUser({
        ...data.user,
        avatar: data.user.avatar || "/placeholder.svg?height=40&width=40", // fallback avatar
      })

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

      setUser({
        ...data.user,
        avatar: data.user.avatar || "/placeholder.svg?height=40&width=40", // fallback avatar
      })

      setIsLoggedIn(true)
      closeSignupModal()
    } catch (error) {
      toast.error('Signup request error, if this continue, please contact us', { id: toastId });
      //console.log("Signup request error:", error)
    }
  }


  const href = isLoggedIn ? '/dashboard/author/register' : '#';
  const handleClick = () => {
    if (!isLoggedIn) openLoginModal();
  };

  return (
    <div className="min-h-screen bg-white">

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

      {/* Hero Section */}
      <section
        ref={sliderContainerRef}
        className="relative bg-gradient-to-br from-green-50 to-green-100 py-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={slide.backgroundImage}
              alt={slide.title}
              layout="fill"
              objectFit="cover"
              className="z-0"
            // objectPosition="center top"
            // objectPosition="center 20%"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
          </div>
        ))}

        <div className="relative z-20 container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-white">
              <Badge className="bg-green-500 text-white mb-4">Join 50,000+ Authors</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl mb-8">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-green-500 hover:bg-green-700 text-white">
                  <Link href={href} onClick={handleClick}>
                    Start Earning Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-green-600">
                  <Link href="#how-it-works">Learn How It Works</Link>
                </Button>
              </div>
              <p className="text-white text-sm mt-4">No setup fees • No monthly charges • Start earning immediately</p>
            </div>
          </div>
        </div>


        <div className="absolute bottom-4 right-4 z-30">
          {isHovered ? (
            <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 9H8v6h2V9zm6 0h-2v6h2V9z" />
              </svg>
            </div>
          ) : (
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" stroke="#ddd" strokeWidth="3" fill="none" />
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="#16a34a"
                strokeWidth="3"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
          )}
        </div>

      </section>



      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose {metaData.name}?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed as a digital product creator
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Icon className={`h-12 w-12 ${benefit.color} mb-4`} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is simple. Follow these four easy steps to begin your journey as a {metaData.name} author.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Can You Sell?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {metaData.name} supports a wide variety of digital products. Here are some popular categories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {productTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-green-600" />
                      <span>{type.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our successful authors who are earning thousands of dollars every month
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-semibold">Earned: {testimonial.earnings}</span>
                    <span className="text-gray-600">{testimonial.products} Products</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Potential Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Your Earning Potential is Unlimited</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Passive Income</h3>
                    <p className="text-gray-600">
                      Create once, earn forever. Your products continue generating income while you sleep.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Scalable Business</h3>
                    <p className="text-gray-600">
                      Add more products to increase your earnings. No limits on how much you can make.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Global Market</h3>
                    <p className="text-gray-600">Sell to customers worldwide, 24/7. Your market never sleeps.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Average Monthly Earnings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Authors (1-3 months)</span>
                    <span className="font-semibold text-green-600">$500 - $2,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Established Authors (6+ months)</span>
                    <span className="font-semibold text-green-600">$2,000 - $8,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Top Authors (1+ years)</span>
                    <span className="font-semibold text-green-600">$10,000+</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Pro Tip:</strong> Authors who upload 10+ high-quality products typically earn 3x more than
                    those with fewer products.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Get answers to the most common questions about becoming a {metaData.name} author
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black to-green-300">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Start Your Author Journey?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful authors who are already earning money on {metaData.name}. It's free to get started
            and takes less than 10 minutes to set up your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/dashboard/author/register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-foreground hover:bg-white hover:text-green-600">
              <Link href="#contact">Contact Sales</Link>
            </Button>
          </div>
          <p className="text-green-100 text-sm mt-4">No setup fees • No monthly charges • Start earning immediately</p>
        </div>
      </section>

      <SiteFooter />


      {showCookieConsent && <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal2 onClose={closeLoginModal} onLogin={handleLogin} onSwitchToSignup={openSignupModal} pleaseWaitWhileYourTransactionIsProcessing={pleaseWaitWhileYourTransactionIsProcessing} />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal onClose={closeSignupModal} onSignup={handleSignup} onSwitchToLogin={openLoginModal} />
      )}

    </div>
  )
}

function Upload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

function Code({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  )
}
