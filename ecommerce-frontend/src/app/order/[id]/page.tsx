import Link from "next/link";
import { cookies } from "next/headers";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  ArrowLeft,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

// 1. Updated Interface matching your exact GET response
interface OrderResponse {
  id: number;
  userId: number;
  netAmount: string | number;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderProduct: any[];
  orderEvent: {
    id: number;
    orderId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

// 2. Server-side fetch helper
async function getOrder(id: string): Promise<OrderResponse | null> {
  try {
    // Next.js 15 requires awaiting cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // If there is no token in the cookies, the server cannot fetch the order
    if (!token) {
      toast.add({
        title: "Authentication Error",
        description: "User not authenticated. Please log in.",
        type: "error",
      });
      return null;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/${id}`,
      {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: "no-store", // Always fetch the freshest order status
      },
    );

    if (!response.ok) {
      console.log(await response.json());
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch order", error);
    return null;
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 3. Unwrap the dynamic route params
  const { id } = await params;

  // 4. Fetch the data securely on the server
  const order = await getOrder(id);

  // 5. Error / Not Found State
  if (!order || !order.id) {
    return (
      <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center">
        <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the details for this order, or you are not authorized
          to view it.
          <br />
          <span className="text-sm text-destructive mt-2 inline-block">
            (Note: If you are using localStorage for auth, this Server Component
            cannot read it.)
          </span>
        </p>
        <Button>
          <Link href="/products">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  // Fallback just in case orderEvent is missing or not an array
  const eventsArray = Array.isArray(order.orderEvent) ? order.orderEvent : [];

  // 6. Success UI
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center mb-10 space-y-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order ID is{" "}
          <span className="font-semibold text-foreground">#{order.id}</span>
        </p>
        <Button variant="outline" className="mt-2">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Timeline */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {eventsArray.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1.5" />
                      {index !== eventsArray.length - 1 && (
                        <div className="w-px h-full bg-border my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">{event.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    order.status === "Delivered" ? "default" : "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Date
                </span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total Paid</span>
                <span>₹{Number(order.netAmount).toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed">
              <p>{order.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
