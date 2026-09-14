"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard"; // Adjust import path
import type { Product } from "@/types/index";
import { useErrorToast } from "@/hooks/error-toast";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showErrorToast } = useErrorToast()

  useEffect(() => {
   async function fetchSearchResults() {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
      if(token === null){
        showErrorToast(undefined, "User not authenticated");
        return;
      }
        // 1. Point to /search and use ?q= instead of ?search=
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search?q=${encodeURIComponent(query)}`,{
            method: "GET",
            headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        });
        
        if (res.ok) {
          const data = await res.json();
          // 2. Set the data directly, since your controller uses res.json(retrievedProducts)
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Searching for "{query}"...</p>
      </div>
    );
  }

  // Empty State
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">No results found</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any products matching <strong>"{query}"</strong>. Try checking your spelling or using more general terms.
        </p>
      </div>
    );
  }

  // Results Grid
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Search Results for "{query}"
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          {results.length} {results.length === 1 ? 'Product' : 'Products'} Found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </main>
  );
}