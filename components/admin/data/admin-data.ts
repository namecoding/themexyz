import type {
    AdminRole,
    Permission,
    User,
    AdminStats,
    AdminTask,
    Product,
    AuthorApplication,
    FeedbackItem,
} from "../types/admin"

export const permissions: Permission[] = [
    // User Management
    {
        id: "users.view",
        name: "View Users",
        category: "User Management",
        description: "View user profiles and information",
    },
    { id: "users.edit", name: "Edit Users", category: "User Management", description: "Edit user profiles and settings" },
    {
        id: "users.suspend",
        name: "Suspend Users",
        category: "User Management",
        description: "Suspend or ban user accounts",
    },
    {
        id: "users.delete",
        name: "Delete Users",
        category: "User Management",
        description: "Permanently delete user accounts",
    },

    // Admin Management
    {
        id: "admins.create",
        name: "Create Admins",
        category: "Admin Management",
        description: "Create new admin accounts",
    },
    {
        id: "admins.edit",
        name: "Edit Admins",
        category: "Admin Management",
        description: "Edit admin roles and permissions",
    },
    { id: "admins.delete", name: "Delete Admins", category: "Admin Management", description: "Remove admin privileges" },

    // Content Management
    {
        id: "products.view",
        name: "View Products",
        category: "Content Management",
        description: "View all products and listings",
    },
    {
        id: "products.edit",
        name: "Edit Products",
        category: "Content Management",
        description: "Edit product information",
    },
    {
        id: "products.approve",
        name: "Approve Products",
        category: "Content Management",
        description: "Approve or reject product submissions",
    },
    {
        id: "products.delete",
        name: "Delete Products",
        category: "Content Management",
        description: "Remove products from marketplace",
    },
    {
        id: "products.verify",
        name: "Verify Products",
        category: "Content Management",
        description: "Verify product quality and content",
    },

    // Author Management
    {
        id: "authors.view",
        name: "View Authors",
        category: "Author Management",
        description: "View author applications and profiles",
    },
    {
        id: "authors.approve",
        name: "Approve Authors",
        category: "Author Management",
        description: "Approve or reject author applications",
    },
    {
        id: "authors.manage",
        name: "Manage Authors",
        category: "Author Management",
        description: "Manage author accounts and status",
    },

    // Feedback Management
    {
        id: "feedback.view",
        name: "View Feedback",
        category: "Feedback Management",
        description: "View customer feedback and reviews",
    },
    {
        id: "feedback.respond",
        name: "Respond to Feedback",
        category: "Feedback Management",
        description: "Respond to customer feedback",
    },
    {
        id: "feedback.moderate",
        name: "Moderate Feedback",
        category: "Feedback Management",
        description: "Moderate and manage feedback content",
    },

    // Support Management
    {
        id: "support.view",
        name: "View Support",
        category: "Support Management",
        description: "View support tickets and messages",
    },
    {
        id: "support.respond",
        name: "Respond to Support",
        category: "Support Management",
        description: "Respond to customer support requests",
    },
    {
        id: "support.escalate",
        name: "Escalate Support",
        category: "Support Management",
        description: "Escalate support tickets to higher level",
    },

    // Sales Management
    {
        id: "sales.view",
        name: "View Sales",
        category: "Sales Management",
        description: "View sales data and transactions",
    },
    {
        id: "sales.refund",
        name: "Process Refunds",
        category: "Sales Management",
        description: "Process customer refunds",
    },
    {
        id: "sales.reports",
        name: "Sales Reports",
        category: "Sales Management",
        description: "Generate and view sales reports",
    },

    // System Management
    {
        id: "system.settings",
        name: "System Settings",
        category: "System Management",
        description: "Modify system configuration",
    },
    {
        id: "system.logs",
        name: "View Logs",
        category: "System Management",
        description: "View system logs and audit trails",
    },
    {
        id: "system.backup",
        name: "System Backup",
        category: "System Management",
        description: "Create and manage system backups",
    },
]

