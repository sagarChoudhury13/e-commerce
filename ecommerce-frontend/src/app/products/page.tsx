import { ProductGrid } from "@/components/products/ProductGrid";

// Fetch directly inside the component
export default async function ProductsPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    // 'no-store' ensures it fetches fresh data from Postgres every time
    cache: "no-store", 
  });

  if (!response.ok) {
    return <div>Failed to load products</div>;
  }

  const products = await response.json();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      {/* Pass the data from Express directly into your grid component */}
      <ProductGrid products={products} />
    </div>
  );
}