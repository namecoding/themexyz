"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useEffect } from "react"
import { metaData } from "@/lib/utils"

interface ThemeConfirmationStepProps {
  data: any
  onNext: () => void
  onPrev: () => void
}

export default function ThemeConfirmationStep({ data, onNext, onPrev }: ThemeConfirmationStepProps) {
  const specialties = [
    { id: "business", name: "Business & Corporate" },
    { id: "ecommerce", name: "eCommerce" },
    { id: "portfolio", name: "Portfolio & Creative" },
    { id: "blog", name: "Blog & Magazine" },
    { id: "landing", name: "Landing Pages" },
    { id: "nonprofit", name: "Non-Profit & Charity" },
    { id: "designs", name: "UI/UX & Graphic Designs" },
    { id: "education", name: "Education & eLearning" },
    { id: "events", name: "Events & Bookings" },
    { id: "realestate", name: "Real Estate" },
    { id: "saas", name: "Technology & SaaS" },
    { id: "food", name: "Food & Restaurant" },
    { id: "health", name: "Health & Wellness" },
  ]

  // Build map id -> name
  const specialtyMap = specialties.reduce((acc, curr) => {
    acc[curr.id] = curr.name
    return acc
  }, {} as Record<string, string>)

  // Get specialty names as a string
  const getSpecialtyNames = () => {
    return data?.specialties
        ?.map((id: string) => specialtyMap[id])
        .filter(Boolean)
        .join(", ") || ""
  }

  useEffect(() => {
    console.log(data, 'log')
  }, [data])

  const getDynamicMessage = () => {
    const specialtiesSelected = data?.specialties || [];
    const count = specialtiesSelected.length;

    if (count === 0) {
      return "Great choices! You're all set to create amazing digital products.";
    }

    if (count === 1) {
      const specialty = specialtiesSelected[0];
      switch (specialty) {
        case "ecommerce":
          return "Fantastic! You're ready to build an online store that stands out.";
        case "portfolio":
          return "Awesome! Let's showcase your creative work beautifully.";
        case "business":
          return "Great choice! You're set to create a professional business platform.";
        case "blog":
          return "Nice! Get ready to share your thoughts with the world.";
        case "nonprofit":
          return "Wonderful! Let's help your cause make an impact online.";
        case "education":
          return "You're set to empower learners with your platform.";
        case "saas":
          return "You're ready to launch a powerful SaaS solution.";
        case "health":
          return "You're creating something valuable for health and wellness.";
        case "events":
          return "Let's get your events platform ready for action.";
        case "realestate":
          return "You're set to build a stunning real estate platform.";
        case "food":
          return "Let's serve up a delicious food or restaurant site.";
        case "designs":
          return "Your eye for design will shine through beautifully.";
        case "landing":
          return "You're ready to launch high-converting landing pages.";
        default:
          return "Great choices! You're all set to create amazing digital products.";
      }
    }

    if (count <= 3) {
      return "Great picks! Your selections will work beautifully together.";
    }

    return "Amazing! You're building a diverse and powerful digital presence.";
  };

  const getDynamicMessage_ = () => {
    const specialtiesSelected = data?.specialties || [];

    const priorityList = [
      { id: "ecommerce", message: "You're ready to build an online store that stands out." },
      { id: "portfolio", message: "Let's showcase your creative work beautifully." },
      { id: "business", message: "You're set to create a professional business platform." },
      { id: "blog", message: "Get ready to share your thoughts with the world." },
      { id: "nonprofit", message: "Let's help your cause make an impact online." },
      { id: "education", message: "You're set to empower learners with your platform." },
      { id: "saas", message: "You're ready to launch a powerful SaaS solution." },
      { id: "health", message: "You're creating something valuable for health and wellness." },
      { id: "events", message: "Let's get your events platform ready for action." },
      { id: "realestate", message: "You're set to build a stunning real estate platform." },
      { id: "food", message: "Let's serve up a delicious food or restaurant site." },
      { id: "designs", message: "Your eye for design will shine through beautifully." },
      { id: "landing", message: "You're ready to launch high-converting landing pages." },
    ];

    const found = priorityList.find(item => specialtiesSelected.includes(item.id));
    if (found) {
      return found.message;
    }

    return "Great choices! You're all set to create amazing digital products.";
  };



  return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Let’s review your selections!</h1>
          <p className="text-lg text-gray-600 mb-8">
            {getDynamicMessage()}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Your Platforms</h3>
              <p className="text-gray-600 capitalize">{data?.platforms?.join(", ") || ""}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Your Specialties</h3>
              <p className="text-gray-600">{getSpecialtyNames()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-2">What's next?</h3>
          <p className="text-sm text-green-700">
            Now we'll help you set up your author profile and payment information so you can start selling right away.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button onClick={onNext} className="bg-green-600 hover:bg-green-700 text-white">
            Continue to Profile
          </Button>
        </div>
      </div>
  )
}
