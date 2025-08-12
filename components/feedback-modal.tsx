"use client"

import { useEffect, useState } from "react"
import { X, Star, Gift, CheckCircle, MessageSquare, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SERVER_PUBLIC, loyaltyPointsReward } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store/auth";

interface FeedbackData {
    productTitle?: string
    productImage?: string
    orderId?: string
    name: string
    avatar?: string
    total?: number
    currency: string
}

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    type: "purchase" | "product"
    data: FeedbackData
    onSubmit: (feedback: {
        rating: number
        review: string
        type: "purchase" | "product"
        data: FeedbackData
        point: string
    }) => void
    userData: any
}

export default function FeedbackModal({ isOpen, onClose, type, data, onSubmit, userData }: FeedbackModalProps) {
    const { isLoggedIn, setIsLoggedIn, user, setUser, token } = useAuthStore()
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [review, setReview] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async () => {
        if (rating === 0) return;

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token expired or no active login session');
            // Optionally show a message or redirect to login
            return;
        }

        setIsSubmitting(true);

        const payload = {
            rating,
            review,
            type,
            data,
            currency: data.currency,
            point: getPointsReward()
        };

        try {
            const res = await fetch(`${SERVER_PUBLIC}/auth/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const responseData = await res.json();
            //console.log('Server response:', responseData);

            if (responseData.success && responseData.user) {
                setUser({
                    ...responseData.user,
                    avatar: responseData.user.avatar || "/placeholder.svg?height=40&width=40",
                });
            } else {
                toast.error(responseData.message || "Something went wrong");

                setIsSubmitted(true);
            }

        } catch (error) {
            //console.error('Error submitting feedback:', error.message);
            // Optionally notify the user
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleClose = () => {
        setRating(0)
        setHoveredRating(0)
        setReview("")
        setIsSubmitting(false)
        setIsSubmitted(false)
        onClose()
    }

    const getPointsReward = () => {
        if (type === "purchase") {
            const total = data.total || 0;
            const isUSD = data.currency === "USD";

            // Use different reward rates for each currency
            const rewardRate = isUSD ? loyaltyPointsReward.USD : loyaltyPointsReward.NGN; // 5% for USD, 0.5% for NGN

            const rawPoints = Math.max(1, Math.round(total * rewardRate));
            return rawPoints.toLocaleString(); // e.g., "1,500"
        }

        const points = rating * 15 + (review.length > 50 ? 25 : 0);
        return points.toLocaleString();
    }

    const getTitle = () => {
        if (type === "purchase") return "Rate Your Purchase Experience"
        return "Share Your Product Review"
    }

    const getDescription = () => {
        if (type === "purchase") return "How was your overall purchasing experience with us?"
        return "Help other buyers by sharing your experience with this product"
    }

    const getIcon = () => {
        if (type === "purchase") return <ShoppingCart className="w-6 h-6 text-green-600" />
        return <Package className="w-6 h-6 text-green-600" />
    }

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-600 mb-4">Your feedback has been submitted successfully.</p>

                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Gift className="w-5 h-5 text-green-600" />
                                <span className="font-semibold text-green-800">Points Earned!</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">+{getPointsReward()} Points</div>
                            <div className="text-sm text-green-700">Added to your account</div>
                        </div>

                        <Button onClick={handleClose} className="bg-green-500 hover:bg-green-600 text-white w-full">
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-500 to-green-600 p-6 text-white flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="absolute top-4 right-4 hover:bg-white/20 text-white h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">{getIcon()}</div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">{getTitle()}</h1>
                            <p className="text-green-100 text-sm sm:text-base">{getDescription()}</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                        <div className="p-6">
                            {/* Product Info (for product reviews) */}
                            {type === "product" && data.productTitle && (
                                <Card className="border-green-200 mb-6">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {data.productImage && (
                                                <img
                                                    src={data.productImage || "/placeholder.svg"}
                                                    alt={data.productTitle}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{data.productTitle}</h3>
                                                {data.orderId && <div className="text-xs text-gray-500">Order ID: {data.orderId}</div>}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Customer Info */}
                            <div className="flex items-center gap-3 mb-6">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                                    <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                                        {userData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-gray-900 capitalize">{userData.name}</div>
                                    {/*<div className="text-sm text-gray-500">{data.total.toLocaleString()}</div>*/}
                                </div>
                            </div>

                            {/* Rating Section */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Your Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating)
                                                        ? "fill-current text-yellow-400"
                                                        : "text-gray-300 hover:text-yellow-200"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {rating === 0 && "Click to rate"}
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </div>
                            </div>

                            {/* Review Section */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Your Review
                                    <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                                </label>
                                <Textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder={
                                        type === "purchase"
                                            ? "Tell us about your purchasing experience..."
                                            : "Share your thoughts about this product..."
                                    }
                                    className="min-h-[120px] resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-gray-500">
                                        {review.length > 50 && type === "product" && (
                                            <span className="text-green-600 font-medium">+25 bonus points for detailed review!</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">{review.length}/500</div>
                                </div>
                            </div>

                            {/* Points Preview */}
                            <Card className="border-green-200 bg-green-50 mb-6">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Gift className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-green-800">Points You'll Earn</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-600">+{getPointsReward()}</div>
                                            <div className="text-xs text-green-700">
                                                {type === "purchase" ? "Purchase feedback" : "Product review"}
                                            </div>
                                        </div>
                                    </div>
                                    {type === "product" && (
                                        <div className="mt-3 text-xs text-green-700">
                                            <div>• Base points: {rating * 15}</div>
                                            {review.length > 50 && <div>• Detailed review bonus: +25</div>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Terms */}
                            <div className="text-xs text-gray-500 text-center">
                                By submitting this review, you agree to our{" "}
                                <a href="#" className="text-green-600 hover:underline">
                                    Review Guidelines
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-green-600 hover:underline">
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <div className="border-t bg-white p-6 flex-shrink-0">
                    <div className="flex flex-row flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 min-w-[40%] border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                            className="flex-1 min-w-[40%] bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Submit Review
                                </div>
                            )}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
