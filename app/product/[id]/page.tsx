// Get dynamic metadata based on product
import ProductDetails from "@/components/ProductDetails";
import { baseUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);

  try {
    const res = await fetch(`${baseUrl}/themes/product/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Product not found");

    const item = await res.json();
    const product = item?.data || item;

    const fullUrl = `${baseUrl}/product/${id}`;
    const image = product.galleryImages?.[0] || `${baseUrl}/default-product-image.jpg`;
    const description = product.overview?.slice(0, 150) || "Check out this amazing product on our marketplace.";

    return {
      title: product.title,
      description,
      openGraph: {
        title: product.title,
        description,
        url: fullUrl,
        type: "website",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description,
        images: [image],
        creator: "@yourbrandhandle", // optional
      },
      alternates: {
        canonical: fullUrl,
      },
      metadataBase: new URL(baseUrl),
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for does not exist.",
    };
  }
}


// Get page content
export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id); // explicitly decode

  try {
    const res = await fetch(`${baseUrl}/themes/product/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Product not found");
    const item = await res.json();

    return (
      <div className="container mx-auto py-6">
        <ProductDetails
          item={item?.data}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">Product not found.</p>
      </div>
    );
  }
}
