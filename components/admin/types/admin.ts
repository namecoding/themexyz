export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    joinDate: string
    status: "active" | "inactive" | "suspended"
    lastLogin?: string
    totalProducts?: number
    totalSales?: number
    isAdmin: boolean
    adminRole?: AdminRole
    isAuthor?: boolean
    authorStatus?: "pending" | "approved" | "rejected"
      admin?: {
    permission: string[]
    role: string
  }
  permission?: string[]
}

export interface AdminRole {
    id: string
    name: string
    displayName: string
    permissions: Permission[]
    color: string
    description: string
    
}

export interface Permission {
    id: string
    name: string
    category: string
    description: string
}

export interface Product {
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
    loginDetails: Array<{
        username: string
        password: string
        description: string
        urlType: string
    }>
    author: string
    authorImage: string
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
    isPublished: boolean
    isPublic: boolean
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
    verificationStatus?: "pending" | "approved" | "rejected"
    verificationNotes?: string
    verifiedBy?: string
    verifiedAt?: string
}

export interface AuthorApplication {
    id: string
    userId: string
    userName: string
    userEmail: string
    userAvatar?: string
    applicationDate: string
    status: "pending" | "approved" | "rejected"
    portfolio: string
    experience: string
    specialties: string[]
    socialLinks: Array<{
        platform: string
        url: string
    }>
    reviewedBy?: string
    reviewedAt?: string
    reviewNotes?: string
}

export interface FeedbackItem {
    id: string
    type: "purchase" | "product" | "support"
    customerName: string
    customerEmail: string
    customerAvatar?: string
    rating: number
    comment: string
    productId?: string
    productTitle?: string
    orderId?: string
    status: "pending" | "reviewed" | "resolved"
    priority: "low" | "medium" | "high"
    createdAt: string
    reviewedBy?: string
    reviewedAt?: string
    response?: string
}

export interface AdminStats {
    totalUsers: number
    totalAdmins: number
    totalProducts: number
    totalSales: number
    pendingReviews: number
    supportTickets: number
    pendingProducts: number
    pendingAuthors: number
    pendingFeedback: number
}

export interface AdminTask {
    id: string
    title: string
    description: string
    type: "review" | "support" | "content" | "sales" | "system" | "author" | "feedback"
    priority: "low" | "medium" | "high" | "urgent"
    status: "pending" | "in-progress" | "completed"
    assignedTo: string
    createdAt: string
    dueDate?: string
}
