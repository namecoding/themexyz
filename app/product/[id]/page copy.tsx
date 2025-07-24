import ProductDetails from "@/components/ProductDetails"

const sampleItem = {
  id: "6866538233e8a860b6443f2c",
  title: "product 123",
  overview: "Your logic is solid, but let me point out what’s good and what can be improved for clarity + consistency.",
  galleryImages: [
    "https://firebasestorage.googleapis.com/v0/b/themexyz-eba33.firebasestorage.app/o/themexyz%2F1751526078215_7448pwdz8.jpg?alt=media&token=9f9fba39-5ee6-4dc1-a3ce-674e66f6fa5e",
  ],
  isCategory: "Admin Dashboard",
  author: "Namecoding",
  authorId: "685aea9d3abdf17351e0467b",
  authorImage: "https://firebasestorage.googleapis.com/v0/b/themexyz-eba33.firebasestorage.app/o/themexyz%2F1751526078215_7448pwdz8.jpg?alt=media&token=9f9fba39-5ee6-4dc1-a3ce-674e66f6fa5e",
  builtWith: ["CSS3", "JavaScript", "TypeScript", "HTML5"],
  compatibleBrowsers: "All Major Browsers",
  date: "2025-07-22T08:30:12.149Z",
  demoUrl: "http://namecoding.net",
  adminDemoUrl: "http://namecoding.net/admin",
  documentation: "",
  featured: false,
  features: ["jQuery Integration", "SCSS Files Included", "Cross-Browser Support"],
  helpDurationSettings: [
    { type: "author", duration: "6m", feeUSD: 10, feeNGN: 100 },
  ],
  lastUpdate: "2025-07-03T09:55:14.656Z",
  layout: "Responsive",
  license: "regular",
  marketData: { rating: 0, reviews: 0, sales: 0 },
  preferredContact: [{ type: "WhatsApp", value: "07064672661" }],
  priceNGN: 2000,
  priceUSD: 399,
  quantity: 1,
  rating: 0,
  releaseDate: "2025-07-03T09:55:14.656Z",
  responseTime: "24 hours",
  reviews: 0,
  sales: 0,
  suitableFor: ["Small Business", "Large Enterprise"],
  tags: ["JavaScript", "Vue", "Angular"],
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = sampleItem;

  return {
    title: item.title,
    description: item.overview?.slice(0, 150) || "Product overview not available.",
    openGraph: {
      title: item.title,
      images: item.galleryImages?.length ? [item.galleryImages[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const item = sampleItem;

  return (
    <div className="container mx-auto py-6">
      <ProductDetails item={item} />
    </div>
  );
}
