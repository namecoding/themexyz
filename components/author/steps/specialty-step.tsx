"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Briefcase, ShoppingCart, Users, Zap, Heart, Camera, Palette, HeartPulse, BookOpen, Home, Cpu, Calendar, Utensils } from "lucide-react"

interface SpecialtyStepProps {
  data: any
  onNext: () => void
  onPrev: () => void
  onUpdate: (data: any) => void
}

export default function SpecialtyStep({ data, onNext, onPrev, onUpdate }: SpecialtyStepProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState(data.specialties || [])

  const specialties = [
    {
      id: "business",
      name: "Business & Corporate",
      description: "Professional business websites and applications",
      icon: Briefcase,
      color: "blue",
    },
    {
      id: "ecommerce",
      name: "eCommerce",
      description: "Online stores and shopping platforms",
      icon: ShoppingCart,
      color: "green",
    },
    {
      id: "portfolio",
      name: "Portfolio & Creative",
      description: "Showcase websites for creatives and professionals",
      icon: Camera,
      color: "purple",
    },
    {
      id: "blog",
      name: "Blog & Magazine",
      description: "Content-focused websites and publications",
      icon: Users,
      color: "orange",
    },
    {
      id: "landing",
      name: "Landing Pages",
      description: "High-converting landing and marketing pages",
      icon: Zap,
      color: "yellow",
    },
    {
      id: "nonprofit",
      name: "Non-Profit & Charity",
      description: "Websites for causes and organizations",
      icon: Heart,
      color: "red",
    },
    {
      id: "designs",
      name: "UI/UX & Graphic Designs",
      description: "Beautiful, intuitive, and impactful digital designs",
      icon: Palette,
      color: "red",
    },
    {
      id: "health",
      name: "Health & Wellness",
      description: "Websites for health professionals and services",
      icon: HeartPulse, // Or Stethoscope, depending on your icon set
      color: "pink",
    },
    {
      id: "education",
      name: "Education & eLearning",
      description: "Platforms for schools, courses, and online learning",
      icon: BookOpen,
      color: "teal",
    },
    {
      id: "realestate",
      name: "Real Estate",
      description: "Property listing and real estate platforms",
      icon: Home,
      color: "lime",
    },
    {
      id: "saas",
      name: "Technology & SaaS",
      description: "Websites for tech startups and SaaS products",
      icon: Cpu,
      color: "indigo",
    },
    {
      id: "events",
      name: "Events & Bookings",
      description: "Websites for events, tickets, and reservations",
      icon: Calendar,
      color: "cyan",
    },
    {
      id: "food",
      name: "Food & Restaurant",
      description: "Menus, orders, and restaurant websites",
      icon: Utensils,
      color: "amber",
    }

  ]

  const handleSpecialtyToggle = (specialtyId: string) => {
    const updated = selectedSpecialties.includes(specialtyId)
      ? selectedSpecialties.filter((s) => s !== specialtyId)
      : [...selectedSpecialties, specialtyId]

    setSelectedSpecialties(updated)
    onUpdate({ specialties: updated })
  }

  const handleNext = () => {
    if (selectedSpecialties.length > 0) {
      onNext()
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">What's your specialty?</h1>
        <p className="text-lg text-gray-600">
          Tell us what types of products you're most interested in creating. This helps us provide better
          recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {specialties.map((specialty) => {
          const Icon = specialty.icon
          const isSelected = selectedSpecialties.includes(specialty.id)

          return (
            <Card
              key={specialty.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-green-500 bg-green-50" : ""
              }`}
              onClick={() => handleSpecialtyToggle(specialty.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Checkbox checked={isSelected} onChange={() => handleSpecialtyToggle(specialty.id)} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{specialty.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedSpecialties.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
