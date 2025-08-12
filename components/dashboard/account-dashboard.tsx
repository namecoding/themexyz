"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, CreditCard, Clock, Star, Calendar, ChevronRight, ExternalLink, Loader, Coins, Tag, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVER_PUBLIC, formatReadableDate, getMembershipDuration } from "@/lib/utils";
import toast from "react-hot-toast";
import WizardModal from "@/components/WizardModal";
import ProgressDonut from "@/components/progressBar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import UnderReviewModal from "@/components/UnderReviewModal";
import ProjectPlaceholder from "../projcet-placeholder"


interface AccountDashboardProps {
  user: any
}

type ActivityType = "download" | "purchase" | "review";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
}

export default function AccountDashboard({ user }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "project" | "design" | "component" | "template">("all")
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [openWizard, setOpenWizard] = useState(false);
  const [showUnderReview, setShowUnderReview] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token"); // adjust the key if different

        if (!token) {
          console.warn("No token found in localStorage.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${SERVER_PUBLIC}/auth/activities?recent=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setActivities(data.activities);
        } else {
          //console.log("Failed to fetch activities:", data.message);
        }
      } catch (error) {
        //console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);


  // Mock data for recent purchases
  const [recentPurchases, setRecentPurchases] = useState<Recent[]>([]);

  type Recent = {
    id: string;
    title: string;
    image: string;
    purchaseDate: string;
    expiryDate: string;
    price: number;
    type: string;
    supportStatus: string;
    downloads: number;
    lastDownload: string;
    authorId: string;
    userId: string;
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${SERVER_PUBLIC}/auth/purchases?recent=true`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setIsLoadingPurchase(false)
        if (data.success) {
          setRecentPurchases(data.purchases);
        } else {
          //console.log("Failed to fetch purchases:", data.message);
          toast.error("Failed to fetch purchases");
        }
      } catch (error) {
        setIsLoadingPurchase(false)
        //console.log("Fetch error:", error);
        toast.error("Fetch error");
      }
    };

    fetchPurchases().then();
  }, []);


  const filteredPurchases =
    activeTab === "all" ? recentPurchases : recentPurchases.filter((purchase) => purchase.type === activeTab)

  const renderIcon = (type) => {
    switch (type) {
      case "download":
        return (
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Download className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "purchase":
        return (
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <CreditCard className="h-4 w-4 text-green-500" />
          </div>
        );
      case "review":
        return (
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <Star className="h-4 w-4 text-yellow-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, <span className="capitalize">{user?.name?.split(" ")[0] || "User"}!</span></h1>
            <p className="text-gray-600">Here's an overview of your account and recent activity.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/dashboard/purchases">
                <Download className="h-3 w-3 mr-1" />
                Downloads
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/dashboard/settings">
                <CreditCard className="h-3 w-3 mr-1" />
                Billing
              </Link>
            </Button>

            {user?.isAuthor === 1 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-white bg-green-500"
                onClick={() => {
                  user?.authorityToSell ?
                    setOpenWizard(true) : setShowUnderReview(true)
                }}
              >
                <Tag className="h-3 w-3 mr-1 text-white" />
                Sell
              </Button>
            )}

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {
          user?.isAuthor !== 0 && (
            <>
              {[
                {
                  currency: "NGN",
                  symbol: "₦",
                  balance: user?.author?.NGN?.balance || 0,
                  bg: "bg-green-100",
                  iconColor: "text-green-500"
                },
                {
                  currency: "USD",
                  symbol: "$",
                  balance: user?.author?.USD?.balance || 0,
                  bg: "bg-purple-100",
                  iconColor: "text-purple-600"
                }
              ].map((item) => (
                <div key={item?.currency} className="bg-white rounded-lg shadow-sm p-4 mb-3">
                  <div className="flex items-center">
                    <div className={`${item?.bg} p-3 rounded-full mr-4`}>
                      <CreditCard className={`h-5 w-5 ${item?.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sales Balance ({item?.currency})</p>
                      <h3 className="text-xl font-bold">
                        {item.symbol}
                        {item.balance}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )
        }

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CreditCard className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">NGN Balance</p>
              <h3 className="text-xl font-bold">₦{user?.wallet?.NGN?.balance}</h3>
              <small>Wallet</small>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">USD Balance</p>
              <h3 className="text-xl font-bold">${user?.wallet?.USD?.balance}</h3>
              <small>Wallet</small>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Downloads</p>
              <h3 className="text-xl font-bold">{user?.totalDownloads || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <h3 className="text-xl font-bold">{getMembershipDuration(user?.createdAt)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reviews</p>
              <h3 className="text-xl font-bold">{user?.reviews}</h3>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <Coins className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Loyalty Point</p>
              <h3 className="text-xl font-bold">{user?.loyaltyPoint || 0}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-semibold">Recent Purchases</h2>
          <div className="flex bg-gray-100 rounded-md p-0.5">
            <button
              className={`px-3 py-1 text-xs rounded-md ${activeTab === "all" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-md ${activeTab === "project" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("project")}
            >
              Projects
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-md ${activeTab === "template" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("template")}
            >
              Templates
            </button>

            <button
              className={`px-3 py-1 text-xs rounded-md ${activeTab === "design" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("design")}
            >
              UI/UX Designs
            </button>

            <button
              className={`px-3 py-1 text-xs rounded-md ${activeTab === "component" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("component")}
            >
              Components
            </button>
          </div>
        </div>

        {
          isLoadingPurchase ?
            <ProjectPlaceholder i={2} />
            :
            <div className="divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <div key={purchase.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={purchase?.image || "/placeholder.svg?height=60&width=80"}
                            alt={purchase?.title}
                            width={80}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-sm truncate">{purchase?.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Purchased on {purchase?.purchaseDate}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4 flex flex-col items-end">
                        <span className="font-bold text-sm">${purchase?.price}</span>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 capitalize"
                        >
                          {purchase?.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>

                      <Button variant="outline" size="sm" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        License
                      </Button>
                      {purchase.supportStatus === "expired" && (
                        <Button className="text-xs bg-green-500 hover:bg-green-600 text-white">Extend Support</Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                    <Download className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No purchases found</h3>
                  <p className="text-gray-500 mb-4">You haven't made any purchases in this category yet.</p>
                  <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                    <Link href="/">Browse Marketplace</Link>
                  </Button>
                </div>
              )}
            </div>
        }



        {filteredPurchases.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <Button asChild variant="link" className="text-green-500">
              <Link href="/dashboard/purchases">
                View All Purchases <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>


      <WizardModal open={openWizard} onClose={() => setOpenWizard(false)} user={user} />


      <UnderReviewModal open={showUnderReview} onClose={() => setShowUnderReview(false)} />


      {/* Account Activity */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">Recent Activity</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-300 h-8 w-8" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-500">No activities found.</span>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  {renderIcon(activity?.type)}
                  <div>
                    <p className="text-sm">
                      {activity?.title}{" "} -
                      <span className="font-medium">{activity?.description}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatReadableDate(activity?.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