export const adminRoles: AdminRole[] = [
    {
        id: "super_admin",
        name: "super_admin",
        displayName: "Super Admin",
        color: "red",
        description: "Full system access with all permissions",
        permissions: permissions, // All permissions
    },
    {
        id: "content_admin",
        name: "content_admin",
        displayName: "Content Admin",
        color: "blue",
        description: "Manages product verification, reviews, and content moderation",
        permissions: permissions.filter(
            (p) => p.category === "Content Management" || p.id === "users.view" || p.id === "support.view",
        ),
    },
    {
        id: "author_admin",
        name: "author_admin",
        displayName: "Author Admin",
        color: "green",
        description: "Manages author applications and approvals",
        permissions: permissions.filter(
            (p) => p.category === "Author Management" || p.id === "users.view" || p.id === "products.view",
        ),
    },
    {
        id: "feedback_admin",
        name: "feedback_admin",
        displayName: "Feedback Admin",
        color: "purple",
        description: "Manages customer feedback and reviews",
        permissions: permissions.filter(
            (p) => p.category === "Feedback Management" || p.id === "users.view" || p.id === "products.view",
        ),
    },
    {
        id: "support_admin",
        name: "support_admin",
        displayName: "Support Admin",
        color: "orange",
        description: "Handles customer support and user assistance",
        permissions: permissions.filter(
            (p) => p.category === "Support Management" || p.id === "users.view" || p.id === "users.edit",
        ),
    },
    {
        id: "sales_admin",
        name: "sales_admin",
        displayName: "Sales Admin",
        color: "indigo",
        description: "Manages sales, transactions, and financial operations",
        permissions: permissions.filter(
            (p) => p.category === "Sales Management" || p.id === "users.view" || p.id === "products.view",
        ),
    },
    {
        id: "user_admin",
        name: "user_admin",
        displayName: "User Admin",
        color: "pink",
        description: "Manages user accounts and basic user operations",
        permissions: permissions.filter((p) => p.category === "User Management" && p.id !== "users.delete"),
    },
]

