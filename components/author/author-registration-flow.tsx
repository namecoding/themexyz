"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import WelcomeStep from "./steps/welcome-step"
import PlatformSelectionStep from "./steps/platform-selection-step"
import SpecialtyStep from "./steps/specialty-step"
import ThemeConfirmationStep from "./steps/theme-confirmation-step"
import ProfileStep from "./steps/profile-step"
import PayoutMethodStep from "./steps/payout-method-step"
import GeneralInfoStep from "./steps/general-info-step"
import TraderStatusStep from "./steps/trader-status-step"
import CompletionStep from "./steps/completion-step"
import { SERVER_PUBLIC, metaData } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AuthorRegistrationFlowProps {
  user: any
}

export default function AuthorRegistrationFlow({ user }: AuthorRegistrationFlowProps) {
  const router = useRouter()

  if (user.isAuthor === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">You're already an author!</h1>
          <p className="text-gray-600 mb-4">Your account is already registered as a {metaData.name} author.</p>
          <Button className="bg-green-500" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const [currentStep, setCurrentStep] = useState(0)
  const [registrationData, setRegistrationData] = useState({
    platforms: [],
    specialties: [],
    profile: {
      displayName: "",
      bio: "",
      website: "",
      portfolio: "",
      avatar: null,
    },
    payoutMethod: {
      currency: "",
      details: {},
    },
    generalInfo: {
      country: "",
      city: "",
      phone: "",
      address: "",
    },
    traderStatus: {
      isTrader: false,
      taxId: "",
      companyName: "",
    },
  })

  const steps = [
    { component: WelcomeStep, title: "Let's get started!" },
    { component: PlatformSelectionStep, title: "What do you want to sell" },
    { component: SpecialtyStep, title: "What's your specialty?" },
    { component: ThemeConfirmationStep, title: "I sense a theme developing!" },
    { component: ProfileStep, title: "Complete your profile" },
    { component: PayoutMethodStep, title: "Payout method" },
    { component: GeneralInfoStep, title: "General Information" },
    { component: TraderStatusStep, title: "Trader status declaration" },
    { component: CompletionStep, title: "Welcome to ThemeLeaf!" },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateRegistrationData = (stepData: any) => {
    setRegistrationData((prev) => ({
      ...prev,
      ...stepData,
    }))
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress indicator */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">Become a {metaData.name} Author</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CurrentStepComponent
          user={user}
          data={registrationData}
          onNext={nextStep}
          onPrev={prevStep}
          onUpdate={updateRegistrationData}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
          onComplete={() => {
            // Optionally update localStorage with the latest user info if needed
            // localStorage.setItem("user", JSON.stringify(updatedUser));

            router.push("/dashboard");
          }}
        />
      </div>
    </div>
  )
}
