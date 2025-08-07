"use client"

import { useState, useRef, useEffect } from "react"
import { X, Smartphone, Tablet, Monitor, ShoppingCart, ArrowLeft, Check } from "lucide-react"
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

  // Demo URL would typically come from the item data
  // For this example, we'll use a placeholder

  useEffect(() => {
    // Reset loading state when device view changes
    // setIsLoading(true)
    console.log(item, 'items')
  }, [deviceView])

  const handleIframeLoad = () => {
    setIsLoading(false)
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
              deviceView !== 'mobile' && <h1 className="font-medium truncate max-w-md">
                {item?.title}
              </h1>
            }

          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#444444] rounded-md p-1">
              <button
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
    </div>
  )
}