export const sampleProducts: Product[] = [
    {
        _id: "68686793bd47cd444ff13022",
        title: "Complete Online Banking Web App (PHP, JS, MySQL, Responsive Design)",
        isCategory: "Finance & FinTech",
        featured: false,
        priceNGN: 220000,
        priceUSD: 150,
        demoUrl: "https://app.namecoding.net/finto/",
        adminDemoUrl: "",
        downloadUrl: "https://app.namecoding.net/finto/",
        downloadInstructions:
            "✅ Thank you for purchasing our Online Banking System!\n\n👉 To get started:\n1. Unzip the downloaded file to your server directory (e.g., `htdocs` or `public_html`).\n2. Create a new MySQL database using your hosting control panel or phpMyAdmin.\n3. Import the SQL file found in the `/database/` folder.\n4. Edit the `/config/db.php` file to add your database credentials.\n5. Open your browser and navigate to your domain to access the system.\n",
        loginDetails: [
            {
                username: "example1@gmail.com",
                password: "123",
                description: "Demo Login",
                urlType: "demo",
            },
        ],
        author: "Dike2",
        authorImage:
            "https://firebasestorage.googleapis.com/v0/b/unity-exness.appspot.com/o/themexyz%2F1751434539905_pw6rpj1mg.jpg?alt=media&token=03237342-b44a-4705-abbf-d5e3ef9abee3",
        helpDurationSettings: [
            {
                type: "author",
                duration: "6m",
                feeUSD: 0,
                feeNGN: 0,
            },
        ],
        preferredContact: [
            {
                type: "WhatsApp",
                value: "07064672661",
            },
        ],
        isPublished: true,
        isPublic: false, // Pending approval
        tags: [
            "banking website template",
            "php web platform",
            "financial software",
            "responsive web app",
            "php html css javascript",
            "banking php script",
            "banking system",
            "online banking",
            "php banking script",
            "php mysql web app",
            "finance web app",
        ],
        features: ["Lazy-Loading Images & Video", "Fully Responsive Design"],
        galleryImages: [
            "https://res.cloudinary.com/namecoding-web-team/image/upload/v1751672713/tvynomizretoqecvjq4f.png",
            "https://res.cloudinary.com/namecoding-web-team/image/upload/v1751672712/mholztnlqhhe20c26sbi.png",
            "https://res.cloudinary.com/namecoding-web-team/image/upload/v1751672712/r2ijaoatp2vsaedohlgg.png",
            "https://res.cloudinary.com/namecoding-web-team/image/upload/v1751672720/blir43yp1uv8oqbnscpr.png",
            "https://res.cloudinary.com/namecoding-web-team/image/upload/v1751672712/kj0gki8hd1pxcekwtxtr.png",
        ],
        suitableFor: ["Small Businesses", "Startups", "Large Enterprises", "Finance / FinTech"],
        compatibleBrowsers: "All Major Browsers",
        builtWith: ["Bootstrap 5", "PHP", "MySQL"],
        layout: "Responsive",
        sellType: "Complete Project",
        license: "commercial",
        responseTime: "24 hours",
        overview:
            "Introducing our **Secure Online Banking System**, a complete web-based banking solution designed for financial institutions, microfinance businesses, and entrepreneurs seeking to offer digital banking services.\n\n🛡 **Key Features**\n- Fully functional **Admin Dashboard** for managing users, accounts, and transactions\n- **User Panel** for customers to view balances, transfer funds, request services, and view transaction history\n- Built with **PHP**, **MySQL**, **JavaScript**, **HTML**, and **CSS** for maximum compatibility\n- Clean, responsive design for desktop and mobile devices\n- **Secure authentication** and session management\n- Easy customization and integration with third-party services\n- Includes installation guide and support\n\n📂 **Technologies Used**\nPHP, MySQL, HTML5, CSS3, JavaScript (Vanilla JS)\n\n💡 **Perfect for**\n- Microfinance banks\n- Fintech startups\n- Banking demos and prototypes\n- Educational use to learn banking software structure\n\nGet started with your own online banking platform today!\n",
        documentation: "",
        marketData: {
            rating: 0,
            reviews: 0,
            sales: 0,
        },
        releaseDate: "2025-07-04T23:45:23.434Z",
        lastUpdate: "2025-07-04T23:45:23.434Z",
        id: "68686793bd47cd444ff13022",
        verificationStatus: "pending",
    },
    // {
    //     _id: "68680242bd47cd444ff13012",
    //     title: "Logistic tracking website",
    //     isCategory: "Complete Web App",
    //     featured: false,
    //     priceNGN: 50000,
    //     priceUSD: 50,
    //     demoUrl: "http://logistics.com",
    //     adminDemoUrl: "",
    //     downloadUrl: "http://logistics.com/download",
    //     downloadInstructions: "hello",
    //     loginDetails: [],
    //     author: "Dike2",
    //     authorImage:
    //         "https://firebasestorage.googleapis.com/v0/b/unity-exness.appspot.com/o/themexyz%2F1751434539905_pw6rpj1mg.jpg?alt=media&token=03237342-b44a-4705-abbf-d5e3ef9abee3",
    //     helpDurationSettings: [
    //         {
    //             type: "author",
    //             duration: "6m",
    //             feeUSD: 0,
    //             feeNGN: 0,
    //         },
    //     ],
    //     preferredContact: [
    //         {
    //             type: "WhatsApp",
    //             value: "07064672661",
    //         },
    //     ],
    //     isPublished: true,
    //     isPublic: true, // Already approved
    //     tags: ["HTML", "CSS", "JavaScript", "TypeScript"],
    //     features: [
    //         "Fully Responsive Design",
    //         "Dark- & Light-Mode Toggle",
    //         "Multi-Step Forms",
    //         "SVG & Lottie Animations",
    //         "Lazy-Loading Images & Video",
    //         "TypeScript Support",
    //     ],
    //     galleryImages: ["https://res.cloudinary.com/namecoding-web-team/image/upload/v1751646782/rghhblzcf73wfeklxzmj.jpg"],
    //     suitableFor: ["Small Businesses", "Large Enterprises", "Event Organizers"],
    //     compatibleBrowsers: "All Major Browsers",
    //     builtWith: ["Next.js", "Tailwind CSS", "PHP", "MongoDB"],
    //     layout: "Responsive",
    //     sellType: "Complete Project",
    //     license: "regular",
    //     responseTime: "24 hours",
    //     overview: "very good product",
    //     documentation: "",
    //     marketData: {
    //         rating: 5,
    //         reviews: 4,
    //         sales: 2,
    //     },
    //     releaseDate: "2025-07-04T16:33:06.466Z",
    //     lastUpdate: "2025-07-04T16:33:06.466Z",
    //     id: "68680242bd47cd444ff13012",
    //     verificationStatus: "approved",
    //     verifiedBy: "Content Admin",
    //     verifiedAt: "2025-01-08T10:00:00.000Z",
    // },
    // {
    //     _id: "6867ed252d47c4f722808b0c",
    //     title: "School management system",
    //     isCategory: "Education & LMS",
    //     featured: false,
    //     priceNGN: 300000,
    //     priceUSD: 499,
    //     demoUrl: "http://schoolmanagement.com",
    //     adminDemoUrl: "",
    //     downloadUrl: "http://schoolmanagement.com",
    //     downloadInstructions: "just download",
    //     loginDetails: [
    //         {
    //             username: "user",
    //             password: "123",
    //             description: "Demo Login",
    //             urlType: "demo",
    //         },
    //     ],
    //     author: "Dike2",
    //     authorImage:
    //         "https://firebasestorage.googleapis.com/v0/b/unity-exness.appspot.com/o/themexyz%2F1751434539905_pw6rpj1mg.jpg?alt=media&token=03237342-b44a-4705-abbf-d5e3ef9abee3",
    //     helpDurationSettings: [
    //         {
    //             type: "author",
    //             duration: "6m",
    //             feeUSD: 0,
    //             feeNGN: 0,
    //         },
    //     ],
    //     preferredContact: [
    //         {
    //             type: "WhatsApp",
    //             value: "098874746672",
    //         },
    //     ],
    //     isPublished: false, // Draft
    //     isPublic: false,
    //     tags: ["CSS", "JavaScript", "TypeScript"],
    //     features: ["Drag-and-Drop Page Builder"],
    //     galleryImages: ["https://res.cloudinary.com/namecoding-web-team/image/upload/v1751641342/sgqoeitqzs6zjzwafdtg.png"],
    //     suitableFor: ["Small Businesses", "Educational Institutions"],
    //     compatibleBrowsers: "All Major Browsers",
    //     builtWith: ["React", "Next.js", "Tailwind CSS"],
    //     layout: "Responsive",
    //     sellType: "Complete Project",
    //     license: "regular",
    //     responseTime: "24 hours",
    //     overview: "very good",
    //     documentation: "",
    //     marketData: {
    //         rating: 5,
    //         reviews: 4,
    //         sales: 2,
    //     },
    //     releaseDate: "2025-07-04T15:03:01.092Z",
    //     lastUpdate: "2025-07-04T15:03:01.092Z",
    //     id: "6867ed252d47c4f722808b0c",
    //     verificationStatus: "pending",
    // },
]

