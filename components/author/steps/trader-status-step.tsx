"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";
import {baseUrl, themeXYZStorage} from "@/lib/utils";
import toast from "react-hot-toast";

interface TraderStatusStepProps {
  data: any;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: any) => void;
}

export default function TraderStatusStep({ data, onNext, onPrev, onUpdate }: TraderStatusStepProps) {
  const [traderStatus, setTraderStatus] = useState(
      data.traderStatus || {
        isTrader: false,
        taxId: "",
        companyName: "",
      }
  );

  const [loading, setLoading] = useState(false);

  const handleStatusChange = (value: string) => {
    const isTrader = value === "yes";
    const updated = { ...traderStatus, isTrader };
    setTraderStatus(updated);
    onUpdate({ traderStatus: updated });
  };

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...traderStatus, [field]: value };
    setTraderStatus(updated);
    onUpdate({ traderStatus: updated });
  };

  //use for firebase
  const completeRegistration_firebase = async () => {
    try {
      setLoading(true);
      let payload = { ...data };

      if (payload.profile.avatar instanceof File) {
        const formData = new FormData();
        formData.append("avatar", payload.profile.avatar);

        const res = await fetch(`${baseUrl}/auth/author/upload-avatar`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }

        const uploadData = await res.json();
        console.log("Avatar uploaded to:", uploadData.url);

        payload.profile.avatar = uploadData.url;
      }

      // Remove avatarPreview
      const { avatarPreview, ...profileWithoutPreview } = payload.profile;
      payload.profile = profileWithoutPreview;

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const saveRes = await fetch(`${baseUrl}/auth/author/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || "Registration failed");
      }

      const result = await saveRes.json();
      console.log("Registration successful!");

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      onNext();

    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //use for cloudinary
  const completeRegistration_cloudinary = async () => {
    try {
      setLoading(true);
      let payload = { ...data };

      // STEP 1: Upload avatar to Cloudinary (if avatar is a File)
      if (payload.profile.avatar instanceof File) {
        const form = new FormData();
        form.append("avatar", payload.profile.avatar); // File object

        const res = await fetch(`${baseUrl}/auth/author/upload-avatar-cloudinary`, {
          method: "POST",
          body: form, // Don't manually set Content-Type
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Avatar upload failed");
        }

        const uploadData = await res.json();
        console.log("Avatar uploaded to:", uploadData.url);

        // Replace File with the Cloudinary URL
        payload.profile.avatar = uploadData.url;
      }

      // STEP 2: Remove temporary preview if it exists
      const { avatarPreview, ...profileWithoutPreview } = payload.profile;
      payload.profile = profileWithoutPreview;

      // STEP 3: Get auth token and submit registration
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const saveRes = await fetch(`${baseUrl}/auth/author/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.message || "Registration failed");
      }

      const result = await saveRes.json();
      console.log("Registration successful!");

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      onNext();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () =>
      themeXYZStorage === 'cloudinary' ?
           await completeRegistration_cloudinary()
            :
          await completeRegistration_firebase()

  const handleNext = () => {
    if (traderStatus.isTrader) {
      if (!traderStatus.companyName.trim()) {
        toast.error("Please provide your company/business name.");
        return;
      }
      if (!traderStatus.taxId.trim()) {
        toast.error("Please provide your Tax ID / VAT Number.");
        return;
      }
    }
    completeRegistration().then();
  };


  return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Trader status declaration</h1>
          <p className="text-lg text-gray-600">
            Help us understand your business status for tax and legal compliance purposes.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Business Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Are you selling as a business/company? *</Label>
              <RadioGroup
                  value={traderStatus.isTrader ? "yes" : "no"}
                  onValueChange={handleStatusChange}
                  className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="individual" />
                  <Label htmlFor="individual">No, I'm selling as an individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="business" />
                  <Label htmlFor="business">Yes, I'm selling as a business/company</Label>
                </div>
              </RadioGroup>
            </div>

            {traderStatus.isTrader && (
                <>
                  <div>
                    <Label htmlFor="companyName">Company/Business Name *</Label>
                    <Input
                        id="companyName"
                        value={traderStatus.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Your registered business name"
                        className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input
                        id="taxId"
                        value={traderStatus.taxId}
                        onChange={(e) => handleInputChange("taxId", e.target.value)}
                        placeholder="Your business tax identification number"
                        className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required in some countries for tax reporting</p>
                  </div>
                </>
            )}
          </CardContent>
        </Card>

        <div className="bg-amber-50 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Important Information</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• This information is used for tax compliance and legal purposes</li>
                <li>• You may be required to provide additional documentation</li>
                <li>• Business sellers may have different tax obligations</li>
                <li>• You can update this information later if your status changes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={
                  loading ||
                  (traderStatus.isTrader && (
                      !traderStatus.companyName.trim() ||
                      !traderStatus.taxId.trim()
                  ))
              }
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </Button>

        </div>
      </div>
  );
}
