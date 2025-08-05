"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, ExternalLink, Search, Calendar, Clock, FileText, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TestDemoScreen from "@/components/test-demo-screen";
import {SERVER_PUBLIC, isExpired, formatReadableDate} from "@/lib/utils";
import toast from 'react-hot-toast';
import PurchasePopover from "@/components/togglePopover"
import ProjectPlaceholder from "../projcet-placeholder"

interface PurchasesDashboardProps {
  user: any
}

export default function PurchasesDashboard({ user }: PurchasesDashboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "project" | "template" | "design" | "component">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name" | "price">("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(true);
const [showMore, setShowMore] = useState(false);
  // Mock data for purchases
  // const [allPurchases, setAllPurchases] = useState([
  //   {
  //     id: 1,
  //     title: "Evendo - Event & Conference HTML Template",
  //     image: "/placeholder.svg?height=60&width=80",
  //     purchaseDate: "May 2, 2025",
  //     expiryDate: "May 2, 2026",
  //     price: 19,
  //     type: "themes",
  //     supportStatus: "active",
  //     downloads: 3,
  //     lastDownload: "2 days ago",
  //     authorId:'6842c5705df72c7ddac0633',
  //     userId:"6842c5705df72c7ddac06c37"
  //   },
  //   {
  //     id: 2,
  //     title: "SEO Toolkit - WordPress Plugin",
  //     image: "/placeholder.svg?height=60&width=80",
  //     purchaseDate: "April 28, 2025",
  //     expiryDate: "October 28, 2025",
  //     price: 24,
  //     type: "plugins",
  //     supportStatus: "active",
  //     downloads: 1,
  //     lastDownload: "1 week ago",
  //     authorId:'6842c5705df72c7ddac0633',
  //     userId:"6842c5705df72c7ddac06c37"
  //   },
  //   {
  //     id: 3,
  //     title: "Shopify - eCommerce WordPress Theme",
  //     image: "/placeholder.svg?height=60&width=80",
  //     purchaseDate: "April 15, 2025",
  //     expiryDate: "October 15, 2025",
  //     price: 59,
  //     type: "php",
  //     supportStatus: "active",
  //     downloads: 5,
  //     lastDownload: "3 days ago",
  //     authorId:'6842c5705df72c7ddac0633',
  //     userId:"6842c5705df72c7ddac06c37"
  //   },
  //   {
  //     id: 4,
  //     title: "Portfolio Pro - Personal Portfolio Template",
  //     image: "/placeholder.svg?height=60&width=80",
  //     purchaseDate: "March 10, 2025",
  //     expiryDate: "September 10, 2025",
  //     price: 16,
  //     type: "themes",
  //     supportStatus: "active",
  //     downloads: 2,
  //     lastDownload: "1 month ago",
  //     authorId:'6842c5705df72c7ddac0633',
  //     userId:"6842c5705df72c7ddac06c37"
  //   },
  //   {
  //     id: 5,
  //     title: "Contact Form Builder - WordPress Plugin",
  //     image: "/placeholder.svg?height=60&width=80",
  //     purchaseDate: "February 5, 2025",
  //     expiryDate: "August 5, 2025",
  //     price: 29,
  //     type: "plugins",
  //     supportStatus: "expired",
  //     downloads: 4,
  //     lastDownload: "2 months ago",
  //     authorId:'6842c5705df72c7ddac0633',
  //     userId:"6842c5705df72c7ddac06c37"
  //   },
  // ]);


  const x ={
    title: "Shopify - eCommerce WordPress Theme",
    image: "/placeholder.svg?height=60&width=80",
    purchaseDate: "2025-04-15T00:00:00.000Z",
    expiryDate:"2025-07-15T00:00:00.000Z",
    price:59,
    type:"project",
    supportDuration: "2025-04-15T00:00:00.000Z",
    supportExpiryDate:"2025-07-15T00:00:00.000Z",
    downloads:5,
    lastDownload:"3 days ago",
    authorId:"6842c5705df72c7ddac0633",
    userId:"685aea9d3abdf17351e0467b",
    downloadInstructions:"just download and unzip",
    loginDetails:[],
    license:''
  }


  const [allPurchases, setAllPurchases] = useState<Purchase[]>([]);

  type Purchase = {
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
    const fetchRecentPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${SERVER_PUBLIC}/auth/purchases`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setAllPurchases(data.purchases);
        } else {
          console.log("Failed to fetch recent purchases:", data.message);
          toast.error("Failed to fetch recent purchases");
        }

        setIsLoadingPurchase(false)

      } catch (error) {
        setIsLoadingPurchase(false)
        console.log("Fetch error:", error);
        toast.error("Fetch error");
      }
    };

    fetchRecentPurchases();
  }, []);


  const handleDownload = (purchase: any)=>{
    if(isExpired(purchase)){
      console.log("This item has expired.");
    }else{
      console.log(purchase)
    }
    
  }



  // Filter purchases based on active tab and search query
  const filteredPurchases = allPurchases
    .filter((purchase) => {
      if (activeTab !== "all" && purchase.type !== activeTab) {
        return false
      }
      return !(searchQuery && !purchase.title.toLowerCase().includes(searchQuery.toLowerCase()));

    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
        case "oldest":
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
        case "name":
          return a.title.localeCompare(b.title)
        case "price":
          return b.price - a.price
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Purchases</h1>
            <p className="text-gray-600">Manage your purchased themes, plugins, and licenses.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
            <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white text-xs">
              <Link href="/">Browse More Items</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-white rounded-lg shadow-sm p-4 ${showFilters ? "block" : "hidden"}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search purchases..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82b440]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="recent">Sort by: Most Recent</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="name">Sort by: Name</option>
              <option value="price">Sort by: Price</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex bg-gray-100 rounded-md p-0.5 w-fit">
          <button
            className={`px-4 py-1.5 text-sm rounded-md ${
              activeTab === "all" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Items
          </button>
          <button
            className={`px-4 py-1.5 text-sm rounded-md ${
              activeTab === "project" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("project")}
          >
            Projects
          </button>
          <button
            className={`px-4 py-1.5 text-sm rounded-md ${
              activeTab === "template" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("template")}
          >
            Templates
          </button>
          <button
            className={`px-4 py-1.5 text-sm rounded-md ${
              activeTab === "design" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("design")}
          >
            UI/UX Designs
          </button>
          <button
            className={`px-4 py-1.5 text-sm rounded-md ${
              activeTab === "component" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("component")}
          >
            Components
          </button>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">Your Purchases
            {
              !isLoadingPurchase && <>({filteredPurchases.length})</>
            }

          </h2>
        </div>


        {
          isLoadingPurchase ?
              <ProjectPlaceholder i={3}/>
              :
              <>
                {filteredPurchases.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredPurchases.map((purchase) => (
                          <div key={purchase.id} className="p-4 hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <div className="flex items-center flex-grow mb-4 sm:mb-0">
                                <div className="flex-shrink-0 mr-4">
                                  <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden">
                                    <Image
                                        src={purchase.image || "/placeholder.svg?height=60&width=80"}
                                        alt={purchase.title}
                                        width={80}
                                        height={60}
                                        className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h3 className="font-medium text-sm truncate">{purchase.title}</h3>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>Purchased: {formatReadableDate(purchase.purchaseDate)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      
                                      <span>
                                     Download expiring date: <span className={`${isExpired(purchase) ? "text-red-500" : "text-green-500"}`}> {formatReadableDate(purchase.expiryDate)}</span>
                                    </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                        purchase.supportStatus === "active"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                                >
                                  {purchase.supportStatus === "active" ? "Support Active" : "Support Expired"}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 capitalize">
                                  {purchase.type}
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{purchase.downloads}</span> downloads (last download:{" "}
                                {purchase.lastDownload})
                              </div>
                              <div className="flex flex-wrap gap-2 overflow-visible relative">
                                
                                {
                                !isExpired(purchase) ? (
                                <Button onClick={()=>handleDownload(purchase)} variant="outline" size="sm" className="text-xs">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                                )
                                :
                                <Button disabled variant="outline" size="sm" className="text-xs">
                                  <Download className="h-3 w-3 mr-1" />
                                  <span className="text-xs text-red-500">Download Expired</span>
                                </Button>
                                
                              }


                                <PurchasePopover purchase={purchase}/>
                                
                              <Button className="text-xs bg-green-500 hover:bg-[#7aa93c] text-white">Extend Support</Button>
                                
                              </div>
                            </div>
                          </div>
                      ))}

                    </div>
                ) : (
                    <div className="p-8 text-center">
                      <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                        <Download className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No purchases found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery
                            ? "No items match your search criteria."
                            : "You haven't made any purchases in this category yet."}
                      </p>
                      <Button asChild className="bg-green-500 hover:bg-[#7aa93c] text-white">
                        <Link href="/">Browse Marketplace</Link>
                      </Button>
                    </div>
                )}
              </>
        }


      </div>
    </div>
  )
}