export const sampleUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        joinDate: "2023-01-15T00:00:00.000Z",
        status: "active",
        lastLogin: "2024-01-10T10:30:00.000Z",
        totalProducts: 12,
        totalSales: 1250,
        isAdmin: true,
        adminRole: adminRoles[0], // Super Admin
    },
    {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        joinDate: "2023-02-20T00:00:00.000Z",
        status: "active",
        lastLogin: "2024-01-09T14:20:00.000Z",
        totalProducts: 8,
        totalSales: 890,
        isAdmin: true,
        adminRole: adminRoles[1], // Content Admin
    },
    {
        id: "3",
        name: "Mike Chen",
        email: "mike@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        joinDate: "2023-03-10T00:00:00.000Z",
        status: "active",
        lastLogin: "2024-01-08T09:15:00.000Z",
        totalProducts: 15,
        totalSales: 2100,
        isAdmin: true,
        adminRole: adminRoles[2], // Author Admin
    },
    {
        id: "4",
        name: "Emily Rodriguez",
        email: "emily@example.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        joinDate: "2023-04-05T00:00:00.000Z",
        status: "active",
        lastLogin: "2024-01-07T16:45:00.000Z",
        totalProducts: 6,
        totalSales: 450,
        isAdmin: true,
        adminRole: adminRoles[3], // Feedback Admin
    },
    {
        id: "5",
        name: "David Thompson",
        email: "david@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        joinDate: "2023-05-12T00:00:00.000Z",
        status: "suspended",
        lastLogin: "2024-01-06T11:30:00.000Z",
        totalProducts: 20,
        totalSales: 3200,
        isAdmin: true,
        adminRole: adminRoles[4], // Support Admin
    },
    {
        id: "6",
        name: "Lisa Wang",
        email: "lisa@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        joinDate: "2023-06-18T00:00:00.000Z",
        status: "active",
        lastLogin: "2024-01-05T13:20:00.000Z",
        totalProducts: 25,
        totalSales: 4500,
        isAdmin: false,
        isAuthor: true,
        authorStatus: "pending",
    },
]

