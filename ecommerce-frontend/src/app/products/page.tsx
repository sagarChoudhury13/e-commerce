import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { ProductPagination }  from  '@/components/products/ProductPagination'
import { CartInitializer } from "@/components/cart/CartInitializer";


export const metadata = {
  title: "All Products | SHOP XYZ",
  description: "Browse our wide range of products and find what you love.",
};


const ITEMS_PER_PAGE = 6;

interface FetchResponse {
  count: number;
  data: Product[];
}

async function getProducts(skip: number): Promise<FetchResponse> {
  try {
    // Pass both skip and limit to the backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?skip=${skip}&take=${ITEMS_PER_PAGE}&sort=lastest`, { 
      method : "GET",
      headers: {"Contend-Type": "application/json"},
      cache: 'no-store' 
    });
    
    if (!res.ok) return { count: 0, data: [] };
    
    const responseData = await res.json();
    
    return {
      count: responseData.count || 0,
      data: Array.isArray(responseData.data) ? responseData.data : []
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { count: 0, data: [] };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Extract the count and data from the new backend structure
  const { count, data: products } = await getProducts(skip);
  
  // Calculate total pages (e.g., 25 items / 12 per page = 3 total pages)
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8"><CartInitializer />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
      </div>

      {/* Render the Grid */}
      <ProductGrid products={products} />

      {/* Render the Pagination */}
      <ProductPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />
    </div>
  );
}