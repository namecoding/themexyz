"use client"

import {useEffect, useState} from "react"
import {
  X,
  Star,
  Clock,
  Package,
  ShoppingCart,
  Headphones,
  MessageSquare,
  User,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Reply,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FeedbackItem } from "@/components/admin/types/admin"

interface FeedbackReviewModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: FeedbackItem | null
  onUpdate: (feedbackId: string, status: "reviewed" | "resolved", response?: string) => void
}

export default function FeedbackReviewModal({ isOpen, onClose, feedback, onUpdate }: FeedbackReviewModalProps) {
  const [adminResponse, setAdminResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Disable background scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll
      document.body.style.overflow = '';
    }

    // Cleanup in case the component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !feedback) return null

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
        return <Package className="w-5 h-5 text-blue-600" />
      case "purchase":
        return <ShoppingCart className="w-5 h-5 text-green-600" />
      case "support":
        return <Headphones className="w-5 h-5 text-orange-600" />
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const handleSubmitResponse = async (status: "reviewed" | "resolved") => {
    if (!adminResponse.trim()) {
      alert("Please provide an admin response before submitting.")
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onUpdate(feedback.id, status, adminResponse)
      setAdminResponse("")
    } catch (error) {
      console.error("Error submitting response:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              {getTypeIcon(feedback.type)}
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer Feedback Review</h2>
                <p className="text-sm text-gray-600">Review and respond to customer feedback</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6 pb-32">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={feedback.customerAvatar || "/placeholder.svg"} alt={feedback.customerName} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {feedback.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{feedback.customerName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{feedback.customerEmail}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(feedback.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(feedback.type)}
                          {getStatusBadge(feedback.status)}
                          {getPriorityBadge(feedback.priority)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Feedback Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
                      <div className="flex items-center gap-2">
                        {getRatingStars(feedback.rating)}
                        <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Comment</label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{feedback.comment}</p>
                      </div>
                    </div>

                    {/* Product Information */}
                    {feedback.productTitle && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Related Product</label>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="font-medium text-blue-900">{feedback.productTitle}</p>
                          </div>
                        </div>
                    )}

                    {/* Order Information */}
                    {feedback.orderId && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Order/Ticket ID</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <code className="text-sm font-mono text-gray-900">{feedback.orderId}</code>
                          </div>
                        </div>
                    )}

                    {/* Priority and Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                        <div className="flex items-center gap-2">
                          {feedback.priority === "high" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {feedback.priority === "medium" && <Clock className="w-4 h-4 text-orange-500" />}
                          {feedback.priority === "low" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          <span className="capitalize text-gray-900">{feedback.priority}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Current Status</label>
                        <span className="capitalize text-gray-900">{feedback.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Previous Response */}
                {feedback.response && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Reply className="w-5 h-5" />
                          Previous Admin Response
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-purple-900 whitespace-pre-wrap">{feedback.response}</p>
                          {feedback.reviewedBy && feedback.reviewedAt && (
                              <div className="mt-3 pt-3 border-t border-purple-200">
                                <p className="text-sm text-purple-700">
                                  Responded by {feedback.reviewedBy} on {formatDate(feedback.reviewedAt)}
                                </p>
                              </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                )}

                {/* Admin Response */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Reply className="w-5 h-5" />
                      Admin Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="adminResponse" className="text-sm font-medium text-gray-700 mb-2 block">
                          Your Response <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="adminResponse"
                            placeholder="Provide your response to the customer..."
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            className="min-h-[120px] resize-none"
                            required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6 flex items-center justify-between flex-shrink-0">
            <div className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Admin response is required before submitting
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              {feedback.status === "pending" && (
                  <Button
                      onClick={() => handleSubmitResponse("reviewed")}
                      disabled={isSubmitting || !adminResponse.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Mark as Reviewed"}
                  </Button>
              )}
              <Button
                  onClick={() => handleSubmitResponse("resolved")}
                  disabled={isSubmitting || !adminResponse.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isSubmitting ? "Submitting..." : "Mark as Resolved"}
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}
