"use client"

import Image from "next/image";
import { Plus, Minus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useCartStore } from "@/store/useCartStore";
import { useErrorToast } from "@/hooks/error-toast";
import type { Product } from "@/types/index"; // Adjust path if needed

interface CartItemProps {
  item: { productId: number; quantity: number; products: Product }; 
}

export function CartItemComponent({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCartItem = useCartStore((state) => state.clearCartItem);
  const { showErrorToast } = useErrorToast();

  const { productId, quantity, products: product } = item;

  const handleDecrease = () => {
    if (quantity <= 1) {
      clearCartItem(productId, showErrorToast);
    } else {
      updateQuantity(productId, quantity - 1, showErrorToast);
    }
  };

  const handleIncrease = () => {
    updateQuantity(productId, quantity + 1, showErrorToast);
  };

  const handleRemove = () => {
    clearCartItem(productId, showErrorToast);
  };

  return (
    <Item variant="outline" className="w-full p-4 gap-4">
      {/* 1. Image Media */}
      <ItemMedia className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        )}
      </ItemMedia>

      {/* 2. Product Info */}
      <ItemContent className="flex-1">
        <ItemTitle className="line-clamp-2 text-base font-medium">
          {product.name}
        </ItemTitle>
        <ItemDescription className="font-bold text-foreground mt-1.5 text-lg">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </ItemDescription>
      </ItemContent>

      {/* 3. Actions (Quantity + Remove) */}
      <ItemActions className="flex flex-col items-end gap-3 justify-between sm:flex-row sm:items-center">
        
        {/* Quantity Selector */}
        <div className="flex items-center border border-input rounded-md overflow-hidden h-9 bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-9 rounded-none hover:bg-muted"
            onClick={handleDecrease}
          >
            <Minus className="h-3.5 w-3.5" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <div className="flex h-full w-10 items-center justify-center text-sm font-medium select-none">
            {quantity}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-full w-9 rounded-none hover:bg-muted"
            onClick={handleIncrease}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
        
      </ItemActions>
    </Item>
  );
}