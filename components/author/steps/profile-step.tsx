"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, User } from "lucide-react";
import { SERVER_PUBLIC } from "@/lib/utils";

interface ProfileStepProps {
  data: any;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: any) => void;
}

export default function ProfileStep({ data, onNext, onPrev, onUpdate }: ProfileStepProps) {
  const [profile, setProfile] = useState(
    data.profile || {
      displayName: "",
      bio: "",
      website: "",
      portfolio: "",
      avatar: null,
      avatarPreview: "",
      ...data.profile,
    }
  );

  const isValid = profile.displayName && profile.bio;

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    onUpdate({ profile: updated });
  };


  const handleNext = () => {
    if (!isValid) return;

    onNext();
  };


  // useEffect(() => {
  //   console.log(data, "profile screen");
  // }, []);

  useEffect(() => {
    return () => {
      if (profile.avatarPreview) {
        URL.revokeObjectURL(profile.avatarPreview);
      }
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete your profile</h1>
        <p className="text-lg text-gray-600">
          Tell potential customers about yourself and your work. A great profile helps build trust and increases sales.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Author Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatarPreview ? (
                  <img src={profile.avatarPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 text-gray-400" />
                )}
              </div>

              <div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      const updated = {
                        ...profile,
                        avatar: file,
                        avatarPreview: preview,
                      };
                      setProfile(updated);
                      onUpdate({ profile: updated });
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px, JPG or PNG</p>
          </div>

          <div>
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              placeholder="How you want to appear to customers"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell customers about your experience, skills, and what makes your work special..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">{profile.bio.length}/500 characters</p>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              type="url"
              value={profile.portfolio}
              onChange={(e) => handleInputChange("portfolio", e.target.value)}
              placeholder="https://yourportfolio.com"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 rounded-lg p-4 mb-8">
        <h3 className="font-semibold text-green-500 mb-2">Profile Tips</h3>
        <ul className="text-sm text-green-500 space-y-1">
          <li>• Use a professional photo that shows your face</li>
          <li>• Write a compelling bio that highlights your expertise</li>
          <li>• Include links to your best work</li>
          <li>• Keep it authentic and personal</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
