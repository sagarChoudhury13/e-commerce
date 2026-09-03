import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { CartInitializer } from "@/components/cart/CartInitializer";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <Navbar />
        <CartInitializer />
        <main className="flex-1">
          {children}
        </main>
        <Toaster/>
      </body>
    </html>
  )
}
