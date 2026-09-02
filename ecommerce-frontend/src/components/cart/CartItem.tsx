import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdate: (productId: number, newQuantity: number) => void;
}

export function CartItem({ product, quantity, onUpdate }: CartItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 bg-muted shrink-0 rounded-md overflow-hidden">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="font-bold text-lg text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-input rounded-md overflow-hidden bg-background h-9 w-fit">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full w-9 rounded-none hover:bg-muted"
                onClick={() => onUpdate(product.id, quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold text-sm w-8 text-center select-none flex items-center justify-center">
                {Number.isNaN(quantity) ? 0 : quantity}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full w-9 rounded-none hover:bg-muted"
                onClick={() => onUpdate(product.id, quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
              onClick={() => onUpdate(product.id, 0)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}