import { Metadata } from "next";
import { HomePage } from "@/components/homeClient/page";


// 1. Export standard SEO metadata
export const metadata: Metadata = {
  title: "SHOP XYZ | Premium Apparel, Accessories & Daily Needs",
  description: "Discover premium apparel, cutting-edge accessories, and daily needs at SHOP XYZ. Enjoy free express shipping, secure checkout, and 30-day returns.",
  keywords: ["online shopping", "premium apparel", "accessories", "daily needs", "SHOP XYZ", "ecommerce India"],
  openGraph: {
    title: "SHOP XYZ | Redefine Your Shopping Experience",
    description: "Discover premium apparel, cutting-edge accessories, and daily needs all at one place.",
    url: "https://shop-xyz-ecommerce.vercel.app/",
    siteName: "SHOP XYZ",
    // images: [
    //   {
    //     url: "https://your-domain.com/og-image.jpg", // Replace with your actual OG image route
    //     width: 1200,
    //     height: 630,
    //     alt: "SHOP XYZ Homepage",
    //   },
    // ],
    locale: "en_IN",
    type: "website",
  }
};

export default async function Home() {

  return (
    <main>
      <HomePage />
    </main>
  );
}