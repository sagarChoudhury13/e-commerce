import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/types";

// Fetch directly inside the component
async function getProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    // 'no-store' ensures it fetches fresh data from Postgres every time
    cache: "no-store", 
  });

  if (!response.ok) return [];

  const {count , data } = await response.json();

  return (data);
  
  }

  export default async function ProductsPage() {

  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
      </div>
      
      {/* Drop in the reusable grid */}
      <ProductGrid products={products} />
    </div>
  );
}