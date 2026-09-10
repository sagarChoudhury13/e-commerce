"use client";

import Image from "next/image";
import {
  ShoppingCart,
  ImageIcon,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Product } from "@/types/index";
import { useCartStore } from "@/store/useCartStore";
import { useErrorToast } from "@/hooks/error-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/components/ui/toast";
import {useRouter} from "next/navigation"

interface ProductDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDialog({ product, isOpen, onOpenChange }: ProductDialogProps) {
  // Zustand Stores
  const user = useAuthStore((state) => state.user);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCartItem = useCartStore((state) => state.clearCartItem);
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  const { showErrorToast } = useErrorToast();

  const cartItem = items.find((item) => Number(item.productId) === Number(product.id));
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleUpdate = (newQuantity: number) => {
    if (!user) {
      return toast.add({
        type: "error",
        title: "No account found",
        description: "Please log in to buy products.",
      });
    }

    if (newQuantity === 0) return clearCartItem(product.id, showErrorToast);
    if (!cartItem) return addToCart(product, showErrorToast);
    return updateQuantity(product.id, newQuantity, showErrorToast);
  };

  const handleBuyNow = () => {
    if (quantity === 0) handleUpdate(1);
    router.push("/cart");
    onOpenChange(false); // Close dialog on proceed
  };

  const parsedTags = (product as any).tags
    ? (product as any).tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name} Details</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-muted flex items-center justify-center min-h-75">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <ImageIcon className="h-32 w-32 text-muted-foreground/20" />
            )}
          </div>

          {/* Right: Details */}
          <div className="p-8 flex flex-col justify-center">
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {parsedTags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              {product.name}
            </h2>
            <p className="text-2xl font-bold mb-6 text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              {(product as any).description || "No description available for this product."}
            </p>

            {/* Dialog Cart Controls */}
            <div className="flex flex-col gap-3 mb-8">
              <Button onClick={handleBuyNow} size="lg" className="w-full h-14 text-base shadow-md">
                <Zap className="mr-2 h-5 w-5" /> Buy Now
              </Button>

              {quantity === 0 ? (
                <Button onClick={() => handleUpdate(1)} size="lg" variant="outline" className="w-full h-14 text-base">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full h-14 border border-input rounded-md overflow-hidden bg-background">
                  <Button variant="ghost" size="icon" className="h-full w-14 rounded-none hover:bg-muted" onClick={() => handleUpdate(quantity - 1)}>
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="font-semibold text-lg flex-1 text-center select-none">
                    {quantity} in cart
                  </span>
                  <Button variant="ghost" size="icon" className="h-full w-14 rounded-none hover:bg-muted" onClick={() => handleUpdate(quantity + 1)}>
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Express Delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}