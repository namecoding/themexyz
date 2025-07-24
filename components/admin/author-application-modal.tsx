"use client"

import { useState, useEffect } from "react"
import {
    X,
    CheckCircle,
    XCircle,
    ExternalLink,
    Github,
    Linkedin,
    Globe,
    User,
    Star,
    Calendar,
    Mail,
    Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuthorApplication } from "@/components/admin/types/admin"
import { maskEmail, maskEmail2 } from "@/lib/utils"

interface AuthorApplicationModalProps {
    isOpen: boolean
    onClose: () => void
    application: AuthorApplication | null
    onDecision: (applicationId: string, status: "approved" | "rejected", notes: string) => void
}

export default function AuthorApplicationModal({
                                                   isOpen,
                                                   onClose,
                                                   application,
                                                   onDecision,
                                               }: AuthorApplicationModalProps) {
    const [reviewNotes, setReviewNotes] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
    
      if (isOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }

    
      return () => {
        document.body.style.overflow = ""
      }
    }, [isOpen])

    if (!isOpen || !application) return null



    const handleDecision = async (status: "approved" | "rejected") => {
        if (!reviewNotes.trim()) {
            alert("Please provide review notes before making a decision.")
            return
        }

        setIsProcessing(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        onDecision(application.userId, status, reviewNotes.trim())
        setIsProcessing(false)
        setReviewNotes("")
    }

    

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "github":
                return <Github className="w-4 h-4" />
            case "linkedin":
                return <Linkedin className="w-4 h-4" />
            default:
                return <Globe className="w-4 h-4" />
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 hover:bg-white/20 text-white h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-4 ring-white/30">
                            <AvatarImage src={application.userAvatar || "/placeholder.svg"} alt={application.userName} />
                            <AvatarFallback className="bg-white/20 text-white text-xl">
                                {application.userName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">{application.userName}</h1>
                            <p className="text-green-100 mb-2">{maskEmail(application.userEmail)}</p>
                            <div className="flex items-center gap-2">
                                <Badge
                                    className={
                                        application.status === "approved"
                                            ? "bg-green-100 text-green-800"
                                            : application.status === "rejected"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                    }
                                >
                                    {application.status}
                                </Badge>
                                <span className="text-green-100 text-sm">Applied {formatDate(application.applicationDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col h-[calc(85vh-140px)]">
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-6 mb-8">
                            {/* Quick Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-sm text-gray-600">Applicant</div>
                                        <div className="font-semibold text-gray-900">{application.userName}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-sm text-gray-600">Applied</div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(application.applicationDate).toLocaleDateString()}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <div className="text-sm text-gray-600">Specialties</div>
                                        <div className="font-semibold text-gray-900">{application.specialties.length}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <Mail className="w-5 h-5 text-green-600" />
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <p className="text-gray-900">{maskEmail(application.userEmail)}</p>
                                        </div>
                                        {application.portfolio && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 text-sm">Portfolio</label>
                                                <a
                                                    href={application.portfolio}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-600 hover:underline flex items-center gap-1"
                                                >
                                                    {application.portfolio}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Experience */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <Briefcase className="w-5 h-5 text-green-600" />
                                        Experience & Background
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">{application.experience}</p>
                                </CardContent>
                            </Card>

                            {/* Specialties */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <Star className="w-5 h-5 text-green-600" />
                                        Specialties
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {application.specialties.map((specialty, index) => (
                                            <Badge key={index} className="bg-green-100 text-green-800">
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Links */}
                            {application.socialLinks.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sm">
                                            <Globe className="w-5 h-5 text-green-600" />
                                            Social Links
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {application.socialLinks.map((link, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    {getSocialIcon(link.platform)}
                                                    <span className="font-medium text-gray-700">{link.platform}:</span>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {link.url}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Review Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-green-600 text-sm">Review Notes *</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder="Add notes about your review decision, feedback for the applicant, or any additional comments..."
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        className="min-h-[120px] resize-none"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        <span className="text-red-500">*</span> Review notes are required and will be shared with the
                                        applicant.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Previous Review */}
                            {application.reviewNotes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-gray-600">Previous Review</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-700 mb-2">{application.reviewNotes}</p>
                                            {application.reviewedBy && application.reviewedAt && (
                                                <p className="text-sm text-gray-500">
                                                    By {application.reviewedBy} on {formatDate(application.reviewedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                
                {/* Action Footer */}
                    <div className="border-t bg-white p-3 sticky bottom-0 bg-white">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                                disabled={isProcessing}
                            >
                                Close
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => handleDecision("rejected")}
                                disabled={isProcessing || !reviewNotes.trim()}
                                className="flex-1"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        Reject Application
                                    </div>
                                )}
                            </Button>

                            <Button
                                onClick={() => handleDecision("approved")}
                                disabled={isProcessing || !reviewNotes.trim()}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Approve Application
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>

            </div>
        </div>
    )
}
