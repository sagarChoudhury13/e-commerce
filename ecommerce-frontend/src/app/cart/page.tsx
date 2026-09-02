"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { useErrorToast } from "@/hooks/error-toast";
import type { Product } from "@/types";
import { CartItem } from "@/components/cart/CartItem"; // Import the new component

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { items, updateQuantity } = useCartStore();
  const { showErrorToast } = useErrorToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchCartProducts() {
      const productIds = Object.keys(items).map(Number).filter(id => !Number.isNaN(id));
      
      if (productIds.length === 0) {
        setCartProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const promises = productIds.map(id =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`).then(res => res.json())
        );
        
        const productsData = await Promise.all(promises);
        setCartProducts(productsData.filter(p => p && p.id));
      } catch (error) {
        showErrorToast(undefined, "Failed to load cart items.");
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted) {
      fetchCartProducts();
    }
  }, [items, mounted, showErrorToast]);

  if (!mounted) return null;

  const handleUpdate = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity, showErrorToast);
  };

  const subtotal = cartProducts.reduce((total, product) => {
    const quantity = items[product.id] || 0;
    const safePrice = Number(product.price) || 0;
    const safeQuantity = Number(quantity) || 0;
    return total + (safePrice * safeQuantity);
  }, 0);

  // Example logic: Free shipping over ₹500
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + deliveryFee;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p className="text-muted-foreground animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  if (cartProducts.length === 0 || Object.keys(items).length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">Add some products to get started.</p>
        <Button size="lg">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address Block + Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Address Section */}
          <Card>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">Deliver to:</p>
                  <p className="font-medium">123 React Avenue, Tech Park</p>
                  <p className="text-sm text-muted-foreground">Software City, Web State 400001</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Address
              </Button>
            </CardContent>
          </Card>

          {/* Render Cart Items */}
          <div className="space-y-4">
            {cartProducts.map((product) => {
              const quantity = items[product.id];
              if (!quantity) return null;

              return (
                <CartItem 
                  key={product.id} 
                  product={product} 
                  quantity={quantity} 
                  onUpdate={handleUpdate} 
                />
              );
            })}
          </div>
        </div>

        {/* Right Column: Price Breakdown Sidebar */}
        <div className="lg:col-span-4">
          <Card className="sticky top-8">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Price Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price ({cartProducts.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className={deliveryFee === 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              
              {deliveryFee === 0 && (
                <p className="text-green-600 text-sm font-medium pt-2">
                  You will save ₹50 on this order
                </p>
              )}
              
              <Button className="w-full mt-6" size="lg">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}