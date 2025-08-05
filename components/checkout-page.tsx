"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, ChevronLeft, CreditCard, Check, AlertCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  SERVER_PUBLIC,
  countriesWithStates,
  defaultCurrency,
  loginHandler,
  metaData,
  shortenText,
  usePaystack
} from "@/lib/utils";
import toast from 'react-hot-toast';
import { useAuthStore } from "@/lib/store/auth";
import { useActiveCurrency } from "@/lib/currencyTag";
import TermsOfPurchaseModal from "@/components/TermsOfPurchaseModal";
import ScreenLoading from "@/components/screenLoading";
import { PaymentProcessing } from "@/components/PaymentProcessing";
import FeedbackModal from "@/components/feedback-modal";
import { usePathname, useRouter } from "next/navigation";
import OPayButton from "@/components/OPayButton";

interface CheckoutPageProps {
  onBack: () => void
  onClose: () => void
  cartItems: any[]
  subtotal: number
  supportExtensionTotal: number
  total: number
  userData: any
}

type Wallet = {
  NGN?: {
    balance: number;
  };
  USD?: {
    balance: number;
  };
};

type User = {
  name?: string;
  phone?: string;
  country?: string;
  company?: string;
  address?: string;
  state?: string;
  userData: any
  wallet?: Wallet;
  // Add any other user fields you expect (e.g., email, avatar, id)
};

