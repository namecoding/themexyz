"use client"

import { useState } from "react"
import { X, Star, MapPin, Calendar, Award, MessageCircle, Globe, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface AuthorProduct {
    id: string
    title: string
    category: string
    price: { usd: number; ngn: number }
    image: string
    rating: number
    sales: number
    featured: boolean
    tags: string[]
}

interface AuthorData {
    id: string
    name: string
    username: string
    avatar: string
    coverImage: string
    title: string
    bio: string
    location: string
    joinDate: string
    website: string
    skills: string[]
    achievements: Array<{
        title: string
        description: string
        icon: string
        date: string
    }>
    stats: {
        totalProducts: number
        totalSales: number
        averageRating: number
        totalReviews: number
        responseTime: string
        completionRate: number
    }
    contact: Array<{
        type: string
        value: string
        icon: string
    }>
    products: AuthorProduct[]
    reviews: Array<{
        id: string
        customerName: string
        customerAvatar: string
        rating: number
        comment: string
        date: string
        productTitle: string
    }>
    ratingBreakdown: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
}

interface AuthorProfileModalProps {
    isOpen: boolean
    onClose: () => void
    authorData: AuthorData
}

export default function AuthorProfileModal({ isOpen, onClose, authorData }: AuthorProfileModalProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("newest")

    if (!isOpen) return null

    const categories = ["all", ...Array.from(new Set(authorData.products.map((p) => p.category)))]

    const filteredProducts = authorData.products.filter(
        (product) => selectedCategory === "all" || product.category === selectedCategory,
    )

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price.usd - b.price.usd
            case "price-high":
                return b.price.usd - a.price.usd
            case "rating":
                return b.rating - a.rating
            case "sales":
                return b.sales - a.sales
            default:
                return 0 // newest - would need actual dates
        }
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getRatingPercentage = (rating: number) => {
        const total = Object.values(authorData.ratingBreakdown).reduce((sum, count) => sum + count, 0)
        return total > 0 ? (authorData.ratingBreakdown[rating as keyof typeof authorData.ratingBreakdown] / total) * 100 : 0
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0">
            {/* Fixed Height Modal Container - Bottomsheet Style */}
            <div className="relative w-full max-w-7xl h-[95vh] bg-white rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-300">
                {/* Header with Cover Image */}
                <div className="relative h-32 sm:h-48 bg-gradient-to-r from-green-400 via-green-500 to-green-600 overflow-hidden">
                    {authorData.coverImage && (
                        <img
                            src={authorData.coverImage || "/placeholder.svg"}
                            alt="Cover"
                            className="w-full h-full object-cover opacity-30"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-green-600/80" />

                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 hover:bg-white/20 text-white h-8 w-8 sm:h-10 sm:w-10"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    {/* Author Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                            <Avatar className="w-16 h-16 sm:w-24 sm:h-24 ring-4 ring-white shadow-lg">
                                <AvatarImage src={authorData.avatar || "/placeholder.svg"} alt={authorData.name} />
                                <AvatarFallback className="bg-green-100 text-green-600 text-lg sm:text-2xl font-bold">
                                    {authorData.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-white">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                    <h1 className="text-xl sm:text-3xl font-bold">{authorData.name}</h1>
                                    <Badge className="bg-white/20 text-white border-white/30 w-fit">@{authorData.username}</Badge>
                                </div>
                                <p className="text-green-100 text-sm sm:text-base mb-2">{authorData.title}</p>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-green-100">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {authorData.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Joined {formatDate(authorData.joinDate)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                                        {authorData.stats.averageRating.toFixed(1)} ({authorData.stats.totalReviews} reviews)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drag Handle */}
                <div className="flex justify-center py-2 bg-white">
                    <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col" style={{ height: "calc(90vh - 12rem)" }}>
                    <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50 flex-shrink-0">
                            <TabsList className="grid w-full grid-cols-3 bg-white text-xs sm:text-sm h-8 sm:h-10">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="portfolio"
                                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                >
                                    Other Projects
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                >
                                    Reviews
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Fixed Height Scrollable Content */}
                        <div className="flex-1 min-h-0">
                            <ScrollArea className="h-full">
                                <div className="p-4 sm:p-6">
                                    <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
                                        {/* Stats Cards */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                            <Card className="border-green-200">
                                                <CardContent className="p-3 sm:p-4 text-center">
                                                    <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                                                        {authorData.stats.totalProducts}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-600">Products</div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-green-200">
                                                <CardContent className="p-3 sm:p-4 text-center">
                                                    <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                                                        {authorData.stats.totalSales}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-600">Sales</div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-green-200">
                                                <CardContent className="p-3 sm:p-4 text-center">
                                                    <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                                                        {authorData.stats.averageRating.toFixed(1)}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-600">Rating</div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-green-200">
                                                <CardContent className="p-3 sm:p-4 text-center">
                                                    <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                                                        {authorData.stats.completionRate}%
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-600">Completion</div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* About Section */}
                                        <section>
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                About
                                            </h2>
                                            <Card className="border-green-200">
                                                <CardContent className="p-4 sm:p-6">
                                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">{authorData.bio}</p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MessageCircle className="w-4 h-4 text-green-600" />
                                                        <span>Responds within {authorData.stats.responseTime}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </section>

                                        {/* Skills */}
                                        <section>
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                Skills & Expertise
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
                                                {authorData.skills.map((skill, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="bg-green-100 text-green-800 text-xs sm:text-sm"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Achievements */}
                                        <section>
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                Achievements
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                {authorData.achievements.map((achievement, index) => (
                                                    <Card key={index} className="border-green-200">
                                                        <CardContent className="p-3 sm:p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                                                                        {achievement.title}
                                                                    </h3>
                                                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{achievement.description}</p>
                                                                    <div className="text-xs text-gray-500">{formatDate(achievement.date)}</div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </section>
                                    </TabsContent>

                                    <TabsContent value="portfolio" className="space-y-4 sm:space-y-6 mt-0">
                                        {/* Portfolio Controls */}
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                >
                                                    {categories.map((category) => (
                                                        <option key={category} value={category}>
                                                            {category === "all" ? "All Categories" : category}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                >
                                                    <option value="newest">Newest First</option>
                                                    <option value="price-low">Price: Low to High</option>
                                                    <option value="price-high">Price: High to Low</option>
                                                    <option value="rating">Highest Rated</option>
                                                    <option value="sales">Best Selling</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant={viewMode === "grid" ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setViewMode("grid")}
                                                    className={viewMode === "grid" ? "bg-green-500 hover:bg-green-600" : ""}
                                                >
                                                    <Grid className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={viewMode === "list" ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setViewMode("list")}
                                                    className={viewMode === "list" ? "bg-green-500 hover:bg-green-600" : ""}
                                                >
                                                    <List className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Products Grid/List */}
                                        <div
                                            className={
                                                viewMode === "grid"
                                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                                                    : "space-y-4"
                                            }
                                        >
                                            {sortedProducts.map((product) => (
                                                <Card key={product.id} className="border-green-200 hover:shadow-lg transition-shadow">
                                                    <div className={viewMode === "grid" ? "" : "flex gap-4"}>
                                                        <div className={`relative ${viewMode === "grid" ? "" : "w-32 h-24 flex-shrink-0"}`}>
                                                            <img
                                                                src={product.image || "/placeholder.svg"}
                                                                alt={product.title}
                                                                className={`object-cover rounded-t-lg ${
                                                                    viewMode === "grid" ? "w-full h-48" : "w-full h-full rounded-l-lg rounded-t-none"
                                                                }`}
                                                            />
                                                            {product.featured && (
                                                                <div className="absolute top-2 left-2">
                                                                    <Badge className="bg-green-500 text-white text-xs">
                                                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                                                        Featured
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <CardContent className={`p-3 sm:p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                                                            <div className="flex items-start justify-between mb-2">
                                                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                                                    {product.category}
                                                                </Badge>
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                                                                    <span className="text-xs text-gray-600">{product.rating}</span>
                                                                </div>
                                                            </div>

                                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                                                                {product.title}
                                                            </h3>

                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                {product.tags.slice(0, 3).map((tag, index) => (
                                                                    <Badge key={index} variant="outline" className="text-xs">
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-lg font-bold text-green-600">${product.price.usd}</span>
                                                                    <span className="text-sm text-gray-500">₦{product.price.ngn.toLocaleString()}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500">{product.sales} sales</div>
                                                            </div>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>

                                        {sortedProducts.length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="text-gray-500 mb-2">No products found</div>
                                                <div className="text-sm text-gray-400">Try adjusting your filters</div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="reviews" className="space-y-4 sm:space-y-6 mt-0">
                                        {/* Rating Overview */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                            <Card className="border-green-200">
                                                <CardContent className="p-4 sm:p-6 text-center">
                                                    <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                                                        {authorData.stats.averageRating.toFixed(1)}
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1 mb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-4 h-4 ${
                                                                    star <= authorData.stats.averageRating
                                                                        ? "fill-current text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Based on {authorData.stats.totalReviews} reviews</div>
                                                </CardContent>
                                            </Card>

                                            <Card className="lg:col-span-2 border-green-200">
                                                <CardContent className="p-4 sm:p-6">
                                                    <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                                                    <div className="space-y-3">
                                                        {[5, 4, 3, 2, 1].map((rating) => (
                                                            <div key={rating} className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1 w-12">
                                                                    <span className="text-sm">{rating}</span>
                                                                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                                                                </div>
                                                                <Progress value={getRatingPercentage(rating)} className="flex-1 h-2" />
                                                                <span className="text-sm text-gray-600 w-12 text-right">
                                  {authorData.ratingBreakdown[rating as keyof typeof authorData.ratingBreakdown]}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Reviews List */}
                                        <section>
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full"></div>
                                                Customer Reviews
                                            </h2>
                                            <div className="space-y-4">
                                                {authorData.reviews.map((review) => (
                                                    <Card key={review.id} className="border-green-200">
                                                        <CardContent className="p-4 sm:p-6">
                                                            <div className="flex items-start gap-3 sm:gap-4">
                                                                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                                                                    <AvatarImage
                                                                        src={review.customerAvatar || "/placeholder.svg"}
                                                                        alt={review.customerName}
                                                                    />
                                                                    <AvatarFallback className="bg-green-100 text-green-600 text-xs sm:text-sm">
                                                                        {review.customerName
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                      {review.customerName}
                                    </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex items-center gap-1">
                                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                                    <Star
                                                                                        key={star}
                                                                                        className={`w-3 h-3 ${
                                                                                            star <= review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                                                                                        }`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                            <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-gray-700 text-sm sm:text-base mb-2 leading-relaxed">
                                                                        {review.comment}
                                                                    </p>

                                                                    <div className="text-xs text-gray-500">Product: {review.productTitle}</div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </section>
                                    </TabsContent>
                                </div>
                            </ScrollArea>
                        </div>
                    </Tabs>
                </div>

            </div>
        </div>
    )
}
