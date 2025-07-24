"use client"

import { useState } from "react"
import {
    Package,
    Search,
    Eye,
    ExternalLink,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Star,
    Calendar,
    Code,
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Product } from "@/components/admin/types/admin"
import { sampleProducts } from "@/components/admin/data/admin-data"
import ProductVerificationModal from "@/components/admin/product-verification-modal"

interface ContentAdminDashboardProps {
    currentUser: any
    onClose?: () => void
}

export default function ContentAdminDashboard({ currentUser, onClose }: ContentAdminDashboardProps) {
    const [products, setProducts] = useState<Product[]>(sampleProducts)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.isCategory.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "pending" && !product.isPublic && product.isPublished) ||
            (statusFilter === "approved" && product.isPublic) ||
            (statusFilter === "draft" && !product.isPublished)

        return matchesSearch && matchesStatus
    })

    const handleVerifyProduct = (product: Product) => {
        setSelectedProduct(product)
        setIsVerificationModalOpen(true)
    }

    const handleProductVerification = (productId: string, status: "approved" | "rejected", notes?: string) => {
        setProducts(
            products.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        isPublic: status === "approved",
                        verificationStatus: status,
                        verificationNotes: notes,
                        verifiedBy: currentUser.name,
                        verifiedAt: new Date().toISOString(),
                    }
                    : product,
            ),
        )
        setIsVerificationModalOpen(false)
        setSelectedProduct(null)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusBadge = (product: Product) => {
        if (!product.isPublished) {
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    Draft
                </Badge>
            )
        }
        if (product.isPublic) {
            return <Badge className="bg-green-100 text-green-800">Approved</Badge>
        }
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
    }

    const getPriorityColor = (product: Product) => {
        if (!product.isPublished) return "border-l-gray-400"
        if (product.isPublic) return "border-l-green-400"

        // Check if urgent based on submission date
        const daysSinceSubmission = Math.floor(
            (Date.now() - new Date(product.lastUpdate).getTime()) / (1000 * 60 * 60 * 24),
        )

        if (daysSinceSubmission > 3) return "border-l-red-400"
        if (daysSinceSubmission > 1) return "border-l-orange-400"
        return "border-l-yellow-400"
    }

    const pendingProducts = products.filter((p) => p.isPublished && !p.isPublic)
    const approvedProducts = products.filter((p) => p.isPublic)
    const draftProducts = products.filter((p) => !p.isPublished)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose || (() => window.history.back())}
                                className="mr-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Package className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Content Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Product verification and content management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                    {currentUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                                <div className="text-xs text-blue-600">Content Admin</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">{pendingProducts.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-green-600">{approvedProducts.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Product Management
                            </CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Products</option>
                                    <option value="pending">Pending Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="draft">Drafts</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className={`border-l-4 ${getPriorityColor(product)} hover:shadow-md transition-shadow`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={product.galleryImages[0] || "/placeholder.svg"}
                                                        alt={product.title}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="text-sm font-semibold text-gray-900 mb-1">{product.title}</h3>
                                                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                                                    <Badge variant="outline">{product.isCategory}</Badge>
                                                                    <span>
                                    ${product.priceUSD} / ₦{product.priceNGN.toLocaleString()}
                                  </span>
                                                                    <span>by {product.author}</span>
                                                                </div>
                                                            </div>
                                                            {getStatusBadge(product)}
                                                        </div>

                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span className="text-sm">Updated: {formatDate(product.lastUpdate)}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleVerifyProduct(product)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Review
                                                </Button>

                                                {product.demoUrl && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        className="flex items-center gap-2 bg-transparent"
                                                    >
                                                        <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-4 h-4" />
                                                            Demo
                                                        </a>
                                                    </Button>
                                                )}

                                            </div>
                                        </div>

                                        {product.verificationNotes && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertTriangle className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm font-medium text-gray-900">Verification Notes:</span>
                                                </div>
                                                <p className="text-sm text-gray-700">{product.verificationNotes}</p>
                                                {product.verifiedBy && product.verifiedAt && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        By {product.verifiedBy} on {formatDate(product.verifiedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Product Verification Modal */}
            <ProductVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => {
                    setIsVerificationModalOpen(false)
                    setSelectedProduct(null)
                }}
                product={selectedProduct}
                onVerify={handleProductVerification}
            />
        </div>
    )
}
