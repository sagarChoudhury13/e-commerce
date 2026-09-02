"use client"

import Image from "next/image";
import { ShoppingCart, ImageIcon, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/index";
import { useCartStore } from "@/store/useCartStore";
import { useErrorToast } from "@/hooks/error-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "../ui/toast";


export function ProductCard({ product }: { product: Product }) {
  // Connect directly to Zustand
  const user = useAuthStore((state)=> state.user)
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCartItem = useCartStore((state) => state.clearCartItem);
   const items = useCartStore((state) => state.items);
  
  // Call the toast hook safely inside the React component
  const { showErrorToast } = useErrorToast();
  
const cartItem = items.find((item) => Number(item.productId) === Number(product.id));
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleUpdate = (newQuantity: number) => {
    if(!user){
      return (toast.add({
        type: "error",
        title: "No account found",
        description: "Please log in to buy products.",
      }))
    }

    if(newQuantity === 0){
      return clearCartItem(product.id, showErrorToast);
    }

   if(!cartItem){
      
      return addToCart(product, showErrorToast); 
    }
    return updateQuantity(product.id, newQuantity, showErrorToast);
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
        {quantity === 0 ? (
          <Button onClick={() => handleUpdate(1)} className="w-full" variant="default">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full h-10 border border-input rounded-md overflow-hidden bg-background">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-full w-10 rounded-none hover:bg-muted"
              onClick={() => handleUpdate(quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="font-semibold text-sm flex-1 text-center select-none">
              {quantity}
            </span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-full w-10 rounded-none hover:bg-muted"
              onClick={() => handleUpdate(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}