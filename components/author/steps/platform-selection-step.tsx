"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Code, Palette, Smartphone, Globe } from "lucide-react"
import { metaData } from "@/lib/utils";

interface PlatformSelectionStepProps {
  data: any
  onNext: () => void
  onPrev: () => void
  onUpdate: (data: any) => void
  isFirstStep: boolean
}

export default function PlatformSelectionStep({
  data,
  onNext,
  onPrev,
  onUpdate,
  isFirstStep,
}: PlatformSelectionStepProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState(data.platforms || [])

  const platforms = [
    {
      id: metaData.name,
      name: metaData.name,
      description: metaData.name + " marketplace",
      icon: Code,
      popular: true,
    },
    {
      id: "others",
      name: "Others",
      description: "Other digital marketplace",
      icon: Globe,
      popular: false,
    },
  ]

  const handlePlatformToggle = (platformId: string) => {
    const updated = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter((p) => p !== platformId)
      : [...selectedPlatforms, platformId]

    setSelectedPlatforms(updated)
    onUpdate({ platforms: updated })

    //console.log(platformId)
  }

  const handleNext = () => {
    if (selectedPlatforms.length > 0) {
      //console.log(selectedPlatforms, 'selectedPlatforms')
      onNext()
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Where do you want to sell?</h1>
        <p className="text-lg text-gray-600">
          Let us know if you plan selling your product on other platforms
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {platforms.map((platform) => {
          const Icon = platform.icon
          const isSelected = selectedPlatforms.includes(platform.id)

          return (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-green-500 bg-green-50" : ""
                }`}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Checkbox checked={isSelected} onChange={() => handlePlatformToggle(platform.id)} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-gray-900">
                        {platform.name}
                        {platform.popular && (
                          <span className="ml-2 text-xs bg-purple-200 text-green-500 px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isFirstStep}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedPlatforms.length === 0}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