export const sampleAuthorApplications: AuthorApplication[] = [
    {
        id: "1",
        userId: "6",
        userName: "Lisa Wang",
        userEmail: "lisa@example.com",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        applicationDate: "2024-01-08T10:00:00.000Z",
        status: "pending",
        portfolio: "https://lisawang.dev",
        experience:
            "5+ years of full-stack development with expertise in React, Node.js, and cloud technologies. Previously worked at tech startups and have created multiple successful web applications.",
        specialties: ["Web Development", "Mobile Apps", "UI/UX Design", "E-commerce"],
        socialLinks: [
            { platform: "GitHub", url: "https://github.com/lisawang" },
            { platform: "LinkedIn", url: "https://linkedin.com/in/lisawang" },
        ],
    },
    {
        id: "2",
        userId: "7",
        userName: "Alex Kumar",
        userEmail: "alex@example.com",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        applicationDate: "2024-01-07T15:30:00.000Z",
        status: "pending",
        portfolio: "https://alexkumar.design",
        experience:
            "3+ years specializing in mobile app development and UI/UX design. Created apps with over 100k downloads and worked with various clients.",
        specialties: ["Mobile Development", "UI/UX Design", "React Native", "Flutter"],
        socialLinks: [
            { platform: "Dribbble", url: "https://dribbble.com/alexkumar" },
            { platform: "Behance", url: "https://behance.net/alexkumar" },
        ],
    },
]

export const sampleFeedback: FeedbackItem[] = [
    {
        id: "1",
        type: "product",
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment: "Excellent banking system! Works perfectly and the documentation is great. Highly recommend this product.",
        productId: "68686793bd47cd444ff13022",
        productTitle: "Complete Online Banking Web App",
        orderId: "ORD-2024-001",
        status: "pending",
        priority: "medium",
        createdAt: "2024-01-10T14:30:00.000Z",
    },
    {
        id: "2",
        type: "purchase",
        customerName: "Sarah Davis",
        customerEmail: "sarah.davis@example.com",
        customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        rating: 4,
        comment:
            "Good purchase experience overall, but the download process could be improved. The product itself is great!",
        status: "pending",
        priority: "low",
        createdAt: "2024-01-09T11:15:00.000Z",
    },
    {
        id: "3",
        type: "support",
        customerName: "Mike Johnson",
        customerEmail: "mike.johnson@example.com",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 2,
        comment: "Had issues with installation and the support response was slow. Need better documentation.",
        productId: "68680242bd47cd444ff13012",
        productTitle: "Logistic tracking website",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-08T16:45:00.000Z",
    },
]

export const adminStats: AdminStats = {
    totalUsers: 0,
    totalAdmins: 8,
    totalProducts: 0,
    totalSales: 0,
    pendingReviews: 0,
    supportTickets: 0,
    pendingProducts: 0,
    pendingAuthors: 0,
    pendingFeedback: 0,
}

export const adminTasks: AdminTask[] = [
    {
        id: "1",
        title: "Review Banking System Product",
        description: "Verify Complete Online Banking Web App submission",
        type: "content",
        priority: "high",
        status: "pending",
        assignedTo: "2",
        createdAt: "2024-01-10T09:00:00.000Z",
        dueDate: "2024-01-12T17:00:00.000Z",
    },
    {
        id: "2",
        title: "Approve Author Application",
        description: "Review Lisa Wang's author application",
        type: "author",
        priority: "medium",
        status: "pending",
        assignedTo: "3",
        createdAt: "2024-01-09T14:30:00.000Z",
    },
    {
        id: "3",
        title: "Review Customer Feedback",
        description: "Address negative feedback about installation issues",
        type: "feedback",
        priority: "high",
        status: "pending",
        assignedTo: "4",
        createdAt: "2024-01-08T16:45:00.000Z",
    },
    {
        id: "4",
        title: "Customer Support Ticket",
        description: "User having download issues",
        type: "support",
        priority: "medium",
        status: "in-progress",
        assignedTo: "5",
        createdAt: "2024-01-09T14:30:00.000Z",
    },
]
