import { Metadata } from "next";
import { HomePage } from "@/components/homeClient/page";
import type { Product } from "@/types";

// 1. Export standard SEO metadata
export const metadata: Metadata = {
  title: "SHOP XYZ | Premium Apparel, Accessories & Daily Needs",
  description: "Discover premium apparel, cutting-edge accessories, and daily needs at SHOP XYZ. Enjoy free express shipping, secure checkout, and 30-day returns.",
  keywords: ["online shopping", "premium apparel", "accessories", "daily needs", "SHOP XYZ", "ecommerce India"],
  openGraph: {
    title: "SHOP XYZ | Redefine Your Shopping Experience",
    description: "Discover premium apparel, cutting-edge accessories, and daily needs all at one place.",
    url: "https://your-domain.com", // Replace with your actual domain
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

  // 3. Define JSON-LD Structured Data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SHOP XYZ",
    "url": "https://your-domain.com", // Replace with your actual domain
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://your-domain.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomePage />
    </main>
  );
}