"use client"

import { useState, useEffect } from "react";

import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Receipt, 
  MapPin,
  Calendar,
  IndianRupee
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useAuthStore } from "@/store/useAuthStore";

// Type definitions matching your backend response
interface OrderProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt : string;
  // Assuming your backend populates the product details. 
  // If not, you will just show the productId and quantity.
  product?: {
    name: string;
    price: number | string;
    imageUrl?: string;
  };
}

interface OrderEvent {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
}

interface Order {
  id: number;
  userId : number;
  netAmount: string | number;
  address: string;
  status: string;
  createdAt: string;
  orderProduct: OrderProduct[];
  orderEvent: OrderEvent[];
}

// --------------------------------------------------------
// 1. INDIVIDUAL ORDER CARD COMPONENT (The Collapsible)
// --------------------------------------------------------
function OrderCard({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper for Badge Colors
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED": return "bg-green-500 hover:bg-green-600";
      case "PROCESSING": return "bg-blue-500 hover:bg-blue-600";
      case "SHIPPED": return "bg-purple-500 hover:bg-purple-600";
      case "CANCELLED": return "bg-destructive hover:bg-destructive";
      default: return "bg-secondary text-secondary-foreground hover:bg-secondary";
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Card className="overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
        
        {/* TRIGGER HEADER */}
        <CollapsibleTrigger>
          <div className="p-5 cursor-pointer bg-card hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Order #{order.id}</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <div className="flex flex-col sm:items-end">
                <Badge className={`${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
                <span className="font-bold mt-1 text-base flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 mr-0.5" /> 
                  {Number(order.netAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        {/* EXPANDED CONTENT */}
        <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300 ease-out">
          <Separator />
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Products List */}
              <div className="p-6 border-b md:border-b-0 md:border-r bg-muted/10">
                <h4 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  Items in this order
                </h4>
                <div className="space-y-4">
                  {order.orderProduct.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 bg-background border rounded-md flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {item.product?.name || `Product ID: ${item.productId}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      {item.product?.price && (
                        <span className="text-sm font-medium">
                          ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="p-6 space-y-6 bg-background">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin className="h-4 w-4" /> Delivery Address
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {order.address}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Receipt className="h-4 w-4" /> Order Timeline
                  </h4>
                  <div className="space-y-2">
                    {order.orderEvent?.map((event, i) => (
                      <div key={event.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${i === order.orderEvent.length - 1 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                          {event.status}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(event.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// --------------------------------------------------------
// 2. MAIN ORDERS PAGE COMPONENT
// --------------------------------------------------------
export function OrdersClient() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = useAuthStore((state) => state.user);

  // Handle Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Orders
  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Ensure this route matches your backend GET route for user orders
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Assume backend returns an array of orders. If nested like { data: [...] }, adjust accordingly.
          setOrders(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchOrders();
    }
  }, [mounted, user]);

  if (!mounted) return null;

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground mt-1">View and track all your recent purchases.</p>
      </div>

      {loading ? (
        // Loading Skeleton
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-24 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        // Empty State
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed shadow-sm">
          <Receipt className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't placed any orders yet. Once you make a purchase, it will appear here.
          </p>
          <Button>
            <a href="/products">Start Shopping</a>
          </Button>
        </Card>
      ) : (
        // Orders List
        <div className="flex flex-col space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}