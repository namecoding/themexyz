import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Paste your full predefined arrays below
const predefined = {
    feature: [
        "One-Click Demo Import",
        "Drag-and-Drop Page Builder",
        "Fully Responsive Design",
        "Retina / Hi-DPI Ready",
        "Dark- & Light-Mode Toggle",
        "RTL & Multilingual Support",
        "Accessibility (WCAG 2.1) Ready",
        "Multi-Step Forms",
        "Parallax & Smooth Scrolling",
        "Modular SCSS Architecture",
        "Atomic / Utility-First CSS",
        "Tailwind Config Included",
        "Figma Design Source",
        "SVG & Lottie Animations",
        "Smooth Page Transitions",
        "Lazy-Loading Images & Video",
        "Code-Splitting / Tree-Shaking",
        "Critical-CSS Inlining",
        "Next-Gen Image Optimisation",
        "SEO-Optimised Mark-up",
        "Open-Graph & Twitter Cards",
        "Structured-Data (JSON-LD)",
        "AMP Compatible",
        "WooCommerce Ready",
        "Stripe & PayPal Integration",
        "Coupon & Subscription Support",
        "GDPR Consent Manager",
        "Abandoned-Cart Emails",
        "One-Page Checkout",
        "Apple / Google Pay Buttons",
        "TypeScript Support",
        "ESLint + Prettier Config",
        "Jest / Vitest Unit Tests",
        "Storybook UI Docs",
        "Docker-Compose Setup",
        "CI/CD GitHub Actions",
        "Vite & Webpack Build Scripts",
        "Headless CMS Compatible",
        "REST & GraphQL API Layers",
        "Prisma ORM Setup",
        "Firebase Auth & Firestore",
        "Supabase Integration",
        "Real-Time Chat / Socket.io",
        "Free Lifetime Updates",
        "Detailed Documentation",
        "Dedicated 24/7 Support",
        "Extensive Video Tutorials",
        "Support Multiple Currency",
        "Lanuage Translator",
        "Admin Dashboard",
        "Client Dashboard"
    ],
    tag: [
        "HTML", "CSS", "Sass", "JavaScript", "TypeScript", "React", "Next.js",
        "Vue", "Nuxt.js", "Angular", "Svelte", "SolidJS", "Tailwind", "Bootstrap",
        "Bulma", "Material-UI", "Chakra UI", "Ant Design", "Node.js", "Express",
        "NestJS", "GraphQL", "Apollo", "Prisma", "PHP", "Laravel", "Symfony",
        "Python", "Django", "Flask", "Go", "Fiber", "Rust", "Spring Boot", ".NET Core",
        "PostgreSQL", "MongoDB", "MySQL", "Firebase", "Supabase", "Redis",
        "Elasticsearch", "AWS", "GCP", "Azure", "Docker", "Kubernetes",
        "WordPress", "Headless CMS", "Strapi", "Sanity", "Contentful",
        "Shopify", "WooCommerce", "Magento", "Ghost", "Hugo", "Gatsby",
        "SaaS", "Marketplace", "E-commerce", "Portfolio", "Landing Page",
        "Blog", "Admin Dashboard", "Analytics", "Booking", "Learning-Management",
        "FinTech", "Crypto", "NFT", "Chatbot", "AI", "Streaming", "Forum",
        "Social Network", "Real Estate", "Restaurant", "Medical", "Event",
        "Travel", "Job Board", "CMS", "PWA", "Jamstack", "SEO", "Fast", "Clean",
        "And More", "online banking", "banking system", "php banking script",
        "php mysql web app", "finance web app", "admin dashboard",
        "banking php script", "secure banking system", "responsive web app",
        "financial software", "php html css javascript", "php web platform",
        "banking website template"
    ],
    built_with: [
        "React", "Next.js", "Gatsby", "Vue.js", "Nuxt.js", "Angular",
        "Svelte", "SvelteKit", "SolidJS", "Vanilla JS", "React Native", "Expo",
        "Flutter", "Ionic", "Electron", "Tailwind CSS", "Bootstrap 5", "Bulma",
        "Material-UI", "Chakra UI", "Ant Design", "CSS3", "CSS", "HTML",
        "Node.js", "Express", "NestJS", "Fastify", "Deno", "Oak", "PHP",
        "Laravel", "Symfony", "CodeIgniter", "Python", "Django", "Flask",
        "FastAPI", "Ruby on Rails", "Go", "Fiber", "Gin", "Rust (Actix / Rocket)",
        "Java", "Spring Boot", "Kotlin Ktor", "C# / .NET 6", "Elixir / Phoenix",
        "Vanilla PHP", "PostgreSQL", "MySQL", "MariaDB", "SQLite", "MongoDB",
        "Redis", "DynamoDB", "Prisma", "TypeORM", "Sequelize", "GraphQL",
        "Apollo Server", "tRPC", "REST", "OpenAPI", "OAuth2", "JWT", "Vite",
        "Webpack", "Parcel", "Rollup", "Babel", "ESBuild", "Docker",
        "Docker Compose", "Kubernetes", "Terraform", "Pulumi", "GitHub Actions",
        "GitLab CI", "Cypress", "Playwright", "Jest", "AWS Lambda", "Vercel",
        "Netlify Functions", "Cloudflare Workers", "Firebase", "Supabase",
        "Strapi", "Sanity", "Contentful", "Directus", "Shopify", "Medusa.js",
        "Saleor"
    ],
    suitable_for: [
        "Freelancers", "Agencies", "Startups", "Small Businesses", "Large Enterprises",
        "SaaS Companies", "E-commerce Stores", "Online Marketplaces", "Digital Product Creators",
        "Bloggers & Influencers", "Content Creators", "Educational Institutions",
        "Coaches & Course Creators", "Non-Profit Organizations", "Event Organizers",
        "Restaurants & Cafés", "Real-Estate Agencies", "Medical & Health Practices",
        "Finance / FinTech", "Crypto & NFT Projects", "Travel & Booking Platforms",
        "Job Boards", "Community Forums", "Streaming & Media", "Portfolio Showcases",
        "Corporate Websites", "Landing Pages", "Mobile Apps", "Web Applications",
        "PWA / Offline Apps", "Microfinance banks", "Fintech startups",
        "financial institutions", "microfinance businesses", "entrepreneurs"
    ],
    category: [
        "Landing Page", "Corporate Website", "Portfolio", "Blog / Magazine",
        "CMS Theme", "E-commerce Theme", "Admin Dashboard", "UI Kit / Design System",
        "Email Template", "Mobile App UI", "Complete Web App", "SaaS Starter Kit",
        "API / Back-end", "Authentication Module", "Payment Integration",
        "Booking System", "Chat & Messaging", "Analytics / Dashboards",
        "PWA / Offline App", "WordPress Theme", "WooCommerce Theme", "Shopify Theme",
        "Magento Theme", "Ghost Theme", "Headless CMS Starter", "React Components",
        "Vue Components", "HTML Snippets", "Icons & Illustrations", "3D Assets",
        "Lottie Animations", "Real Estate", "Restaurant & Food", "Medical & Health",
        "Education & LMS", "Events & Conferences", "Travel & Tourism",
        "Finance & FinTech", "Crypto / NFT", "And More"
    ]
};

export async function POST() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const col = db.collection('dictionary');

        const items = Object.entries(predefined).flatMap(([type, values]) =>
            values.map((value) => ({
                _id: new ObjectId(),
                type,
                value,
                status: true,
            }))
        );

        await col.insertMany(items);

        return NextResponse.json({
            success: true,
            inserted: items.length,
            message: 'Predefined values inserted successfully',
        });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to seed predefined items', error: error.message },
            { status: 500 }
        );
    }
}
