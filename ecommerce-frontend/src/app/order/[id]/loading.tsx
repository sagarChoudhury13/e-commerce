import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function OrderConfirmationSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      {/* Top Banner Skeleton */}
      <div className="bg-background border-b pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center text-center">
          {/* Animated Success Checkmark Placeholder */}
          <Skeleton className="w-24 h-24 rounded-full mb-6" />
          
          {/* Title Placeholder */}
          <Skeleton className="h-10 w-3/4 max-w-[300px] mb-4" />
          
          {/* Subtitle Placeholder */}
          <Skeleton className="h-6 w-full max-w-[400px] mb-8" />
          
          {/* Button Placeholder */}
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Smooth Timeline Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-6 border-b bg-muted/10">
                <Skeleton className="h-7 w-32" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="relative">
                  {/* The Background Line Skeleton */}
                  <div className="absolute top-5 bottom-5 left-[1.35rem] w-0.5 bg-muted/50 rounded-full" />

                  <div className="flex flex-col gap-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="relative flex items-start gap-6">
                        {/* Icon Container Skeleton */}
                        <Skeleton className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full" />
                        
                        {/* Step Content Skeleton */}
                        <div className="flex flex-col pt-2.5 w-full">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Details Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary Skeleton */}
            <Card className="border-none shadow-md">
              <CardHeader className="pb-4 border-b bg-muted/10">
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-32" />
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Skeleton */}
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </div>
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </main>
  );
}