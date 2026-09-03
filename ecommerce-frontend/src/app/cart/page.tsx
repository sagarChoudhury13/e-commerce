"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { CartItemComponent } from "@/components/cart/CartItem"; 

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate subtotal directly from the Zustand items array
  const subtotal = items.reduce((total, item) => {
    const safePrice = Number(item.products.price) || 0;
    const safeQuantity = Number(item.quantity) || 0;
    return total + (safePrice * safeQuantity);
  }, 0);

  // Free shipping over ₹500
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">Add some products to get started.</p>
        <Button size="lg" className="flex items-center gap-2">
          <Link href="/products" className="flex items-center gap-2">
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

          {/* Render Cart Items directly from Zustand state */}
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent 
                key={item.productId} 
                item={item} 
              />
            ))}
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
                  <span className="text-muted-foreground">Price ({items.length} items)</span>
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