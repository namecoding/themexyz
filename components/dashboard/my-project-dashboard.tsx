"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {Download, ExternalLink, Search, Calendar, Clock, FileText, Filter, Tags, Tag} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TestDemoScreen from "@/components/test-demo-screen";
import {baseUrl, formatReadableDate} from "@/lib/utils";
import toast from 'react-hot-toast';
import WizardModal from "@/components/WizardModal";
import UnderReviewModal from "@/components/UnderReviewModal";
import ProductModal from "@/components/admin/product-view-modal";

interface MyProductsDashboardProps {
  user: any
}

export default function MyProductsDashboard({ user }: MyProductsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "themes" | "plugins">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name" | "price">("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(true);
  const [openWizard, setOpenWizard] = useState(false);
  const [allProducts, setAllProducts] = useState<Purchase[]>([]);
  const [showUnderReview, setShowUnderReview] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [productModalData, setProductModalData] = useState(null);
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
    releaseDate:string
    lastUpdate:string,
    galleryImages:any
  };

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${baseUrl}/auth/author/by-author`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setAllProducts(data.themes);
          console.log(data.themes, 'authors themes');
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

  const handlePublish = (id:string) => {
    console.log(id, 'publishing id')
  }

  const handleView = (theme:any) => {
    setProductModalData(theme)
    setProductModal(true)
  }


  // Filter purchases based on active tab and search query
  const filteredPurchases = allProducts
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
            <h1 className="text-2xl font-bold mb-2">My Products</h1>
            <p className="text-gray-600">Manage your product themes, plugins, and licenses.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>

            {user.isAuthor === 1 && (
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-white bg-green-500"
                    onClick={() => {
                      user.authorityToSell ?
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
              activeTab === "themes" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("themes")}
          >
            Themes
          </button>
          <button
            className={`px-4 py-1.5 text-sm rounded-md ${
              activeTab === "plugins" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("plugins")}
          >
            Plugins
          </button>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">Your Products
            {
              !isLoadingPurchase && <>({filteredPurchases.length})</>
            }

          </h2>
        </div>


        {
          isLoadingPurchase ?
              <div className="inset-0 flex items-center justify-center mb-6 pt-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 gap-1"></div>
                <span className="z-20 text-xs gap-1"> Fetching Data...</span>
              </div>
              :
              <>
                {filteredPurchases.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredPurchases.map((theme) => (
                          <div key={theme.id} className="p-4 hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <div className="flex items-center flex-grow mb-4 sm:mb-0">
                                <div className="flex-shrink-0 mr-4">
                                  <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden">
                                    <Image
                                        src={theme.galleryImages[0] || "/placeholder.svg?height=60&width=80"}
                                        alt={theme.title}
                                        width={80}
                                        height={60}
                                        className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h3 className="font-medium text-sm truncate">{theme.title}</h3>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>Released: {formatReadableDate(theme.releaseDate)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>Updated: {formatReadableDate(theme.lastUpdate)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                        theme.supportStatus === "active"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                                >
                                  active
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 capitalize">
                                  free
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{theme?.marketData?.sales} Sales</span> | <span className="font-medium">{theme?.marketData?.reviews} Reviews</span> | <span className="font-medium">{theme?.marketData?.rating} Rating</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" className="text-xs">
                                  <Download className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button onClick={()=>handlePublish(theme.id)} variant="outline" size="sm" className="text-xs">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Publish
                                </Button>
                                <Button onClick={()=>handleView(theme)} variant="outline" size="sm" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button className="text-xs bg-green-500 hover:bg-[#7aa93c] text-white">Boost AD</Button>
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
                      <h3 className="text-lg font-medium mb-2">No product found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery
                            ? "No items match your search criteria."
                            : "You haven't created any product yet."}
                      </p>
                      <Button onClick={() => {
                        user.authorityToSell ?
                            setOpenWizard(true) : setShowUnderReview(true)
                      }} className="bg-green-500 hover:bg-[#7aa93c] text-white">
                        Sell Product
                      </Button>
                    </div>
                )}
              </>
        }


        <WizardModal open={openWizard} onClose={() => setOpenWizard(false)} user={user}/>

        <UnderReviewModal open={showUnderReview} onClose={() => setShowUnderReview(false)} />

        <ProductModal isOpen={productModal} onClose={() =>setProductModal(false)} productData={productModalData}/>

      </div>
    </div>
  )
}
