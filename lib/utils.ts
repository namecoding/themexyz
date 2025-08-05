import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast";
// import PaystackPop from "@paystack/inline-js";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SERVER_PUBLIC = process.env.NEXT_PUBLIC_BACKEND_SERVER;
export const BASE_PUBLIC = process.env.NEXT_PUBLIC_BASE_URL;


export function getMembershipDuration(isoDateString: string): string {
  const createdDate = new Date(isoDateString);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""}`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""}`;
  } else {
    return `Just now`;
  }
}

export function maskEmail2(email: string): string {
  const [localPart, domain] = email?.split('@');
  if (!localPart || !domain) return email;

  const visibleChars = 2;
  const maskedLength = Math.max(localPart.length - visibleChars, 0);
  const maskedPart = '*'.repeat(maskedLength);

  return localPart?.slice(0, visibleChars) + maskedPart + '@' + domain;
}

export function maskEmail(email?: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return email ?? ""; // gracefully return empty string or original
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  const visibleChars = 2;
  const maskedLocal = localPart
    .slice(0, visibleChars)
    .padEnd(localPart.length, '*');

  return `${maskedLocal}@${domain}`;
}


export const metaData = {
  name: 'ThemeXYZ'
}

// worldStates.js
export const countriesWithStates = [
  {
    country: "United States",
    states: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
      "Washington, D.C."
    ],
  },
  {
    country: "Canada",
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", /* ... */
    ],
  },
  {
    country: "Nigeria",
    states: [
      "Abia",
      "Adamawa",
      "Akwa Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nasarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara",
      "Federal Capital Territory (FCT)"
    ],
  },
  {
    country: "Australia",
    states: [
      "New South Wales", "Queensland", "South Australia", "Tasmania", /* ... */
    ],
  },
  {
    country: "United Kingdom",
    states: [
      "England", "Scotland", "Wales", "Northern Ireland"
    ],
  },
  {
    country: "Germany",
    states: [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", /* ... */
    ],
  },
  {
    country: "India",
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", /* ... */
    ],
  },
  // ... more countries
];


