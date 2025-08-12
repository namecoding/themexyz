"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Upload, DollarSign } from "lucide-react"
import { metaData } from "@/lib/utils";

interface CompletionStepProps {
  user: any
  data: any
  onComplete: () => void
}

export default function CompletionStep({ user, data, onComplete }: CompletionStepProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to {metaData.name}!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Congratulations {user?.name}! Your author account has been set up successfully. You're now ready to start
          selling your digital products to customers worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Upload className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Upload Products</h3>
            <p className="text-sm text-gray-600">Start by uploading your first digital product</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Build Your Reputation</h3>
            <p className="text-sm text-gray-600">Provide excellent products and customer service</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Earn Money</h3>
            <p className="text-sm text-gray-600">Watch your earnings grow with every sale</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-green-800 mb-4">What happens next?</h3>
        <div className="text-left space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-green-700">We'll review your account within 24-48 hours</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-green-700">You'll receive an email confirmation once approved</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-green-700">You can then start uploading and selling your products</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button onClick={onComplete} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg w-full">
          Go to Author Dashboard
        </Button>

        <p className="text-sm text-gray-500">
          Need help? Check out our{" "}
          <a href="#" className="text-green-600 hover:underline">
            Author Guide
          </a>{" "}
          or{" "}
          <a href="#" className="text-green-600 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  )
}
