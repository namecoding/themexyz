"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { User, Lock, Bell, CreditCard, Upload, Check, AlertTriangle, KeyIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import toast from 'react-hot-toast';
import { baseUrl, metaData } from "@/lib/utils";

interface SettingsDashboardProps {
  user: any
  id: null
}

export default function SettingsDashboard({ user }: SettingsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications" | "billing" | "accessCode">("profile")
  const [isProcessingAccessCode, setIsProcessingAccessCode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "",
    website: user?.website || "",
    location: user?.location || "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })


  const [accessCodeForm, setAccessCodeForm] = useState({
    currentCode: '',
    newCode: '',
    confirmCode: '',
  });

  const handleAccessCodeSubmit = async (e) => {
    e.preventDefault();

    if (!user?.admin?.permission) return;

    const token = localStorage.getItem("token"); // or however you're storing it

    if (!token) {
      return toast.error("Authentication token missing. Please log in again.");
    }

    const { newCode, confirmCode } = accessCodeForm;

    // Client-side validations
    if (newCode.length < 4) {
      return toast.error("New access code must be at least 4 characters.");
    }

    if (newCode !== confirmCode) {
      return toast.error("New access code and confirmation do not match.");
    }

    try {

      setIsProcessingAccessCode(true)
      const res = await fetch(`${baseUrl}/admin/update-access-code`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accessCodeForm),
      });

      const data = await res.json();

      setIsProcessingAccessCode(false)

      if (data.success) {
        toast.success("Access code updated successfully!");

        setAccessCodeForm({
          currentCode: '',
          newCode: '',
          confirmCode: '',
        })


      } else {
        toast.error(data.message || "Failed to update access code.");
      }
    } catch (error) {
      setIsProcessingAccessCode(false)
      console.log("Access code update error:", error);
      toast.error("An error occurred while updating access code.");
    }
  };



  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: user?.notifications?.emailUpdates || false,
    purchaseConfirmations: user?.notifications?.purchaseConfirmations || false,
    supportMessages: user?.notifications?.supportMessages || false,
    productUpdates: user?.notifications?.productUpdates || false,
    promotionalEmails: user?.notifications?.promotionalEmails || false,
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [comingSoonMessage, setComingSoonMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoadingBillingHistory, setIsLoadingBillingHistory] = useState(true);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`${baseUrl}/auth/history?recent=true`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setBillingHistory(data.payments);
        } else {
          console.error("Failed to fetch payment history:", data.message);
        }

        setIsLoadingBillingHistory(false)

      } catch (error) {
        setIsLoadingBillingHistory(false)
        console.error("Error fetching billing history:", error);
      }
    };

    fetchBillingHistory();
  }, []);


  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would update the user profile with an API call
    console.log("Profile update:", profileForm)
    setSuccessMessage("Profile updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("")

    const toastId = toast.loading('Uploading...');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("Passwords do not match");
      //setTimeout(() => setErrorMessage(""), 3000);
      toast.error("Passwords do not match", { id: toastId });
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Or however you're storing the JWT
      if (!token) {
        setErrorMessage("User not authenticated");
        toast.error("User not authenticated", { id: toastId });
        //setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      const response = await fetch(`${baseUrl}/auth/cpwd`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Failed to update password");
        toast.error(data.message, { id: toastId });
        // setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      setSuccessMessage("Password updated successfully!");
      toast.success('Password updated successfully!', { id: toastId });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Password update error:", err);
      toast.error("Something went wrong", { id: toastId });
      setErrorMessage("Something went wrong");
      //setTimeout(() => setErrorMessage(""), 3000);
    }
  };


  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would update notification settings with an API call
    console.log("Notification settings update:", notificationSettings)
    setSuccessMessage("Notification settings updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)

    // const toastId = toast.loading('Please Wait...');
    toast.success('Notification settings updated successfully', {});

    return
  }

  const enableTwoFactor = () => {
    setComingSoonMessage("Two factor authentication will be coming soon!")
    setTimeout(() => setComingSoonMessage(""), 3000)

    return
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your profile, security, and preferences.</p>
      </div>

      {/* Settings Tabs and Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Tabs */}
          <div className="sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "profile"
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-3" />
                    <span>Profile Information</span>
                  </button>
                </li>


                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "billing"
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    onClick={() => setActiveTab("billing")}
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    <span>Billing & Payments</span>
                  </button>
                </li>

                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "notifications"
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    <span>Notifications</span>
                  </button>
                </li>


                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "password"
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    onClick={() => setActiveTab("password")}
                  >
                    <Lock className="h-4 w-4 mr-3" />
                    <span>Password & Security</span>
                  </button>
                </li>

                {
                  user?.admin?.permission &&

                  <li>
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "accessCode"
                        ? "bg-green-500 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      onClick={() => setActiveTab("accessCode")}
                    >
                      <KeyIcon className="h-4 w-4 mr-3" />
                      <span>Change Access Code</span>
                    </button>
                  </li>
                }


              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
                <Check className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
            )}

            {comingSoonMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md flex items-center">
                <Check className="h-5 w-5 mr-2" />
                {comingSoonMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {errorMessage}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-4">
                      <Image
                        src={user?.avatar || "/placeholder.svg?height=80&width=80"}
                        alt="Profile"
                        width={80}
                        height={80}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Profile Photo</h3>
                      <p className="text-sm text-gray-500 mb-2">JPG, GIF or PNG. Max size of 800K</p>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Change Photo
                      </Button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      />
                    </div>
                  </div>

                  {
                    user?.isAuthor &&

                    <>
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                        />
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={3}
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                          placeholder="Tell us a little about yourself"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            value={profileForm.website}
                            onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                    </>

                  }

                  <div className="pt-4">
                    <Button type="submit" className="bg-green-500 hover:bg-[#7aa93c] text-white">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Billing & Payments</h2>

                <div className="mb-8">
                  <h3 className="font-medium mb-3">Payment Methods</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-white p-2 rounded-md border border-gray-200 mr-3">
                          <CreditCard className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-xs text-gray-500">Expires 12/2025</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs text-red-500 hover:text-red-700">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Payment Method <small className="text-red-600 text-xs">Coming soon!</small>
                  </Button>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium mb-3">Billing Information</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                    <div className="space-y-1 mb-3">
                      <p className="font-medium capitalize">{user?.name || "User Name"}</p>
                      <p className="text-sm">
                        {
                          user.address
                        }
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      {
                        user.address ? 'Edit Billing Address' : 'Add Billing Address'
                      }

                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Billing History</h3>
                  <p className="text-xs text-foreground mb-3">Last 20 recent transactions</p>

                  {
                    isLoadingBillingHistory ?
                      <div className="inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 gap-1"></div>
                        <span className="z-20 text-xs gap-1"> Fetching Data...</span>
                      </div>
                      :
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Description
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {billingHistory.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><small className={`text-xs ${item.currency === 'NGN' ? 'text-green-600' : 'text-red-600'}`}>{item.currency}</small> {item.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${item.status === "successful" || item.status === "funded" || item.status === "completed" || item.status === "release" || item.status === "success"
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : item.status === "failed" || item.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : item.status === "refunded"
                                            ? "bg-blue-100 text-blue-800"
                                            : ""
                                      }`}
                                  >
                                    {item.status}
                                  </span>

                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </div>

                  }

                </div>

              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="email-updates" className="text-sm font-medium text-gray-700">
                            Account updates
                          </label>
                          <p className="text-xs text-gray-500">Get important notifications about your account.</p>
                        </div>
                        <Switch
                          id="email-updates"
                          checked={notificationSettings.emailUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailUpdates: checked,
                            })
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="purchase-confirmations" className="text-sm font-medium text-gray-700">
                            Purchase confirmations
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive emails for purchase receipts and confirmations.
                          </p>
                        </div>
                        <Switch
                          id="purchase-confirmations"
                          checked={notificationSettings.purchaseConfirmations}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              purchaseConfirmations: checked,
                            })
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="support-messages" className="text-sm font-medium text-gray-700">
                            Support messages
                          </label>
                          <p className="text-xs text-gray-500">
                            Get notified when authors respond to your support requests.
                          </p>
                        </div>
                        <Switch
                          id="support-messages"
                          checked={notificationSettings.supportMessages}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              supportMessages: checked,
                            })
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="product-updates" className="text-sm font-medium text-gray-700">
                            Product updates
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive notifications when your purchased items are updated.
                          </p>
                        </div>
                        <Switch
                          id="product-updates"
                          checked={notificationSettings.productUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              productUpdates: checked,
                            })
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="promotional-emails" className="text-sm font-medium text-gray-700">
                            Marketing and promotional emails
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive special offers, promotions, and marketing emails from {metaData.name}.
                          </p>
                        </div>
                        <Switch
                          id="promotional-emails"
                          checked={notificationSettings.promotionalEmails}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              promotionalEmails: checked,
                            })
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="bg-green-500 hover:bg-[#7aa93c] text-white">
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Password & Security</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">

                  {
                    !user.isSocial &&

                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                        required
                      />
                    </div>
                  }

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters and include a number and a special character.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="bg-green-500 hover:bg-[#7aa93c] text-white">
                      Update Password
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button onClick={() => enableTwoFactor()} variant="outline">Enable Two-Factor Authentication <small className="text-red-600 text-xs">Coming soon!</small></Button>
                </div>
              </div>
            )}


            {/* Access Code Tab */}
            {activeTab === "accessCode" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Admin Access Code</h2>
                <div className="bg-yellow-100">
                  <p className="text-sm text-yellow-600 mb-6 px-4 py-3">
                    If you haven’t changed your access code before, please check your email for the default one sent to you.
                  </p>
                </div>

                <form onSubmit={handleAccessCodeSubmit} className="space-y-4">

                  <div>
                    <label htmlFor="current-access-code" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Access Code
                    </label>
                    <input
                      type="password"
                      id="current-access-code"
                      value={accessCodeForm.currentCode}
                      onChange={(e) => setAccessCodeForm({ ...accessCodeForm, currentCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="new-access-code" className="block text-sm font-medium text-gray-700 mb-1">
                      New Access Code
                    </label>
                    <input
                      type="password"
                      id="new-access-code"
                      value={accessCodeForm.newCode}
                      onChange={(e) => setAccessCodeForm({ ...accessCodeForm, newCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Access code must be at least 4 characters or more.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm-access-code" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Access Code
                    </label>
                    <input
                      type="password"
                      id="confirm-access-code"
                      value={accessCodeForm.confirmCode}
                      onChange={(e) => setAccessCodeForm({ ...accessCodeForm, confirmCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="bg-green-500 hover:bg-[#7aa93c] text-white flex items-center gap-2">
                      {isProcessingAccessCode && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isProcessingAccessCode ? "Processing..." : "Update Access Code"}
                    </Button>
                  </div>
                </form>
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  )
}
