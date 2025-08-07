"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200 animate-slide-up">
      <div className="container mx-auto p-4 md:p-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Cookie Notice</h3>
            <p className="text-gray-600 text-sm">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
              traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center">
            <Button variant="outline" size="sm" onClick={onDecline} className="text-xs">
              Decline
            </Button>
            <Button size="sm" onClick={onAccept} className="bg-[#82b440] hover:bg-green-600 text-white text-xs">
              Accept All
            </Button>
          </div>
          <button
            onClick={onDecline}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close cookie notice"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
