"use client"

import { useState, useRef, useEffect } from "react"
import { X, Smartphone, Tablet, Monitor, ShoppingCart, ArrowLeft, Check, KeyIcon, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { metaData } from "@/lib/utils";
import ScreenLoading from "@/components/screenLoading";

interface TestDemoScreenProps {
  onClose: () => void
  item: any
  addToCart: (item: any) => void
  isInCart: boolean
}

export default function TestDemoScreen({ onClose, item, addToCart, isInCart }: TestDemoScreenProps) {
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
const [showCredentials, setShowCredentials] = useState(false)
  // Demo URL would typically come from the item data
  // For this example, we'll use a placeholder

   const [showTour, setShowTour] = useState(false);
  const steps = [
    { id: "back-button", message: "Click here to go back to the main list." },
    { id: "test-credentials", message: "Here you can view and copy demo login credentials." },
    { id: "device-buttons", message: "Switch between desktop and mobile view here." },
    { id: "add-to-cart", message: "Click here to add this item to your cart." },
  ];
  const [currentStep, setCurrentStep] = useState(0);

//   useEffect(() => {
//   if (!localStorage.getItem("testDemoScreenTourSeen")) {
//     // Small delay so that DOM finishes rendering
//     setTimeout(() => {
//       setShowTour(true)
//     }, 300)
//   }
// }, [item])


// const getStepTargetPosition = () => {
//   const targetEl = document.getElementById(steps[currentStep].id)
//   if (!targetEl) return { top: "50%", left: "50%" }

//   const rect = targetEl.getBoundingClientRect()
//   return {
//     top: `${rect.top + window.scrollY + rect.height + 8}px`, // below element
//     left: `${rect.left + window.scrollX}px`
//   }
// }


  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const [copied, setCopied] = useState<string | null>(null)

const handleCopy = (text: string, field: string, index: number) => {
  const uniqueKey = `${index}-${field}`; // demo username = "0-username", admin password = "1-password"
  navigator.clipboard.writeText(text)
  setCopied(uniqueKey)
  setTimeout(() => setCopied(null), 1500)
}



  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      case "desktop":
        return "100%"
    }
  }

  const getDeviceHeight = () => {
    switch (deviceView) {
      case "mobile":
        return "667px"
      case "tablet":
        return "1024px"
      case "desktop":
        return "calc(100vh - 120px)"
    }
  }

  return (
    <div className="fixed inset-0 bg-[#262626] z-50 flex flex-col">



      {/* Header */}
      <div className="bg-[#333333] text-white py-3 px-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="mr-3 text-white hover:text-gray-300 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            {
              deviceView !== 'mobile' && <h1 className="font-medium truncate max-w-md hidden sm:block">
                {item?.title}
              </h1>
            }

          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#444444] rounded-md p-1 relative">
             
             <div className="relative">
                <button
                id="test-credentials"
                  onClick={() => setShowCredentials((prev) => !prev)}
                  className={`p-2 rounded mr-2 ${showCredentials ? "bg-[#555555] text-white" : "text-gray-400 hover:text-white"}`}
                  aria-label="Test Key"
                >
                  {
                    showCredentials ? <X size={18} /> :  <KeyIcon size={18} />
                  }
                  
                </button>

                
                
                            {showCredentials && item?.loginDetails?.length > 0 && (
                              <div className="absolute top-10 left-0 bg-white text-black text-sm rounded-md shadow-lg p-3 w-72 z-10">
                                <p className="font-semibold mb-2">Test Login Credentials</p>

                                {item.loginDetails.map((detail, idx) => (
                                  <div key={idx} className="mb-3 last:mb-0 border-b last:border-b-0 pb-2 last:pb-0">
                                    <p className="text-xs uppercase text-gray-500 mb-1">
                                      {detail.description || (detail.urlType === "admin" ? "Admin Login" : "Demo Login")}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <p><strong>Username:</strong> {detail.username}</p>
                                      <button
                                        onClick={() => handleCopy(detail.username, 'username', idx)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        title="Copy username"
                                      >
                                        {copied === `${idx}-username` ? (
                                          <span className="text-green-500 text-xs">Copied!</span>
                                        ) : (
                                          <Copy size={16} />
                                        )}
                                      </button>
                                    </div>

                                    {/* Password Row */}
                                    <div className="flex items-center justify-between mt-1">
                                      <p><strong>Password:</strong> {detail.password}</p>
                                      <button
                                        onClick={() => handleCopy(detail.password, 'password', idx)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        title="Copy password"
                                      >
                                        {copied === `${idx}-password` ? (
                                          <span className="text-green-500 text-xs">Copied!</span>
                                        ) : (
                                          <Copy size={16} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}



              </div>
              
              <button
              id="device-buttons"
                onClick={() => setDeviceView("mobile")}
                className={`p-2 rounded ${deviceView === "mobile" ? "bg-[#555555] text-white" : "text-gray-400 hover:text-white"
                  }`}
                aria-label="Mobile view"
              >
                <Smartphone size={18} />
              </button>
              <button
                onClick={() => setDeviceView("tablet")}
                className={`p-2 rounded ${deviceView === "tablet" ? "bg-[#555555] text-white" : "text-gray-400 hover:text-white"
                  }`}
                aria-label="Tablet view"
              >
                <Tablet size={18} />
              </button>
              <button
                onClick={() => setDeviceView("desktop")}
                className={`p-2 rounded ${deviceView === "desktop" ? "bg-[#555555] text-white" : "text-gray-400 hover:text-white"
                  }`}
                aria-label="Desktop view"
              >
                <Monitor size={18} />
              </button>
            </div>
            <Button
            id="add-to-cart"
              className={`${isInCart ? "bg-gray-600 hover:bg-gray-700" : "bg-green-500 hover:bg-green-600"} text-white`}
              onClick={() => !isInCart && addToCart(item)}
              disabled={isInCart}
            >
              {isInCart ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors" aria-label="Close">
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="flex-grow bg-[#1e1e1e] flex items-center justify-center p-4 overflow-auto">
        <div
          className={`bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ${deviceView !== "desktop" ? "border-8 border-[#333333] rounded-xl" : ""
            }`}
          style={{
            width: getDeviceWidth(),
            height: getDeviceHeight(),
            maxWidth: "100%",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {isLoading && (
            <ScreenLoading />
          )}
          <iframe
            ref={iframeRef}
            src={item.demoUrl ? item.demoUrl : 'https://app.namecoding.net/'}
            title={`Demo of ${item?.title}`}
            className="w-full h-full"
            onLoad={handleIframeLoad}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#333333] text-white py-2 px-4 text-xs text-center">
        <p>This is a demo preview. Some functionality may be limited. © 2025 {metaData.name} Inc.</p>
      </div>


     {showTour && steps[currentStep] && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]">
    <div
      className="absolute bg-white p-4 rounded shadow-lg max-w-xs"
      style={getStepTargetPosition()}
    >
      <p className="font-semibold mb-2">{steps[currentStep].message}</p>
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.setItem("testDemoScreenTourSeen", "true");
            setShowTour(false);
          }}
        >
          Skip
        </Button>
        <Button
          onClick={() => {
            if (currentStep + 1 === steps.length) {
              localStorage.setItem("testDemoScreenTourSeen", "true");
              setShowTour(false);
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
        >
          {currentStep + 1 === steps.length ? "Done" : "Next"}
        </Button>
      </div>
    </div>
  </div>
)}



    </div>
  )
}
