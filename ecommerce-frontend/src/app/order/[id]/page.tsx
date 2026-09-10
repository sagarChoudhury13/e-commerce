import Link from "next/link";
import { cookies } from "next/headers";
import { 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Receipt,
  ClipboardList,
  Cog,
  Truck,
  PackageCheck,
  Check,
  Delete
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {toast} from '@/components/ui/toast'

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

// Map each status to a specific icon for a premium look
const ORDER_STEPS = [
  { status: "PENDING", label: "Order Placed", icon: ClipboardList },
  { status: "PROCESSING", label: "Processing", icon: Cog },
  { status: "SHIPPED", label: "Shipped", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: PackageCheck },
  { status: "CANCELLED", label: "Cancelled", icon: Delete}
];

async function getOrder(id: string): Promise<OrderResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      console.log("no token");
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`, {
      method: "GET",
     headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errordata = await response.json();
      console.log(errordata)  
    };
    return await response.json(); 
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function OrderConfirmationPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order || !order.id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Receipt className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Order Not Found</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          We couldn't find the details for this order, or you are not authorized to view it.
        </p>
        <Button size="lg" className="rounded-full">
          <Link href="/products">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const eventsArray = Array.isArray(order.orderEvent) ? order.orderEvent : [];
  
  // Calculate the highest completed step index for the continuous line fill
  const currentStepIndex = ORDER_STEPS.reduce((latest, step, index) => {
    return eventsArray.find(e => e.status === step.status) ? index : latest;
  }, 0);

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      {/* Top Banner Background */}
      <div className="bg-background border-b pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center text-center">
          
          {/* Animated Success Checkmark using Tailwind peer/group classes */}
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            {/* Outer expanding ring */}
            <div className="absolute inset-0 rounded-full bg-green-100 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            {/* Inner solid circle with pop-in animation */}
            <div className="relative flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg shadow-green-500/30 animate-in zoom-in duration-500 ease-out">
              {/* Check icon with a slight delay so it draws smoothly */}
              <Check className="w-8 h-8 text-white stroke-3 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200 fill-mode-backwards" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for shopping with us. Your order ID is <span className="font-semibold text-foreground">#{order.id}</span>
          </p>
          <Button variant="outline" className="rounded-full shadow-sm color-primary hover:border-primary transition-colors">
            <Link href="/products" className="flex items-center gap-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Smooth Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-6 border-b bg-muted/10">
                <CardTitle className="text-xl">Track Order</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                
                <div className="relative">
                  {/* The Background Line */}
                  <div className="absolute top-5 bottom-5 left-[1.35rem] w-0.5 bg-muted/50 rounded-full" />
                  
                  {/* The Animated Fill Line */}
                  <div 
                    className="absolute top-5 left-[1.35rem] w-0.5 bg-primary rounded-full transition-all duration-1000 ease-in-out"
                    style={{ height: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
                  />

                  <div className="flex flex-col gap-10">
  {ORDER_STEPS.map((step, index) => {
    // FIX: Normalize both strings to uppercase and remove whitespace to guarantee a match
    const matchingEvent = eventsArray.find(
      (e) => e.status?.trim().toUpperCase() === step.status?.trim().toUpperCase()
    );
    
    const isCompleted = !!matchingEvent;
    const isCurrent = currentStepIndex === index;
    const Icon = step.icon;

    return (
      <div key={step.status} className="relative flex items-start gap-6 group">
        
        {/* Animated Icon Container */}
        <div 
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-500 ease-out bg-background
            ${isCompleted ? 'border-primary text-primary shadow-sm' : 'border-muted text-muted-foreground'}
            ${isCurrent ? 'ring-4 ring-primary/10 scale-110' : 'scale-100'}
          `}
        >
          <Icon className={`w-5 h-5 transition-transform duration-500 ${isCurrent ? 'animate-[spin_3s_linear_infinite]' : ''} ${step.status.toUpperCase() === 'PROCESSING' && isCurrent ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
        </div>
        
        {/* Step Content */}
        <div className="flex flex-col pt-2.5">
          <h4 className={`text-base font-semibold transition-colors duration-300 ${
            isCompleted ? 'text-foreground' : 'text-muted-foreground/60'
          }`}>
            {step.label}
          </h4>
          
          <div className="mt-1 h-5 overflow-hidden">
            <div className={`transition-all duration-500 transform ${
              isCompleted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}>
              {matchingEvent?.createdAt && (
                <p className="text-sm text-muted-foreground">
                  {new Date(matchingEvent.createdAt).toLocaleString("en-IN", {
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-4 border-b bg-muted/10">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Status</span>
                  <Badge 
                    variant={order.status === "DELIVERED" ? "default" : "secondary"}
                    className={order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Ordered On
                  </span>
                  <span className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center font-bold text-xl text-foreground">
                  <span>Total Amount</span>
                  <span>₹{Number(order.netAmount).toLocaleString("en-IN")}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> 
                <h3 className="font-semibold text-foreground">Delivery Address</h3>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {order.address}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}