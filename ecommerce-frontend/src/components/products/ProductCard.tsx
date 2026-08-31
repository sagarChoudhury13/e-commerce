"use client"

import { ShoppingCart, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import type { Product } from "@/types";
import Image from "next/image";




export function ProductCard({product}: {product : Product} ) {
  const handleAddToCart = () => {
    console.log(`Added ${product.name} to cart`);
  };
  return (
    <Card className="overflow-hidden flex flex-col group border-border">
      <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        )}
      </div>

      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-foreground">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" variant="default">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard