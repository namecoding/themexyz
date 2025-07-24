"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, DollarSign, Users, Zap } from "lucide-react"
import {metaData} from "@/lib/utils";

interface WelcomeStepProps {
  user: any
  onNext: () => void
  isFirstStep: boolean
}

export default function WelcomeStep({ user, onNext, isFirstStep }: WelcomeStepProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Let's get started!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome {user?.name}! You're about to join thousands of creators earning money by selling their digital
          products on {metaData.name}.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Earn Money</h3>
            <p className="text-sm text-gray-600">Set your own prices and earn up to 80% on every sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Global Reach</h3>
            <p className="text-sm text-gray-600">Sell to millions of customers worldwide</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Easy Setup</h3>
            <p className="text-sm text-gray-600">Get started in minutes with our simple process</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-green-800 mb-2">What you'll need:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• A few minutes to complete your profile</li>
          <li>• Your payout information</li>
          <li>• Some details about what you want to sell</li>
        </ul>
      </div>

      <Button onClick={onNext} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
        Let's Begin
      </Button>
    </div>
  )
}
