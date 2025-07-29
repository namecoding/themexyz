"use client"

import { useState } from "react"
import { X, ExternalLink, Download, Star, Code, Users, Shield, Clock, User, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { helpDurationLabels } from "@/lib/utils"

interface ProductData {
    _id: string
    title: string
    isCategory: string
    featured: boolean
    priceNGN: number
    priceUSD: number
    demoUrl: string
    adminDemoUrl: string
    downloadUrl: string
    downloadInstructions: string
    author: string
    authorImage: string
    loginDetails: Array<{
        username: string
        password: string
        description: string
        urlType: string
    }>
    helpDurationSettings: Array<{
        type: string
        duration: string
        feeUSD: number
        feeNGN: number
    }>
    preferredContact: Array<{
        type: string
        value: string
    }>
    tags: string[]
    features: string[]
    galleryImages: string[]
    suitableFor: string[]
    compatibleBrowsers: string
    builtWith: string[]
    layout: string
    sellType: string
    license: string
    responseTime: string
    overview: string
    documentation: string
    marketData: {
        rating: number
        reviews: number
        sales: number
    }
    releaseDate: string
    lastUpdate: string
    id: string
}

interface ProductModalV2Props {
    isOpen: boolean
    onClose: () => void
    productData: ProductData
}

export default function ProductModalV2({ isOpen, onClose, productData }: ProductModalV2Props) {
    const [selectedImage, setSelectedImage] = useState(0)

    if (!isOpen) return null

    const formatPrice = (priceNGN: number, priceUSD: number) => {
        return { ngn: `₦${priceNGN.toLocaleString()}`, usd: `$${priceUSD}` }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Sort support duration settings - author support first, then extended
    const sortedSupportSettings = [...productData.helpDurationSettings].sort((a, b) => {
        if (a.type === "author") return -1
        if (b.type === "author") return 1
        return 0
    })

    const prices = formatPrice(productData.priceNGN, productData.priceUSD)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
            {/* Fixed Height Modal Container */}
            <div className="relative w-full max-w-7xl h-[95vh] bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Left Sidebar - Gallery (Mobile: Top, Desktop: Left) */}
                    <div className="w-full lg:w-2/5 bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-6 flex flex-col order-2 lg:order-1 max-h-[40vh] lg:max-h-none overflow-hidden">

                        <div className="p-3 sm:p-6 border-b bg-gradient-to-r from-white to-green-50 flex-shrink-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 pr-2 sm:pr-4 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium text-xs sm:text-sm">
                                            {productData.isCategory}
                                        </Badge>
                                        <Badge variant="outline" className="text-gray-600 text-xs sm:text-sm">
                                            {productData.sellType}
                                        </Badge>
                                    </div>
                                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight line-clamp-2">
                                        {productData.title}
                                    </h1>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{prices.usd}</span>
                                            <span className="text-sm sm:text-base lg:text-lg text-gray-500">/ {prices.ngn}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 h-8 w-8 p-0">
                                                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="hover:bg-red-50 hover:text-red-600 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
                            <div className="relative mb-2 sm:mb-4">
                                <img
                                    src={productData.galleryImages[selectedImage] || "/placeholder.svg"}
                                    alt={`Gallery image ${selectedImage + 1}`}
                                    className="w-full h-32 sm:h-48 lg:h-80 object-cover rounded-lg sm:rounded-xl shadow-lg"
                                />
                                {productData.featured && (
                                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                                        <Badge className="bg-green-500 text-white shadow-lg text-xs sm:text-sm">
                                            <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1 fill-current" />
                                            Featured
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-6 sm:grid-cols-4 gap-1 sm:gap-2 overflow-x-auto">
                                {productData.galleryImages.slice(0, 8).map((image, index) => (
                                    <img
                                        key={index}
                                        src={image || "/placeholder.svg"}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-full h-8 sm:h-12 lg:h-16 object-cover rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${selectedImage === index
                                            ? "ring-1 sm:ring-2 ring-green-500 ring-offset-1 sm:ring-offset-2"
                                            : "hover:ring-1 sm:hover:ring-2 hover:ring-green-300 hover:ring-offset-1"
                                            }`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Fixed Author Card */}
                        {/*<div className="mt-2 sm:mt-6 flex-shrink-0">*/}
                        {/*    <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">*/}
                        {/*        <CardContent className="p-2 sm:p-4">*/}
                        {/*            <div className="flex items-center gap-2 sm:gap-3">*/}
                        {/*                <img*/}
                        {/*                    src={productData.authorImage || "/placeholder.svg"}*/}
                        {/*                    alt={productData.author}*/}
                        {/*                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover ring-1 sm:ring-2 ring-green-200"*/}
                        {/*                />*/}
                        {/*                <div className="flex-1 min-w-0">*/}
                        {/*                    <div className="flex items-center gap-1 sm:gap-2">*/}
                        {/*                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />*/}
                        {/*                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">*/}
                        {/*  {productData.author}*/}
                        {/*</span>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="flex items-center gap-1 sm:gap-2 mt-1">*/}
                        {/*                        <Clock className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500 flex-shrink-0" />*/}
                        {/*                        <span className="text-xs text-gray-600 truncate">Responds in {productData.responseTime}</span>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="text-xs text-gray-500 mt-1">Author</div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*</div>*/}
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 flex flex-col order-1 lg:order-2 min-h-0">
                        {/* Header */}


                        {/* Content with Fixed Height */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                                <div className="px-3 sm:px-6 py-2 sm:py-4 border-b bg-gray-50 flex-shrink-0">
                                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-white text-xs sm:text-sm h-8 sm:h-10">
                                        <TabsTrigger
                                            value="overview"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1 sm:px-3"
                                        >
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="features"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1 sm:px-3"
                                        >
                                            Features
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="technical"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1 sm:px-3"
                                        >
                                            Technical
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="access"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1 sm:px-3 col-span-3 sm:col-span-1"
                                        >
                                            Access
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="support"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1 sm:px-3 hidden sm:inline-flex"
                                        >
                                            Support
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="stats"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1 sm:px-3 hidden sm:inline-flex"
                                        >
                                            Stats
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Mobile Additional Tabs */}
                                    <div className="sm:hidden mt-2">
                                        <TabsList className="grid w-full grid-cols-2 bg-white text-xs h-8">
                                            <TabsTrigger
                                                value="support"
                                                className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1"
                                            >
                                                Support
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="stats"
                                                className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-1"
                                            >
                                                Stats
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>

                                {/* Fixed Height Scrollable Content */}
                                <div className="flex-1 min-h-0">
                                    <ScrollArea className="h-full">
                                        <div className="p-3 sm:p-6 min-h-[400px]">
                                            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
                                                {/* Overview */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Product Overview
                                                    </h2>
                                                    <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                                                        <p className="whitespace-pre-line leading-relaxed">{productData.overview}</p>
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Quick Info Grid */}
                                                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                            <Code className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                            Built With
                                                        </h3>
                                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                                            {productData.builtWith.map((tech, index) => (
                                                                <Badge key={index} className="bg-green-500 text-white text-xs">
                                                                    {tech}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                            Suitable For
                                                        </h3>
                                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                                            {productData.suitableFor.map((item, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="border-green-200 text-green-700 text-xs"
                                                                >
                                                                    {item}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Additional Product Info */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Product Information
                                                    </h2>
                                                    <div className="grid grid-cols-1 gap-3 sm:gap-6">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                <span className="text-gray-700 font-medium text-sm">Product ID:</span>
                                                                <code className="text-xs sm:text-sm bg-white px-2 py-1 rounded text-green-700 break-all">
                                                                    {productData.id}
                                                                </code>
                                                            </div>
                                                            <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                <span className="text-gray-700 font-medium text-sm">Category:</span>
                                                                <Badge className="bg-green-500 text-white text-xs">{productData.isCategory}</Badge>
                                                            </div>
                                                            <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                <span className="text-gray-700 font-medium text-sm">Sell Type:</span>
                                                                <span className="font-medium text-gray-900 text-sm">{productData.sellType}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                <span className="text-gray-700 font-medium text-sm">License:</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {productData.license}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </TabsContent>

                                            <TabsContent value="features" className="space-y-4 sm:space-y-6 mt-0">
                                                {/* Features */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Key Features
                                                    </h2>
                                                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                                                        {productData.features.map((feature, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg"
                                                            >
                                                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                                                <span className="text-gray-700 font-medium text-sm sm:text-base">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Tags */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Tags
                                                    </h2>
                                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                                        {productData.tags.map((tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors text-xs"
                                                            >
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </section>
                                            </TabsContent>

                                            <TabsContent value="technical" className="space-y-4 sm:space-y-6 mt-0">
                                                {/* Technical Details */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Technical Specifications
                                                    </h2>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                        <Card className="border-green-200">
                                                            <CardContent className="p-3 sm:p-4">
                                                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                                                                    Compatibility
                                                                </h3>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600 text-sm">Browser Support:</span>
                                                                        <span className="font-medium text-sm">{productData.compatibleBrowsers}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600 text-sm">Layout:</span>
                                                                        <span className="font-medium text-sm">{productData.layout}</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        <Card className="border-green-200">
                                                            <CardContent className="p-3 sm:p-4">
                                                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                                                                    Release Information
                                                                </h3>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600 text-sm">Released:</span>
                                                                        <span className="font-medium text-sm">{formatDate(productData.releaseDate)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600 text-sm">Last Update:</span>
                                                                        <span className="font-medium text-sm">{formatDate(productData.lastUpdate)}</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Built With Details */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Technology Stack
                                                    </h2>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                                        {productData.builtWith.map((tech, index) => (
                                                            <Card key={index} className="border-green-200 text-center">
                                                                <CardContent className="p-3 sm:p-4">
                                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                        <Code className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                                                                    </div>
                                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{tech}</div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </section>
                                            </TabsContent>

                                            <TabsContent value="access" className="space-y-4 sm:space-y-6 mt-0">
                                                {/* Access Information */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Login Credentials
                                                    </h2>
                                                    <div className="space-y-3 sm:space-y-4">
                                                        {productData.loginDetails.map((login, index) => (
                                                            <Card key={index} className="border-green-200">
                                                                <CardContent className="p-3 sm:p-4">
                                                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                            {login.description}
                                                                        </span>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                                        <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                            <span className="text-xs sm:text-sm text-gray-600 block mb-1">Username:</span>
                                                                            <code className="bg-white px-2 sm:px-3 py-1 sm:py-2 rounded text-green-700 font-medium block text-xs sm:text-sm break-all">
                                                                                {login.username}
                                                                            </code>
                                                                        </div>
                                                                        <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                            <span className="text-xs sm:text-sm text-gray-600 block mb-1">Password:</span>
                                                                            <code className="bg-white px-2 sm:px-3 py-1 sm:py-2 rounded text-green-700 font-medium block text-xs sm:text-sm">
                                                                                {login.password}
                                                                            </code>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Installation Instructions */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Installation Guide
                                                    </h2>
                                                    <Card className="border-green-200">
                                                        <CardContent className="p-3 sm:p-4">
                                                            <div className="text-xs sm:text-sm whitespace-pre-line text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg leading-relaxed">
                                                                {productData.downloadInstructions}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </section>
                                            </TabsContent>

                                            <TabsContent value="support" className="space-y-4 sm:space-y-6 mt-0">
                                                {/* Support & Contact */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Contact & Support
                                                    </h2>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                        <Card className="border-green-200">
                                                            <CardContent className="p-3 sm:p-4">
                                                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                                    Contact Information
                                                                </h3>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    {productData.preferredContact.map((contact, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg"
                                                                        >
                                                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                                                            <span className="font-medium text-gray-700 text-sm">{contact.type}:</span>
                                                                            <span className="text-gray-600 text-sm break-all">{contact.value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        <Card className="border-green-200">
                                                            <CardContent className="p-3 sm:p-4">
                                                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                                    Support Options
                                                                </h3>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    {sortedSupportSettings.map((help, index) => (
                                                                        <div key={index} className="p-2 sm:p-3 bg-green-50 rounded-lg">
                                                                            <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                                                <span className="font-semibold text-gray-900 capitalize text-sm">
                                                                                    {help.type} Support
                                                                                </span>
                                                                            </div>
                                                                            <div className="ml-4 sm:ml-6 space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs sm:text-sm text-gray-600">Duration:</span>
                                                                                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                                                        {helpDurationLabels[help.duration]}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs sm:text-sm text-gray-600">Fee:</span>
                                                                                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                                                        {help.feeUSD === 0 && help.feeNGN === 0 ? (
                                                                                            <Badge
                                                                                                variant="outline"
                                                                                                className="text-green-600 border-green-300 text-xs"
                                                                                            >
                                                                                                Free
                                                                                            </Badge>
                                                                                        ) : (
                                                                                            `$${help.feeUSD} / ₦${help.feeNGN.toLocaleString()}`
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Author Information */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Author Details
                                                    </h2>
                                                    <Card className="border-green-200">
                                                        <CardContent className="p-4 sm:p-6">
                                                            <div className="flex items-center gap-3 sm:gap-4">
                                                                <img
                                                                    src={productData.authorImage || "/placeholder.svg"}
                                                                    alt={productData.author}
                                                                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 sm:ring-4 ring-green-200"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                                        <span className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                                                            {productData.author}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                                                        <span className="text-gray-600 text-sm sm:text-base">
                                                                            Responds within {productData.responseTime}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </section>
                                            </TabsContent>

                                            <TabsContent value="stats" className="space-y-4 sm:space-y-6 mt-0">
                                                {/* Market Data & Stats */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Market Statistics
                                                    </h2>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                                        <Card className="border-green-200 text-center">
                                                            <CardContent className="p-4 sm:p-6">
                                                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                                                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                                                                </div>
                                                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                                                                    {productData.marketData.rating || "N/A"}
                                                                </div>
                                                                <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
                                                            </CardContent>
                                                        </Card>
                                                        <Card className="border-green-200 text-center">
                                                            <CardContent className="p-4 sm:p-6">
                                                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                                                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                                                                </div>
                                                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                                                                    {productData.marketData.reviews}
                                                                </div>
                                                                <div className="text-xs sm:text-sm text-gray-600">Total Reviews</div>
                                                            </CardContent>
                                                        </Card>
                                                        <Card className="border-green-200 text-center">
                                                            <CardContent className="p-4 sm:p-6">
                                                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                                                    <Download className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                                                                </div>
                                                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                                                                    {productData.marketData.sales}
                                                                </div>
                                                                <div className="text-xs sm:text-sm text-gray-600">Total Sales</div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </section>

                                                <Separator />

                                                {/* Performance Metrics */}
                                                <section>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                        <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                        Performance Metrics
                                                    </h2>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                        <Card className="border-green-200">
                                                            <CardContent className="p-3 sm:p-4">
                                                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                                                                    Engagement
                                                                </h3>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600 text-sm">Views:</span>
                                                                        <span className="font-medium text-sm">Coming Soon</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600 text-sm">Downloads:</span>
                                                                        <span className="font-medium text-sm">Coming Soon</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        <Card className="border-green-200">
                                                            <CardContent className="p-3 sm:p-4">
                                                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                                                                    Timeline
                                                                </h3>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600 text-sm">First Release:</span>
                                                                        <span className="font-medium text-sm">{formatDate(productData.releaseDate)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600 text-sm">Last Updated:</span>
                                                                        <span className="font-medium text-sm">{formatDate(productData.lastUpdate)}</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </section>
                                            </TabsContent>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </Tabs>
                        </div>

                        {/* Action Footer */}
                        <div className="p-3 sm:p-6 border-t bg-gradient-to-r from-green-50 to-white flex-shrink-0">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <Button
                                    className="bg-green-500 hover:bg-green-600 text-white flex-1 h-10 sm:h-12 text-sm sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                    asChild
                                >
                                    <a href={productData.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        Test Demo
                                    </a>
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
