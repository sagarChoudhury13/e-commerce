"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useCartStore } from "@/store/useCartStore";
import { useAddressStore } from "@/store/useAddressStore"; 
import { CartItemComponent } from "@/components/cart/CartItem"; 
import {useAuthStore} from "@/store/useAuthStore";
import { useErrorToast } from "@/hooks/error-toast";
import { useRouter } from "next/navigation";

export function CartClient() {
  const [mounted, setMounted] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const addresses = useAddressStore((state) => state.addresses);
  const selectedAddress = addresses.find(a=> a.id === user?.defaultShippingAddress)
  const setAddresses = useAddressStore((state) => state.setAddresses);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setAddresses();
  }, [setAddresses]);

  if (!mounted) return null;

  const subtotal = items.reduce((total, item) => {
    const safePrice = Number(item.products.price) || 0;
    const safeQuantity = Number(item.quantity) || 0;
    return total + (safePrice * safeQuantity);
  }, 0);

  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + deliveryFee;

  const { showErrorToast } = useErrorToast();

  const placeOrder = async() => {
    try {
      const token = localStorage.getItem("token");
      if(token === null){
        showErrorToast(undefined, "User not authenticated");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
      })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify({ 
          code: errorData.errorCode, 
          message: errorData.message 
        }));
      }

      const newOrder = await response.json();
    
    // Clear the global cart since they just bought everythingorder
    useCartStore.getState().clearCart();
      router.push(`/order/${newOrder.order.id}`);
  }catch (err:any)
    {
      try {
          const parsedError = JSON.parse(err.message);
          showErrorToast(parsedError.code, parsedError.message);
        } catch {
          showErrorToast(undefined, "Network error. Is the server running?");
        }
    }
}

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Your cart is empty</h2>
        <Button size="lg" className="mt-6">
          <Link href="/products" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-8 space-y-6">
        
        <Card>
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Deliver to:</p>
                {selectedAddress ? (
                  <>
                    <p className="font-medium">{selectedAddress.lineOne}, {selectedAddress.lineTwo}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.city}, {selectedAddress.country} {selectedAddress.pincode}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No address selected</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              {selectedAddress ? "Change Address" : (
                <><Plus className="h-4 w-4 mr-2" /> Add Address</>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {items.map((item) => (
            <CartItemComponent key={item.productId} item={item} />
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-4">
        <Card className="sticky top-8">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg">Price Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <span>Price ({items.length} items)</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <Button 
              className="w-full mt-6" 
              size="lg"
              disabled={!selectedAddress}
              onClick = {placeOrder}
            >
            Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}