export default function CheckoutPage({
  onBack,
  onClose,
  cartItems,
  subtotal,
  supportExtensionTotal,
  total, userData
}: CheckoutPageProps) {
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();
  const { currency, symbol } = useActiveCurrency(defaultCurrency)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [hasBillingDetails, setHasBillingDetails] = useState(false)
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    company: "",
    address: "",
    state: "",
    country: "",
    phone: "",
  })

  useEffect(() => {
    console.log(userData, 'checkout user data')
  }, [])

  const pathname = usePathname()
  const [isPurchaseFeedbackOpen, setIsPurchaseFeedbackOpen] = useState(false)

  const [sampleFeedbackData, setSampleFeedbackData] = useState({
    productTitle: "",
    productImage: "",
    orderId: '',
    total: null,
    currency: ''
  })
  const handleFeedbackSubmit = (feedback: any) => {
    console.log("Feedback submitted:", feedback)
    // Handle feedback submission here
  }

  const [isPaymentProcessing, setIsPaymentProcessing] = useState({
    reference: '',
    status: '',
    pleaseWait: false
  })
  const [pleaseWaitWhileYourTransactionIsProcessing, setPleaseWaitWhileYourTransactionIsProcessing] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [screenLoading, setScreenLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [signInStage, setSignInStage] = useState('login')
  const [showTerms, setShowTerms] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const router = useRouter();
  const selectedCountry = countriesWithStates.find(
    (item) => item.country === billingDetails.country
  );

  useEffect(() => {
    if (!document.querySelector("script[src='https://js.paystack.co/v1/inline.js']")) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);


  const paymentOptions = [
    {
      key: "paystack",
      label: "Paystack",
      note: "Payment is secured with Paystack",
      available: true,
      comingSoon: false,
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsWKza4IaoogsTAPXl8mjQ1JPg0ii8Jmp_6Q&s?height=24&width=60",
      onClick: () => handlePaymentMethodSelect("paystack"),
    },
    {
      key: "flutterwave",
      label: "Flutterwave",
      note: "Payment is secured with Flutterwave",
      available: false,
      comingSoon: true,
      logo: "https://cdn.prod.website-files.com/6640cd28f51f13175e577c05/664e0089db946469af04fca4_79d28911-5c01-5982-ae24-b90a2ba6d6b9.svg?height=24&width=60",
      onClick: () => { }, // No click yet
    },
    {
      key: "wallet",
      label: "Pay from Wallet",
      note: `Balance ${symbol}${currency === 'NGN' ? user?.wallet?.NGN?.balance : user?.wallet?.USD?.balance}`,
      available: true,
      // available: (currency === "NGN"
      //     ? user?.wallet?.NGN?.balance ?? 0
      //     : user?.wallet?.USD?.balance ?? 0) >= total,
      comingSoon: true,
      logo: "https://cdn-icons-png.flaticon.com/512/5167/5167008.png",
      onClick: () => {
        const balance = currency === "NGN" ? user?.wallet?.NGN?.balance : user?.wallet?.USD?.balance;
        if (balance >= total) {
          handlePaymentMethodSelect("wallet");
        } else {
          toast.error("Insufficient wallet balance");
        }
      },
    },
  ];



  useEffect(() => {
  setScreenLoading(true);
  const timer = setTimeout(() => setScreenLoading(false), 1000); // Faster test
  return () => clearTimeout(timer);
}, [pathname, userData, cartItems]);




  useEffect(() => {
    if (userData) {
    
      setBillingDetails((prev) => ({
        ...prev,
        name: userData.name || "",
        phone: userData.phone || "",
        country: userData.country || "",
        address: userData.address || "",
        state: userData.state || "",
        company: userData.company || "",
      }));

      if (userData?.phone && userData?.country && userData?.address && userData?.company) {
        setHasBillingDetails(true);
        setShowBillingForm(false);
        console.log('phone good')

      } else {
        console.log('phone not good')
      }

    }

  }, [userData])

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        console.log(data)

        if (data?.country_name) {
          setBillingDetails((prev) => ({
            ...prev,
            country: data.country_name,
          }));
          console.log(data.country_name)
        }
      } catch (error) {
        console.error("Failed to fetch user country:", error);
      }
    };

    if (typeof window !== "undefined") {
      // fetchCountry();

      if (currency === 'NGN') {
        setBillingDetails((prev) => ({
          ...prev,
          country: 'Nigeria',
        }));
      }

    }


  }, [currency]);

  const closeLoginModal = () => {
    setShowLoginModal(false)
    document.body.style.overflow = "auto"
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await loginHandler({
      email,
      password,
      setUser,
      setIsLoggedIn,
      closeLoginModal,
      setPleaseWaitWhileYourTransactionIsProcessing,
    });
  }

  const handleGoogleLogin = () => {
    // In a real app, you would implement Google OAuth here
    //setIsLoggedIn(true)
    toast.success('Google Login')
  }

  const handleGuest = () => {

    //toast.success('Continue as Guest')
  }

  const switchStage = (to: string) => {
    setSignInStage(to)
  }

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method)
  }

  const handlePayment = async () => {
    const toastId = toast.loading("Processing payment...");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated.", { id: toastId });
      return;
    }

    // ✅ Only allow supported methods
    const supportedMethods = ["paystack", "wallet"];
    if (!supportedMethods.includes(paymentMethod)) {
      toast.error("Selected payment method is not yet supported.", { id: toastId });
      return;
    }


    const description = `Purchased ${cartItems.length} software item${cartItems.length > 1 ? 's' : ''}`;

    const paymentData = {
      hasBillingDetails,
      paymentMethod,
      billingDetails,
      description,
      currency,
      cartItems,
      subtotal,
      total,
      email: userData?.email,
      supportExtensionTotal,
    };

    setProcessingPayment(true);

    try {
      const res = await fetch(`${SERVER_PUBLIC}/auth/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const result = await res.text();
      const data = JSON.parse(result);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to process payment");
      }


      // ✅ Handle payment method
      switch (paymentMethod) {
        case "paystack":
          const response = await usePaystack({
            email: userData?.email,
            amount: total * 100,
            reference: data.reference,
            toastId,
            currency,
            onSuccess: (res) => {
              console.log("🧾 User paid successfully!", res);
              // Optionally process here
              //res.reference
            },
            onClose: async () => {
              setProcessingPayment(false);
              console.log("Payment modal closed");

              // ✅ Call backend to update payment status to Cancelled
              try {

                setIsPaymentProcessing({
                  reference: data.reference,
                  status: 'processing',
                  pleaseWait: true
                })

                const cancelRes = await fetch(`${SERVER_PUBLIC}/auth/payment-cancel`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ reference: data.reference }),
                });

                const cancelData = await cancelRes.json();
                if (!cancelRes.ok || !cancelData.success) {
                  throw new Error(cancelData.message || "Failed to cancel payment");
                }

                toast.success("Payment cancelled.");

                setIsPaymentProcessing(prev => ({
                  ...prev,
                  reference: data.reference,
                  status: 'cancelled',
                }));

              } catch (err) {
                console.error("Failed to cancel payment:", err);
                toast.error("Could not update cancellation status.", { id: toastId });
              }
            }

          });

          try {

            setIsPaymentProcessing({
              reference: data.reference,
              status: 'processing',
              pleaseWait: true
            })


            const verifyRes = await fetch(`${SERVER_PUBLIC}/auth/verify-paystack`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reference: response.reference }),
            });

            const result = await verifyRes.json();
            if (!verifyRes.ok || !result.success) {
              throw new Error(result.message || "Verification failed");
            }

            // ✅ Update UI / unlock features / give the service
            toast.success("Payment verified!", { id: toastId });


            setProcessingPayment(false);

            const titles = cartItems.map(item => item.title)
            const primaryTitle = titles[0]
            const otherCount = titles.length - 1

            const productTitle = otherCount > 0
              ? `${primaryTitle} and ${otherCount} other${otherCount > 1 ? "s" : ""}`
              : primaryTitle

            setSampleFeedbackData({
              productTitle,
              productImage: cartItems[0].galleryImages[0],
              orderId: response.reference,
              total: total,
              currency: currency
            })


            setIsPurchaseFeedbackOpen(true)

            localStorage.removeItem("cartItems")

            setIsPaymentProcessing(prev => ({
              ...prev,
              reference: data.reference,
              status: 'success',
            }));


          } catch (err) {
            toast.error("Failed to verify payment", { id: toastId });
            console.log("Verification error:", err);
            setProcessingPayment(false);
          }

          break;

        case "wallet":
          toast.success("Payment completed using wallet!", { id: toastId });
          setProcessingPayment(false);
          // Optionally refresh balance or redirect user
          break;

        default:
          toast.error("Unexpected payment method error.", { id: toastId });
          setProcessingPayment(false);
      }
    } catch (error: any) {
      console.log("Payment error:", error);
      toast.dismiss(toastId);
      setProcessingPayment(false);
    }
  };


  const handleBillingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ⬅️ Prevent page reload

    try {

      const token = localStorage.getItem("token"); // Adjust key if needed

      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      setPleaseWaitWhileYourTransactionIsProcessing(true)

      const res = await fetch(`${SERVER_PUBLIC}/auth/billing`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billingDetails),
      });

      const text = await res.text();
      let data;

      setPleaseWaitWhileYourTransactionIsProcessing(false)

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Non-JSON response from server:", text);
        toast.error("Unexpected server response.");
        return;
      }

      if (data.success) {
        toast.success("Billing details updated successfully!");
        setHasBillingDetails(true);
        setShowBillingForm(false);


        localStorage.setItem("token", data.token)

        // ✅ Update user state
        setUser({
          ...data.user,
          avatar: data.user.avatar || "/placeholder.svg?height=40&width=40", // fallback avatar
        })

        console.log(data?.user, 'user')
        console.log(data.token, 'token')

      } else {
        setPleaseWaitWhileYourTransactionIsProcessing(false)
        toast.error(data.message || "Failed to update billing details.");

        if (data.message === "No changes were made.") {
          setHasBillingDetails(true);
          setShowBillingForm(false);
        }
      }
    } catch (err) {
      setPleaseWaitWhileYourTransactionIsProcessing(false)
      console.error("Billing update failed:", err);
      toast.error("An error occurred while updating billing details.");
    }
  };

  const handleFormSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation checks
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    const formData = {
      name,
      email,
      password,
      confirmPassword,
      agreeTerms,
    };

    await handleSignup(name, email, password)

    toast.success("All fields are valid! Proceeding...");
    //console.log("handleFormSignUp", formData);

    // 🔽 Proceed with API call or other logic here
  };

  const handleSignup = async (name, email, password) => {
    const toastId = toast.loading('Uploading...');
    try {
      const response = await fetch(`${SERVER_PUBLIC}/auth/signup`, {
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
      //closeSignupModal()
    } catch (error) {
      toast.error('Signup request error, if this continue, please contact us', { id: toastId });
      //console.log("Signup request error:", error)
    }
  }





  if (isPaymentProcessing.pleaseWait) {
    return (
      <PaymentProcessing
        reference={isPaymentProcessing.reference}
        status={isPaymentProcessing.status} // or "success", "cancelled", "failed", "processing"
        onClose={() => {
          setIsPaymentProcessing({
            reference: '',
            status: '',
            pleaseWait: false
          })
        }}
      />
    )
  }



  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-700">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {
          screenLoading ? 
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(1)].map((_, i) => (
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
            {!isLoggedIn ? (
              <div className="bg-white rounded-md shadow-sm mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold">Account</h2>
                </div>

                {signInStage === 'signup' ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Sign up for a free account</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Sign in to speed up the checkout process and manage your orders.
                      </p>

                      <form onSubmit={handleFormSignUp} className="space-y-4 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-3 py-2 border ${passwordError ? "border-red-500" : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]`}
                            required
                          />
                          {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="agree-terms"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="h-4 w-4 text-[#82b440] bg-green-500 focus:ring-[#82b440] border-gray-300 rounded"
                            required
                          />
                          <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{" "}
                            <a href="#" className="text-green-500 hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-green-500 hover:underline">
                              Privacy Policy
                            </a>
                          </label>
                        </div>

                        <Button type="submit" className="w-full bg-green-500 hover:bg-[#7aa93c] text-white">
                          {
                            pleaseWaitWhileYourTransactionIsProcessing ? 'Please wait...' : 'Create Free Account'
                          }

                        </Button>
                      </form>

                      <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-gray-300 absolute w-full"></div>
                        <div className="bg-white px-4 relative text-sm text-gray-500">or</div>
                      </div>


                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full mb-4 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="mr-2"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>

                    <div className="border-gray-200 pt-2">
                      <Button onClick={() => switchStage('signup')} variant="outline" className="w-full">
                        Continue as Guest
                      </Button>
                    </div>
                  </div>
                ) : signInStage === 'guest' ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Continue as a Guest</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Enter your email to continue without creating an account. You'll receive your order confirmation and updates by email.
                      </p>

                      <form onSubmit={handleLogin} className="space-y-4 mb-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-[#82b440] hover:bg-[#7aa93c] text-white">
                          {pleaseWaitWhileYourTransactionIsProcessing ? 'Please wait...' : 'Continue as Guest'}
                        </Button>
                      </form>

                      <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-gray-300 absolute w-full"></div>
                        <div className="bg-white px-4 relative text-sm text-gray-500">or</div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Want to save your orders?{" "}
                          <button onClick={() => switchStage('signup')} className="text-[#82b440] hover:underline font-medium">
                            Create an account
                          </button>
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full mb-4 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="mr-2"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>

                    <div className="border-gray-200 pt-2">
                      <Button onClick={() => switchStage('login')} variant="outline" className="w-full">
                        Back to Login
                      </Button>
                    </div>
                  </div>

                ) : (
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Sign in to your account</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Sign in to speed up the checkout process and manage your orders.
                      </p>

                      <form onSubmit={handleLogin} className="space-y-4 mb-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-green-500 hover:bg-[#7aa93c] text-white">
                          {
                            pleaseWaitWhileYourTransactionIsProcessing ? 'Please wait...' : 'Sign In'
                          }

                        </Button>
                      </form>

                      <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-gray-300 absolute w-full"></div>
                        <div className="bg-white px-4 relative text-sm text-gray-500">or</div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Don't have an account?{" "}
                          <button onClick={() => switchStage('signup')} className="text-green-500 hover:underline font-medium">
                            Sign up
                          </button>
                        </p>
                      </div>



                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full mb-4 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="mr-2"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>

                    <div className="border-gray-200 pt-2">
                      <Button onClick={() => switchStage('guest')} variant="outline" className="w-full">
                        Continue as Guest
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <>
                {/* Billing Details Section */}
                <div className="bg-white rounded-md shadow-sm mb-6">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold">Billing Details</h2>
                    {hasBillingDetails && (
                      <>
                        {
                          showBillingForm ?
                            <Button variant="outline" size="sm" onClick={() => setShowBillingForm(false)} className="text-xs">
                              Cancel
                            </Button>
                            :
                            <Button variant="outline" size="sm" onClick={() => setShowBillingForm(true)} className="text-xs">
                              Edit
                            </Button>
                        }
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    {!hasBillingDetails || showBillingForm ? (
                      <form onSubmit={handleBillingSubmit} className="space-y-4">
                        <div>
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={billingDetails.name}
                              onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                              required
                              //readOnly={true}
                              disabled={true}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company (Optional)
                          </label>
                          <input
                            type="text"
                            id="company"
                            value={billingDetails.company}
                            onChange={(e) => setBillingDetails({ ...billingDetails, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                          </label>
                          <input
                            type="text"
                            id="address"
                            value={billingDetails.address}
                            onChange={(e) => setBillingDetails({ ...billingDetails, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>


                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            id="country"
                            value={billingDetails.country}
                            onChange={(e) =>
                              setBillingDetails({ ...billingDetails, country: e.target.value, state: '' })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          >
                            <option value="">Select Country</option>
                            {countriesWithStates.map((item) => (
                              <option key={item.country} value={item.country}>
                                {item.country}
                              </option>
                            ))}
                          </select>

                          {selectedCountry && (
                            <select
                              id="state"
                              value={billingDetails.state}
                              onChange={(e) => setBillingDetails({ ...billingDetails, state: e.target.value })}
                              className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            >
                              <option value="">Select State/Province</option>
                              {selectedCountry.states.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          )}

                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={billingDetails.phone}
                            onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            required
                          />
                        </div>
                        <Button disabled={pleaseWaitWhileYourTransactionIsProcessing} type="submit" className="w-full bg-green-500 hover:bg-[#7aa93c] text-white">
                          {
                            pleaseWaitWhileYourTransactionIsProcessing ? 'Please wait...' : <>{hasBillingDetails ? "Update Billing Details" : "Save Billing Details"}</>
                          }

                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Name:</span> {billingDetails.name}
                        </p>
                        {billingDetails.company && (
                          <p className="text-sm">
                            <span className="font-medium">Company:</span> {billingDetails.company}
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="font-medium">Address:</span> {billingDetails.address}
                        </p>

                        <p className="text-sm">
                          <span className="font-medium">Country:</span> {billingDetails.country}
                        </p>
                        {
                          billingDetails.state && <p className="text-sm">
                            <span className="font-medium">City/State:</span>
                            {billingDetails.state}
                          </p>
                        }
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {billingDetails.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}

                {
                  !showBillingForm &&
                  <div className="bg-white rounded-md shadow-sm mb-6">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="font-semibold">Payment Method</h2>
                      <div className="text-xs text-gray-500 text-left mb-2">
                        Your local currency is <span className="text-green-600 font-medium">{currency}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {paymentOptions
                        .filter((method) => method.available || method.comingSoon)
                        .map((method) => (
                          <div
                            key={method.key}
                            className={`border rounded-md p-4 ${method.comingSoon ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                              } ${paymentMethod === method.key
                                ? "border-[#82b440] bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() =>
                              method.available && !method.comingSoon && method.onClick()
                            }
                          >
                            <div className="flex items-center">
                              <div className="mr-3">
                                <div
                                  className={`w-5 h-5 rounded-full border ${paymentMethod === method.key
                                    ? "border-[#82b440]"
                                    : "border-gray-300"
                                    } flex items-center justify-center`}
                                >
                                  {paymentMethod === method.key && (
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  )}
                                </div>
                              </div>

                              <div className="flex-grow">
                                <span className="font-medium">
                                  {method.label}{" "}
                                  {method.comingSoon && (
                                    <small className="text-sm text-red-600">(coming soon!)</small>
                                  )}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{method.note}</p>
                                {method.key === "wallet" &&
                                  (currency === "NGN"
                                    ? user?.wallet?.NGN?.balance ?? 0
                                    : user?.wallet?.USD?.balance ?? 0) < total && (
                                    <small className="text-red-600">insufficient</small>
                                  )}
                              </div>

                              <div>
                                <Image
                                  src={method.logo}
                                  alt={method.label}
                                  width={60}
                                  height={24}
                                  className="rounded"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                }

              </>
            )}

            <p className="text-xs text-left text-gray-500 mb-4">
              By continuing with your purchase, you agree to our{" "}
              <a href="#" onClick={() => setShowTerms(true)} className="text-green-500 hover:underline">
                Terms of Purchase
              </a>.
            </p>


            <Button
              className="bg-green-500 hover:bg-[#7aa93c] text-white mb-3"
              disabled={!isLoggedIn || !hasBillingDetails || !paymentMethod || processingPayment}
              onClick={handlePayment}
            >
              {isLoggedIn && hasBillingDetails && paymentMethod ? (
                <>
                  {
                    processingPayment ? <Loader className="mr-2 h-5 w-5 animate-spin text-white" /> : <Check className="h-4 w-4 mr-2" />
                  }

                  {
                    processingPayment ? 'Please wait...' : 'Complete Payment'
                  }

                </>
              ) : (
                "Complete Checkout"
              )}
            </Button>

            <p className="text-xs text-left text-gray-500 mb-4">Price is in {currency === 'NGN' ? 'Naira' : 'US dollars'} and excludes tax</p>


          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow-sm p-4 sticky top-4">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              <div className="max-h-60 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={item?.galleryImages[0] || "/placeholder.svg?height=40&width=40"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xs font-medium truncate capitalize">{shortenText(item.title, 18)}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs font-medium">{currency === 'NGN' ? symbol + item.priceNGN.toLocaleString() : symbol + item.priceUSD.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{symbol}{subtotal.toLocaleString()}</span>
                </div>

                {supportExtensionTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Support Extension</span>
                    <span>{symbol}{supportExtensionTotal.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{symbol}{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>


              <p className="text-xs text-left text-gray-500 mb-4">
                By continuing with your purchase, you agree to our{" "}
                <a href="#" onClick={() => setShowTerms(true)} className="text-green-500 hover:underline">
                  Terms of Purchase
                </a>.
              </p>


              <Button
                className="w-full bg-green-500 hover:bg-[#7aa93c] text-white mb-3"
                disabled={!isLoggedIn || !hasBillingDetails || !paymentMethod || processingPayment}
                onClick={handlePayment}
              >
                {isLoggedIn && hasBillingDetails && paymentMethod ? (
                  <>
                    {
                      processingPayment ? <Loader className="mr-2 h-5 w-5 animate-spin text-white" /> : <Check className="h-4 w-4 mr-2" />
                    }
                    {
                      processingPayment ? 'Please wait...' : 'Complete Payment'
                    }

                  </>
                ) : (
                  "Complete Checkout"
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 mb-4">Price is in {currency === 'NGN' ? 'Naira' : 'US dollars'} and excludes tax</p>

              <TermsOfPurchaseModal isOpen={showTerms} onClose={() => setShowTerms(false)} />


              <FeedbackModal
                isOpen={isPurchaseFeedbackOpen}
                onClose={() => {
                  onClose()
                  setIsPurchaseFeedbackOpen(false)
                }}
                type="purchase"
                data={sampleFeedbackData}
                onSubmit={handleFeedbackSubmit}
                userData={userData}
              />


              {(!isLoggedIn || !hasBillingDetails || !paymentMethod) && (
                <div className="text-xs text-center text-red-600">
                  {!isLoggedIn && <p>Please sign in or continue as guest</p>}
                  {isLoggedIn && !hasBillingDetails && <p>Please complete billing details</p>}
                  {isLoggedIn && hasBillingDetails && !paymentMethod && <p>Please select a payment method</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        }

        


      </div>
    </div>
  )
}
