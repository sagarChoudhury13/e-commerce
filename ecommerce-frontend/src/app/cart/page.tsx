import { CartClient } from "@/components/cart/CartClient";

export const metadata = {
  title: "Shopping Cart | SHOP XYZ",
  description: "Review your cart items and checkout.",
};

export default function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      {/* The client component handles all Zustand state and interactivity */}
      <CartClient />
    </main>
  );
}