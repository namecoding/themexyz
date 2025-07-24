"use client"

import { useState } from "react"
import {
    X,
    ExternalLink,
    CheckCircle,
    XCircle,
    Star,
    Calendar,
    Globe,
    Code,
    Users,
    Shield,
    AlertTriangle,
    Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Product } from "@/components/admin/types/admin"

interface ProductVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
    onVerify: (productId: string, status: "approved" | "rejected", notes?: string) => void
}

export default function ProductVerificationModal({
                                                     isOpen,
                                                     onClose,
                                                     product,
                                                     onVerify,
                                                 }: ProductVerificationModalProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [verificationNotes, setVerificationNotes] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    if (!isOpen || !product) return null

    const handleVerification = async (status: "approved" | "rejected") => {
        setIsProcessing(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        onVerify(product.id, status, verificationNotes)
        setIsProcessing(false)
        setVerificationNotes("")
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

    const formatPrice = (priceNGN: number, priceUSD: number) => {
        return `$${priceUSD} / ₦${priceNGN.toLocaleString()}`
    }

    const getStatusBadge = () => {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 hover:bg-white/20 text-white h-8 w-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold mb-1">Product Verification</h1>
                            <p className="text-blue-100 text-sm sm:text-base">Review and verify product submission</p>
                        </div>
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col h-[calc(90vh-140px)]">
                    {/* Product Info Header */}
                    <div className="p-6 border-b bg-gray-50">
                        <div className="flex items-start gap-4">
                            <img
                                src={product.galleryImages[0] || "/placeholder.svg"}
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    <Badge variant="outline">{product.isCategory}</Badge>
                                    <span className="font-semibold text-green-600">
                    {formatPrice(product.priceNGN, product.priceUSD)}
                  </span>
                                    <span>{product.sellType}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={product.authorImage || "/placeholder.svg"} alt={product.author} />
                                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                            {product.author
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-gray-600">by {product.author}</span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">Updated {formatDate(product.lastUpdate)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {product.demoUrl && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Test Demo
                                        </a>
                                    </Button>
                                )}
                                {product.adminDemoUrl && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={product.adminDemoUrl} target="_blank" rel="noopener noreferrer">
                                            <Shield className="w-4 h-4 mr-2" />
                                            Admin Demo
                                        </a>
                                    </Button>
                                )}

                                <Button variant="outline" size="sm" asChild>
                                    <a href="" target="_blank" rel="noopener noreferrer">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                    </a>
                                </Button>

                                <Button variant="outline" size="sm" asChild>
                                    <a href="" target="_blank" rel="noopener noreferrer">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <div className="flex-1 overflow-hidden">

                        {/*<div className="border-t bg-white p-6">*/}
                        {/*    <div className="flex flex-col sm:flex-row gap-3">*/}
                        {/*        <Button*/}
                        {/*            variant="outline"*/}
                        {/*            onClick={onClose}*/}
                        {/*            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"*/}
                        {/*            disabled={isProcessing}*/}
                        {/*        >*/}
                        {/*            Close*/}
                        {/*        </Button>*/}

                        {/*        {product.isPublished && !product.isPublic && (*/}
                        {/*            <>*/}
                        {/*                <Button*/}
                        {/*                    variant="destructive"*/}
                        {/*                    onClick={() => handleVerification("rejected")}*/}
                        {/*                    disabled={isProcessing}*/}
                        {/*                    className="flex-1"*/}
                        {/*                >*/}
                        {/*                    {isProcessing ? (*/}
                        {/*                        <div className="flex items-center gap-2">*/}
                        {/*                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>*/}
                        {/*                            Processing...*/}
                        {/*                        </div>*/}
                        {/*                    ) : (*/}
                        {/*                        <div className="flex items-center gap-2">*/}
                        {/*                            <XCircle className="w-4 h-4" />*/}
                        {/*                            Reject Product*/}
                        {/*                        </div>*/}
                        {/*                    )}*/}
                        {/*                </Button>*/}
                        {/*                <Button*/}
                        {/*                    onClick={() => handleVerification("approved")}*/}
                        {/*                    disabled={isProcessing}*/}
                        {/*                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"*/}
                        {/*                >*/}
                        {/*                    {isProcessing ? (*/}
                        {/*                        <div className="flex items-center gap-2">*/}
                        {/*                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>*/}
                        {/*                            Processing...*/}
                        {/*                        </div>*/}
                        {/*                    ) : (*/}
                        {/*                        <div className="flex items-center gap-2">*/}
                        {/*                            <CheckCircle className="w-4 h-4" />*/}
                        {/*                            Approve Product*/}
                        {/*                        </div>*/}
                        {/*                    )}*/}
                        {/*                </Button>*/}
                        {/*            </>*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <Tabs defaultValue="overview" className="h-full flex flex-col">
                            <div className="px-6 py-4 border-b">
                                <TabsList className="grid w-full grid-cols-5 max-w-2xl">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                                    <TabsTrigger value="technical">Technical</TabsTrigger>
                                    <TabsTrigger value="access">Access</TabsTrigger>
                                    <TabsTrigger value="verification">Verification</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="p-6">
                                        <TabsContent value="overview" className="space-y-6 mt-0">
                                            {/* Product Overview */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-green-600">Product Overview</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="prose max-w-none">
                                                        <p className="whitespace-pre-line text-gray-700">{product.overview}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Key Information */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-green-600 flex items-center gap-2">
                                                            <Users className="w-5 h-5" />
                                                            Target Audience
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2">
                                                            {product.suitableFor.map((item, index) => (
                                                                <Badge key={index} variant="outline">
                                                                    {item}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-green-600 flex items-center gap-2">
                                                            <Star className="w-5 h-5" />
                                                            Key Features
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ul className="space-y-2">
                                                            {product.features.map((feature, index) => (
                                                                <li key={index} className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Tags */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-green-600">Tags & Keywords</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.tags.map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="gallery" className="space-y-4 mt-0">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div>
                                                    <img
                                                        src={product.galleryImages[selectedImage] || "/placeholder.svg"}
                                                        alt={`Gallery image ${selectedImage + 1}`}
                                                        className="w-full h-96 object-cover rounded-lg border"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                                                    {product.galleryImages.map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={image || "/placeholder.svg"}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className={`w-full h-24 object-cover rounded cursor-pointer border-2 transition-all ${
                                                                selectedImage === index ? "border-green-500" : "border-gray-200 hover:border-green-300"
                                                            }`}
                                                            onClick={() => setSelectedImage(index)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="technical" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-green-600 flex items-center gap-2">
                                                            <Code className="w-5 h-5" />
                                                            Built With
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2">
                                                            {product.builtWith.map((tech, index) => (
                                                                <Badge key={index} className="bg-green-500 text-white">
                                                                    {tech}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-green-600 flex items-center gap-2">
                                                            <Globe className="w-5 h-5" />
                                                            Compatibility
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3">
                                                        <div>
                                                            <span className="font-medium text-gray-700">Browsers: </span>
                                                            <span>{product.compatibleBrowsers}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Layout: </span>
                                                            <span>{product.layout}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">License: </span>
                                                            <Badge variant="outline">{product.license}</Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Release Information */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-green-600 flex items-center gap-2">
                                                        <Calendar className="w-5 h-5" />
                                                        Release Information
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Released:</span>
                                                        <span>{formatDate(product.releaseDate)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Last Update:</span>
                                                        <span>{formatDate(product.lastUpdate)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Response Time:</span>
                                                        <span>{product.responseTime}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="access" className="space-y-6 mt-0">
                                            {/* Login Details */}
                                            {product.loginDetails.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-green-600 flex items-center gap-2">
                                                            <Shield className="w-5 h-5" />
                                                            Demo Login Details
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {product.loginDetails.map((login, index) => (
                                                            <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-1 mb-3">
                                                                <div className="font-medium">{login.description}</div>
                                                                <div className="text-sm text-gray-600">
                                                                    <div>
                                                                        Username: <code className="bg-white px-1 rounded">{login.username}</code>
                                                                    </div>
                                                                    <div>
                                                                        Password: <code className="bg-white px-1 rounded">{login.password}</code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Installation Instructions */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-green-600">Installation Instructions</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-sm whitespace-pre-line text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                        {product.downloadInstructions}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Support & Contact */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-green-600">Support & Contact</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        {product.preferredContact.map((contact, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <span className="font-medium">{contact.type}:</span>
                                                                <span>{contact.value}</span>
                                                            </div>
                                                        ))}
                                                        {product.helpDurationSettings.map((help, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <span className="font-medium">{help.type} support:</span>
                                                                <span>{help.duration}</span>
                                                                {help.feeUSD === 0 && help.feeNGN === 0 ? (
                                                                    <Badge variant="outline" className="text-green-600">
                                                                        Free
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-sm text-gray-600">
                                    (${help.feeUSD} / ₦{help.feeNGN.toLocaleString()})
                                  </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="verification" className="space-y-6 mt-0">
                                            {/* Verification Checklist */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-blue-600 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5" />
                                                        Verification Checklist
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-3">
                                                                <h4 className="font-medium text-gray-900">Content Quality</h4>
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Title is descriptive and accurate</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Overview provides clear description</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Features list is comprehensive</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Tags are relevant and accurate</span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <h4 className="font-medium text-gray-900">Technical Verification</h4>
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Demo link works properly</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Login credentials are valid</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Installation instructions are clear</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Technology stack is accurate</span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <h4 className="font-medium text-gray-900">Media & Design</h4>
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Gallery images are high quality</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Images represent the product accurately</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Design is professional</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Responsive design works properly</span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <h4 className="font-medium text-gray-900">Compliance</h4>
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Pricing is reasonable</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">License terms are appropriate</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">No copyright violations</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="rounded" />
                                                                        <span className="text-sm">Meets marketplace standards</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Verification Notes */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-blue-600">Verification Notes</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Textarea
                                                        placeholder="Add notes about the verification process, any issues found, or recommendations for the author..."
                                                        value={verificationNotes}
                                                        onChange={(e) => setVerificationNotes(e.target.value)}
                                                        className="min-h-[120px] resize-none"
                                                    />
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        These notes will be shared with the author and stored for future reference.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Previous Verification History */}
                                            {product.verificationNotes && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-gray-600 flex items-center gap-2">
                                                            <AlertTriangle className="w-5 h-5" />
                                                            Previous Verification
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <p className="text-sm text-gray-700 mb-2">{product.verificationNotes}</p>
                                                            {product.verifiedBy && product.verifiedAt && (
                                                                <p className="text-xs text-gray-500">
                                                                    By {product.verifiedBy} on {formatDate(product.verifiedAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </TabsContent>
                                    </div>
                                </ScrollArea>
                            </div>
                        </Tabs>
                    </div>
                </div>

                {/* Action Footer */}

            </div>
        </div>
    )
}
