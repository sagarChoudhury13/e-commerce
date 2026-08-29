import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};


export function ProductCard( ) {

  useEffect(()=>{
  async function fetchProducts (){
   // const products =fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`,
  } 
},[])


  return (
    <Card className="group overflow-hidden border-border flex flex-col h-full transition-all hover:border-primary/50 hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* For this example we use a standard <img>. In production, use Next.js <Image> */}
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4 flex-1">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-semibold text-lg tracking-tight line-clamp-2">
          {product.name}
        </h3>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4">
        <span className="font-bold text-lg">
          ${product.price.toFixed(2)}
        </span>
        <Button size="sm" className="w-full sm:w-auto shrink-0">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}