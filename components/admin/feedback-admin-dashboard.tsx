"use client"

import { useState } from "react"
import {
    MessageSquare,
    Search,
    Eye,
    Star,
    Clock,
    CheckCircle,
    AlertTriangle,
    Package,
    ShoppingCart,
    Headphones,
    Reply,
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, FeedbackItem } from "@/components/admin/types/admin"
import { sampleFeedback } from "@/components/admin/data/admin-data"
import FeedbackReviewModal from "@/components/admin/feedback-review-modal"

interface FeedbackAdminDashboardProps {
    currentUser: User
    onClose?: () => void
}

export default function FeedbackAdminDashboard({ currentUser, onClose }: FeedbackAdminDashboardProps) {
    const [feedback, setFeedback] = useState<FeedbackItem[]>(sampleFeedback)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredFeedback = feedback.filter((item) => {
        const matchesSearch =
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.productTitle && item.productTitle.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesType = typeFilter === "all" || item.type === typeFilter
        const matchesStatus = statusFilter === "all" || item.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const handleReviewFeedback = (feedbackItem: FeedbackItem) => {
        setSelectedFeedback(feedbackItem)
        setIsModalOpen(true)
    }

    const handleFeedbackUpdate = (feedbackId: string, status: "reviewed" | "resolved", response?: string) => {
        setFeedback(
            feedback.map((item) =>
                item.id === feedbackId
                    ? {
                        ...item,
                        status,
                        response,
                        reviewedBy: currentUser.name,
                        reviewedAt: new Date().toISOString(),
                    }
                    : item,
            ),
        )
        setIsModalOpen(false)
        setSelectedFeedback(null)
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "product":
                return <Package className="w-4 h-4" />
            case "purchase":
                return <ShoppingCart className="w-4 h-4" />
            case "support":
                return <Headphones className="w-4 h-4" />
            default:
                return <MessageSquare className="w-4 h-4" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "product":
                return <Badge className="bg-blue-100 text-blue-800">Product Review</Badge>
            case "purchase":
                return <Badge className="bg-green-100 text-green-800">Purchase Feedback</Badge>
            case "support":
                return <Badge className="bg-orange-100 text-orange-800">Support Feedback</Badge>
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "resolved":
                return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
            case "reviewed":
                return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>
            default:
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "border-l-red-400"
            case "medium":
                return "border-l-orange-400"
            case "low":
                return "border-l-green-400"
            default:
                return "border-l-gray-400"
        }
    }

    const getRatingStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} />
        ))
    }

    const pendingFeedback = feedback.filter((item) => item.status === "pending")
    const reviewedFeedback = feedback.filter((item) => item.status === "reviewed")
    const resolvedFeedback = feedback.filter((item) => item.status === "resolved")
    const highPriorityFeedback = feedback.filter((item) => item.priority === "high" && item.status === "pending")

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
                            <MessageSquare className="w-8 h-8 text-purple-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Feedback Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Manage customer feedback and reviews</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                                    {currentUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                                <div className="text-xs text-purple-600">Feedback Admin</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">{pendingFeedback.length}</p>
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
                                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                                    <p className="text-2xl font-bold text-red-600">{highPriorityFeedback.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Reviewed</p>
                                    <p className="text-2xl font-bold text-blue-600">{reviewedFeedback.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                                    <p className="text-2xl font-bold text-green-600">{resolvedFeedback.length}</p>
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
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <MessageSquare className="w-5 h-5" />
                                Customer Feedback
                            </CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search feedback..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="product">Product Reviews</option>
                                    <option value="purchase">Purchase Feedback</option>
                                    <option value="support">Support Feedback</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredFeedback.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`border-l-4 ${getPriorityColor(item.priority)} hover:shadow-md transition-shadow`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={item.customerAvatar || "/placeholder.svg"} alt={item.customerName} />
                                                    <AvatarFallback className="bg-purple-100 text-purple-600">
                                                        {item.customerName
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 mb-1">{item.customerName}</h3>
                                                            <p className="text-sm text-gray-600 mb-2">{item.customerEmail}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getTypeBadge(item.type)}
                                                            {getStatusBadge(item.status)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getRatingStars(item.rating)}
                                                        <span className="text-sm text-gray-600">({item.rating}/5)</span>
                                                    </div>

                                                    <p className="text-gray-700 mb-3 line-clamp-2">{item.comment}</p>

                                                    {item.productTitle && (
                                                        <div className="mb-3">
                                                            <span className="text-sm text-gray-600">Product: </span>
                                                            <span className="text-sm font-medium text-gray-900">{item.productTitle}</span>
                                                        </div>
                                                    )}

                                                    {item.orderId && (
                                                        <div className="mb-3">
                                                            <span className="text-sm text-gray-600">Order ID: </span>
                                                            <code className="text-sm bg-gray-100 px-1 rounded">{item.orderId}</code>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatDate(item.createdAt)}</span>
                                                        </div>
                                                        <Badge
                                                            className={
                                                                item.priority === "high"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : item.priority === "medium"
                                                                        ? "bg-orange-100 text-orange-800"
                                                                        : "bg-green-100 text-green-800"
                                                            }
                                                        >
                                                            {item.priority} priority
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReviewFeedback(item)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Review
                                                </Button>

                                                {item.status === "pending" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleFeedbackUpdate(item.id, "reviewed")}
                                                        className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
                                                    >
                                                        <Reply className="w-4 h-4" />
                                                        Respond
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {item.response && (
                                            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Reply className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-purple-900">Admin Response:</span>
                                                </div>
                                                <p className="text-sm text-purple-800">{item.response}</p>
                                                {item.reviewedBy && item.reviewedAt && (
                                                    <p className="text-xs text-purple-600 mt-1">
                                                        By {item.reviewedBy} on {formatDate(item.reviewedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {filteredFeedback.length === 0 && (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feedback Review Modal */}
            <FeedbackReviewModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedFeedback(null)
                }}
                feedback={selectedFeedback}
                onUpdate={handleFeedbackUpdate}
            />
        </div>
    )
}