export function shortenText(text: string, maxLength: number): string {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export const loginHandler = async ({
  email,
  password,
  setUser,
  setIsLoggedIn,
  closeLoginModal,
  setPleaseWaitWhileYourTransactionIsProcessing,
}: {
  email: string;
  password: string;
  setUser: (user: any) => void;
  setIsLoggedIn: (value: boolean) => void;
  closeLoginModal: () => void;
  setPleaseWaitWhileYourTransactionIsProcessing: (value: boolean) => void;
}) => {
  const toastId = toast.loading('Uploading...');

  try {
    setPleaseWaitWhileYourTransactionIsProcessing(true);

    const response = await fetch(`${SERVER_PUBLIC}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Login failed:", data.error || data.message);
      toast.error(data.message || 'Login failed', { id: toastId });
      setPleaseWaitWhileYourTransactionIsProcessing(false);
      return;
    }

    toast.success('Login successful!', { id: toastId });
    setPleaseWaitWhileYourTransactionIsProcessing(false);

    localStorage.setItem("token", data.token);

    setUser({
      ...data.user,
      avatar: data.user.avatar || "/placeholder.svg?height=40&width=40",
    });

    setIsLoggedIn(true);
    closeLoginModal();
  } catch (error) {
    console.error("Login request error:", error);
    setPleaseWaitWhileYourTransactionIsProcessing(false);
    toast.error('Login request error', { id: toastId });
  }
};

type UsePaystackProps = {
  email: string;
  amount: number;
  reference: string;
  toastId: string;
  onSuccess?: (response: any) => void;
  onClose?: () => void;
  currency?: string;
};

export const usePaystack = ({
  email,
  amount,
  reference,
  toastId,
  currency,
  onSuccess,
  onClose,
}: UsePaystackProps): Promise<any> => {
  if (typeof window === "undefined") return Promise.reject("Not in browser");

  return new Promise(async (resolve, reject) => {
    try {
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
        email,
        amount,
        reference,
        currency,
        onSuccess: (response: any) => {
          // toast.success(`Payment successful: ${response.reference}`, { id: toastId });
          onSuccess?.(response);
          resolve(response); // ✅ Return response here
        },
        onCancel: () => {
          // toast.error("Payment modal closed", { id: toastId });
          onClose?.();
          reject("Payment cancelled");
        },
      });
    } catch (err) {
      // toast.error("Paystack failed to load", { id: toastId });
      console.log("Paystack client error:", err);
      reject(err);
    }
  });
};


export const commissions = {
  supportCommissionRate: 0.05,
  commissionRate: 0.2
}
export const defaultCurrency = 'usd' // "USD" || "NGN"//ngn usd eur gbp

export const loyaltyPointsReward = {
  USD: 0.05,
  NGN: 0.005
};

export const themeXYZStorage = "cloudinary"; // cloudinary | firebase

async function uploadAvatarToFirebase(file: File, userId: string) {
  const storage = getStorage();
  const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}


export function getAuthorHelpDuration(
  helpDurationSettings: { type: string; duration: string }[]
): string | null {
  const authorSetting = helpDurationSettings.find(
    (setting) => setting.type === "author"
  );

  if (!authorSetting) return null;

  const match = authorSetting.duration.match(/^(\d+)m$/);

  if (match) {
    const months = Number(match[1]);
    const label = months === 1 ? "month" : "months";
    return `${months} ${label}`;
  }

  return null;
}

export function getInitials(name: string): string {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/) // split by any whitespace
    .map(word => word[0].toUpperCase())
    .join("");
}


export function getHelpDurationByType(
  helpDurationSettings: { type: string; duration: string }[],
  targetType: "author" | "extended"
): { type: string; duration: string }[] {
  return helpDurationSettings.filter(
    (setting) => setting.type === targetType
  );
}

export function formatReadableDate(isoString: string, options = {}) {
  const date = new Date(isoString);

  // Default format: July 3, 2025
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,  // Allow custom overrides
  };

  return date.toLocaleDateString("en-US", defaultOptions);
}


export const predefinedFeatures = [
  // UI / Layout
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

  // Performance / SEO
  "Lazy-Loading Images & Video",
  "Code-Splitting / Tree-Shaking",
  "Critical-CSS Inlining",
  "Next-Gen Image Optimisation",
  "SEO-Optimised Mark-up",
  "Open-Graph & Twitter Cards",
  "Structured-Data (JSON-LD)",
  "AMP Compatible",

  // E-commerce / Business
  "WooCommerce Ready",
  "Stripe & PayPal Integration",
  "Coupon & Subscription Support",
  "GDPR Consent Manager",
  "Abandoned-Cart Emails",
  "One-Page Checkout",
  "Apple / Google Pay Buttons",

  // Dev / Build
  "TypeScript Support",
  "ESLint + Prettier Config",
  "Jest / Vitest Unit Tests",
  "Storybook UI Docs",
  "Docker-Compose Setup",
  "CI/CD GitHub Actions",
  "Vite & Webpack Build Scripts",

  // CMS / Data
  "Headless CMS Compatible",
  "REST & GraphQL API Layers",
  "Prisma ORM Setup",
  "Firebase Auth & Firestore",
  "Supabase Integration",
  "Real-Time Chat / Socket.io",

  // Extras
  "Free Lifetime Updates",
  "Detailed Documentation",
  "Dedicated 24/7 Support",
  "Extensive Video Tutorials",

  "Support Multiple Currency",
  "Lanuage Translator",
  "Admin Dashboard",
  "Client Dashboard",

];

export const predefinedTags = [
  // Core stacks
  "HTML", "CSS", "Sass", "JavaScript", "TypeScript",
  "React", "Next.js", "Vue", "Nuxt.js", "Angular", "Svelte", "SolidJS",
  // Styling / UI kits
  "Tailwind", "Bootstrap", "Bulma", "Material-UI", "Chakra UI", "Ant Design",
  // Back-end / API
  "Node.js", "Express", "NestJS", "GraphQL", "Apollo", "Prisma",
  "PHP", "Laravel", "Symfony", "Python", "Django", "Flask",
  "Go", "Fiber", "Rust", "Spring Boot", ".NET Core",
  // Databases / infra
  "PostgreSQL", "MongoDB", "MySQL", "Firebase", "Supabase",
  "Redis", "Elasticsearch", "AWS", "GCP", "Azure", "Docker", "Kubernetes",
  // CMS / SSG
  "WordPress", "Headless CMS", "Strapi", "Sanity", "Contentful",
  "Shopify", "WooCommerce", "Magento", "Ghost", "Hugo", "Gatsby",
  // Use-case keywords
  "SaaS", "Marketplace", "E-commerce", "Portfolio", "Landing Page",
  "Blog", "Admin Dashboard", "Analytics", "Booking", "Learning-Management",
  "FinTech", "Crypto", "NFT", "Chatbot", "AI", "Streaming", "Forum",
  "Social Network", "Real Estate", "Restaurant", "Medical", "Event",
  "Travel", "Job Board", "CMS", "PWA", "Jamstack", "SEO", "Fast", "Clean", "And More",
  "online banking", "banking system", "php banking script", "php mysql web app", "finance web app", "admin dashboard", "banking php script", "secure banking system", "responsive web app", "financial software", "php html css javascript", "php web platform", "banking website template"

];

export const predefinedBuiltWith = [
  /* Front-end frameworks */
  "React", "Next.js", "Gatsby", "Vue.js", "Nuxt.js", "Angular",
  "Svelte", "SvelteKit", "SolidJS", "Vanilla JS",

  /* Mobile / Desktop */
  "React Native", "Expo", "Flutter", "Ionic", "Electron",

  /* Styling & UI */
  "Tailwind CSS", "Bootstrap 5", "Bulma", "Material-UI", "Chakra UI", "Ant Design", "CSS3", "CSS", "HTML",

  /* Back-end runtimes & frameworks */
  "Node.js", "Express", "NestJS", "Fastify",
  "Deno", "Oak",
  "PHP", "Laravel", "Symfony", "CodeIgniter",
  "Python", "Django", "Flask", "FastAPI",
  "Ruby on Rails",
  "Go", "Fiber", "Gin",
  "Rust (Actix / Rocket)",
  "Java", "Spring Boot",
  "Kotlin Ktor",
  "C# / .NET 6",
  "Elixir / Phoenix", "Vanilla PHP",

  /* Databases & ORMs */
  "PostgreSQL", "MySQL", "MariaDB", "SQLite",
  "MongoDB", "Redis", "DynamoDB",
  "Prisma", "TypeORM", "Sequelize",

  /* API & Auth */
  "GraphQL", "Apollo Server", "tRPC",
  "REST", "OpenAPI", "OAuth2", "JWT",

  /* DevOps / Tooling */
  "Vite", "Webpack", "Parcel", "Rollup",
  "Babel", "ESBuild",
  "Docker", "Docker Compose", "Kubernetes",
  "Terraform", "Pulumi",
  "GitHub Actions", "GitLab CI",
  "Cypress", "Playwright", "Jest",

  /* Cloud / Serverless */
  "AWS Lambda", "Vercel", "Netlify Functions", "Cloudflare Workers",
  "Firebase", "Supabase",

  /* Headless CMS & e-comm */
  "Strapi", "Sanity", "Contentful", "Directus",
  "Shopify", "Medusa.js", "Saleor",


];

export const predefinedSuitableFor = [
  "Freelancers",
  "Agencies",
  "Startups",
  "Small Businesses",
  "Large Enterprises",
  "SaaS Companies",
  "E-commerce Stores",
  "Online Marketplaces",
  "Digital Product Creators",
  "Bloggers & Influencers",
  "Content Creators",
  "Educational Institutions",
  "Coaches & Course Creators",
  "Non-Profit Organizations",
  "Event Organizers",
  "Restaurants & Cafés",
  "Real-Estate Agencies",
  "Medical & Health Practices",
  "Finance / FinTech",
  "Crypto & NFT Projects",
  "Travel & Booking Platforms",
  "Job Boards",
  "Community Forums",
  "Streaming & Media",
  "Portfolio Showcases",
  "Corporate Websites",
  "Landing Pages",
  "Mobile Apps",
  "Web Applications",
  "PWA / Offline Apps",
  "Microfinance banks", "Fintech startups",
  "financial institutions", "microfinance businesses", "entrepreneurs"
];

export const categories = [
  // Web templates
  "Landing Page",
  "Corporate Website",
  "Portfolio",
  "Blog / Magazine",
  "CMS Theme",
  "E-commerce Theme",
  "Admin Dashboard",
  "UI Kit / Design System",
  "Email Template",
  "Mobile App UI",

  // Code & Functionality
  "Complete Web App",
  "SaaS Starter Kit",
  "API / Back-end",
  "Authentication Module",
  "Payment Integration",
  "Booking System",
  "Chat & Messaging",
  "Analytics / Dashboards",
  "PWA / Offline App",

  // CMS / Platform-specific
  "WordPress Theme",
  "WooCommerce Theme",
  "Shopify Theme",
  "Magento Theme",
  "Ghost Theme",
  "Headless CMS Starter",

  // Assets & Add-ons
  "React Components",
  "Vue Components",
  "HTML Snippets",
  "Icons & Illustrations",
  "3D Assets",
  "Lottie Animations",

  // Niches
  "Real Estate",
  "Restaurant & Food",
  "Medical & Health",
  "Education & LMS",
  "Events & Conferences",
  "Travel & Tourism",
  "Finance & FinTech",
  "Crypto / NFT",
  "And More"

];

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const helpDurationLabels: Record<string, string> = {
  "1w": "1 Week",
  "1m": "1 Month",
  "2m": "2 Months",
  "3m": "3 Months",
  "4m": "4 Months",
  "6m": "6 Months",
  "1y": "1 Year",
};

export function isExpired(purchase: any) {
  const now = new Date();
  const expiry = new Date(purchase.expiryDate);

  return now > expiry;
}
