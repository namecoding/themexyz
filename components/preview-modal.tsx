"use client"

import React, {useEffect, useState} from "react"
import Image from "next/image"
import Link from "next/link"
import {
  X,
  Star,
  ShoppingCart,
  Check,
  ExternalLink,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Trademarks from "@/components/trademarks"
import { useActiveCurrency } from "@/lib/currencyTag"
import {defaultCurrency, formatReadableDate, metaData} from "@/lib/utils"
import TestDemoScreen from "@/components/test-demo-screen"
import Leaf from "@/components/leaf"
import AuthorProfileModal from "@/components/admin/author-profile-modal";

interface PreviewModalProps {
  onClose: () => void
  addToCart: (item: any) => void
  isInCart: boolean
  item: any
  cartCount: number
}

export default function PreviewModal({
                                       onClose,
                                       addToCart,
                                       isInCart,
                                       item,
                                       cartCount,
                                     }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isPreview, setIsPreview] = useState(false)
  const { currency, symbol } = useActiveCurrency(defaultCurrency)

  const authorHelp = item.helpDurationSettings?.find(h => h.type === "author")
  const extendedHelp = item.helpDurationSettings?.find(h => h.type === "extended")
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const staticSections = [
    { key: "overview", label: "Overview" },
    { key: "features", label: "Features" },
    { key: "gallery", label: "Gallery" },
  ]
  const [authorProfileModal, setAuthorProfileModal] = useState(false)
  const sampleAuthorData = {
    id: "author_001",
    name: "Dike2",
    username: "dike2dev",
    avatar:
        "https://firebasestorage.googleapis.com/v0/b/unity-exness.appspot.com/o/themexyz%2F1751434539905_pw6rpj1mg.jpg?alt=media&token=03237342-b44a-4705-abbf-d5e3ef9abee3",
    coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=400&fit=crop",
    title: "Full-Stack Developer & UI/UX Designer",
    bio: "Passionate full-stack developer with 8+ years of experience creating innovative web applications and digital solutions. Specialized in PHP, JavaScript, and modern web technologies. I focus on delivering high-quality, scalable solutions that drive business growth and enhance user experience.",
    location: "Lagos, Nigeria",
    joinDate: "2018-03-15T00:00:00.000Z",
    website: "https://dike2dev.com",
    skills: [
      "PHP",
      "JavaScript",
      "React",
      "Vue.js",
      "Node.js",
      "MySQL",
      "MongoDB",
      "Laravel",
      "WordPress",
      "UI/UX Design",
      "Responsive Design",
      "API Development",
    ],
    achievements: [
      // {
      //   title: "Top Seller",
      //   description: "Achieved top seller status with over 500 successful sales",
      //   icon: "trophy",
      //   date: "2024-01-15T00:00:00.000Z",
      // },
      // {
      //   title: "5-Star Rating",
      //   description: "Maintained 5-star average rating across all products",
      //   icon: "star",
      //   date: "2023-12-01T00:00:00.000Z",
      // },
      // {
      //   title: "Innovation Award",
      //   description: "Recognized for innovative fintech solutions",
      //   icon: "award",
      //   date: "2023-08-20T00:00:00.000Z",
      // },
    ],
    stats: {
      totalProducts: 0,
      totalSales: 0,
      averageRating: 0,
      totalReviews: 0,
      responseTime: "2 hours",
      completionRate: 0,
    },
    products: [
      {
        id: "1",
        title: "Complete Online Banking Web App",
        category: "Finance & FinTech",
        price: { usd: 150, ngn: 220000 },
        image: "https://res.cloudinary.com/namecoding-web-team/image/upload/v1751672713/tvynomizretoqecvjq4f.png",
        rating: 0,
        sales: 0,
        featured: true,
        tags: ["PHP", "MySQL", "Banking", "Responsive"],
      },
      {
        id: "2",
        title: "E-commerce Dashboard Template",
        category: "E-commerce",
        price: { usd: 85, ngn: 125000 },
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        rating: 0,
        sales: 0,
        featured: false,
        tags: ["React", "Dashboard", "Analytics"],
      },
      {
        id: "3",
        title: "Restaurant Management System",
        category: "Business & Corporate",
        price: { usd: 120, ngn: 175000 },
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        rating: 0,
        sales: 0,
        featured: false,
        tags: ["Laravel", "POS", "Inventory"],
      },
      {
        id: "4",
        title: "Real Estate Platform",
        category: "Real Estate",
        price: { usd: 200, ngn: 290000 },
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
        rating: 0,
        sales: 0,
        featured: true,
        tags: ["Vue.js", "Property", "Listings"],
      },
      {
        id: "5",
        title: "Learning Management System",
        category: "Education",
        price: { usd: 180, ngn: 260000 },
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        rating: 0,
        sales: 0,
        featured: false,
        tags: ["PHP", "Education", "LMS"],
      },
      {
        id: "6",
        title: "Healthcare Management Portal",
        category: "Healthcare",
        price: { usd: 250, ngn: 365000 },
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        rating: 0,
        sales: 0,
        featured: true,
        tags: ["React", "Healthcare", "Portal"],
      },
    ],
    reviews: [
      {
        id: "1",
        customerName: "Sarah Johnson",
        customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
            "Exceptional work! The banking system exceeded all expectations. Clean code, great documentation, and excellent support. Highly recommended!",
        date: "2024-01-10T00:00:00.000Z",
        productTitle: "Complete Online Banking Web App",
      },
      {
        id: "2",
        customerName: "Michael Chen",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
            "Outstanding developer! Delivered exactly what was promised and more. The e-commerce dashboard is perfect for our needs.",
        date: "2024-01-05T00:00:00.000Z",
        productTitle: "E-commerce Dashboard Template",
      },
      {
        id: "3",
        customerName: "Emily Rodriguez",
        customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 4,
        comment:
            "Great quality work and very responsive to questions. The restaurant management system works flawlessly.",
        date: "2023-12-28T00:00:00.000Z",
        productTitle: "Restaurant Management System",
      },
      {
        id: "4",
        customerName: "David Thompson",
        customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
            "Incredible attention to detail and professional service. The real estate platform is exactly what we needed for our business.",
        date: "2023-12-20T00:00:00.000Z",
        productTitle: "Real Estate Platform",
      },
    ],
    ratingBreakdown: {
      5: 298,
      4: 32,
      3: 8,
      2: 3,
      1: 1,
    },
  }


  useEffect(()=>{
    console.log(item, 'item data 0000')
  },[])


  return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-[#262626] text-white py-3 px-4">
            <div className="container mx-auto max-w-6xl flex items-center justify-between">
              <Leaf small="s" />
              <div className="flex items-center space-x-4">
                <Link href="#" className="text-white hover:text-gray-300 relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#82b440] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                  )}
                </Link>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300"
                    aria-label="Close preview"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow bg-white">
            <div className="container mx-auto max-w-6xl py-6 px-4">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left column */}
                <div className="lg:w-2/3">
                  <h1 className="text-2xl font-bold mb-2 capitalize">{item.title}</h1>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>by {item.author}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-1">({item.marketData?.reviews || 0})</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{item.marketData?.sales || 0} sales</span>
                  </div>

                  <div className="mb-6 rounded-md overflow-hidden border border-gray-200 relative group max-w-2xl mx-auto">
                    <Image
                        src={item.galleryImages?.[0] || "/placeholder.svg"}
                        alt={item.title}
                        width={600}
                        height={300}
                        className="w-full h-auto"
                    />
                    {
                        item.sellType && item.sellType !=='complete projects' &&
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-black border-white hover:bg-white hover:text-black"
                              onClick={() => setIsPreview(true)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Test Demo
                          </Button>
                        </div>
                    }

                  </div>

                  {
                    item.sellType && item.sellType !=='complete projects' &&
                      <div className="flex items-center justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-black border-white hover:bg-white hover:text-black"
                            onClick={() => setIsPreview(true)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Test Demo
                        </Button>
                      </div>
                  }

                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8 overflow-x-auto">
                      {staticSections.map(section => (
                          <button
                              key={section.key}
                              onClick={() => setActiveTab(section.key)}
                              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                  activeTab === section.key
                                      ? "border-[#82b440] text-green-600"
                                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }`}
                          >
                            {section.label}
                          </button>
                      ))}
                    </nav>
                  </div>

                  <div className="mb-8">
                    {activeTab === "overview" && (
                        <div>
                          <p className="text-gray-700 mb-4">{item.overview || "Overview not available."}</p>
                          <h3 className="text-lg font-bold mt-6 mb-3">Suitable For</h3>
                          <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-700">
                            {item.suitableFor?.length > 0
                                ? item.suitableFor.map((s, i) => <li key={i}>{s}</li>)
                                : <li>No info</li>}
                          </ul>
                        </div>
                    )}

                    {activeTab === "features" && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Key Features</h3>
                          <ul className="space-y-2 mb-6">
                            {item.features?.length > 0
                                ? item.features.map((f, i) => (
                                    <li key={i} className="flex items-start">
                                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                      <span className="text-gray-700">{f}</span>
                                    </li>
                                ))
                                : <li>No features listed</li>}
                          </ul>
                        </div>
                    )}

                    {activeTab === "gallery" && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Product Gallery</h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {item.galleryImages?.length > 0
                                ? item.galleryImages.map((img, i) => (
                                    <div
                                        key={i}
                                        className="relative group overflow-hidden rounded-md border border-gray-200 cursor-pointer w-[160px] h-[130px]"
                                        onClick={() => setZoomImage(img)}
                                    >
                                      <Image
                                          src={img}
                                          alt={`Gallery image ${i + 1}`}
                                          fill
                                          className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-gray-600 border-white"
                                        >
                                          <ImageIcon className="h-4 w-4 mr-1" />
                                          View Full Size
                                        </Button>
                                      </div>
                                    </div>
                                ))
                                : <p className="text-gray-700">No images available</p>}
                          </div>
                        </div>
                    )}


                  </div>
                </div>

                {/* Right column */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-md p-5 mb-6 text-center">
                  <span className="text-3xl font-bold">
                    {symbol}
                    {currency === "NGN"
                        ? item.priceNGN?.toLocaleString()
                        : item.priceUSD?.toLocaleString()}
                  </span>
                    <Button
                        className={`w-full mb-3 py-6 ${
                            isInCart
                                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                : "bg-green-500 hover:bg-[#7aa93c] text-white"
                        }`}
                        onClick={() => {
                          if (!isInCart) addToCart(item)
                        }}
                        disabled={isInCart}
                    >
                      {isInCart ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Item in Cart
                          </>
                      ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500">Price excludes tax</p>

                    <div className="mt-4 space-y-2 text-sm text-left">
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        Quality checked by {metaData.name}
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        {authorHelp
                            ? `${authorHelp.duration} support from Author`
                            : "No author support info"}
                      </div>
                      {extendedHelp && (
                          <div className="flex items-start">
                            <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            Extended: {extendedHelp.duration}, Fee {symbol}
                            {currency === "NGN"
                                ? extendedHelp.feeNGN
                                : extendedHelp.feeUSD}
                          </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Update</span>
                      <span>{formatReadableDate(item.lastUpdate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Published</span>
                      <span>{formatReadableDate(item.releaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Compatible Browsers</span>
                      <span>{item.compatibleBrowsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Layout</span>
                      <span>{item.layout}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span>{item.sellType}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Built with</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.builtWith?.map((tech, i) => (
                          <Badge
                              key={i}
                              variant="outline"
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                          >
                            {tech}
                          </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag, i) => (
                          <Badge
                              key={i}
                              variant="outline"
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                          >
                            {tag}
                          </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Meet the Author</h3>
                    <div className="flex items-center space-x-3 mb-3 ">
                      <Image
                          src={item.authorImage || "/placeholder.svg"}
                          alt={item.author}
                          width={50}
                          height={50}
                          className="rounded-full w-12 h-12 overflow-hidden"
                      />
                      <div>
                        <h4 className="font-medium">{item.author}</h4>
                        <div className="flex items-center text-yellow-400 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                          <span className="text-gray-500 ml-1">
                          ({item.marketData?.reviews || 0})
                        </span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={()=>setAuthorProfileModal(true)} variant="outline" className="w-full text-sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Trademarks />

        </div>

        {isPreview && (
            <TestDemoScreen
                onClose={() => setIsPreview(false)}
                item={item}
                addToCart={() => {}}
                isInCart={false}
            />
        )}

        {zoomImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
              <div className="relative max-w-3xl w-full">
                <Image
                    src={zoomImage}
                    alt="Zoomed image"
                    width={1000}
                    height={600}
                    className="w-full h-auto rounded-md"
                />
                <button
                    onClick={() => setZoomImage(null)}
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                    aria-label="Close zoom"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
        )}


        <AuthorProfileModal isOpen={authorProfileModal} onClose={()=>setAuthorProfileModal(false)} authorData={sampleAuthorData}/>


      </div>
  )
}
