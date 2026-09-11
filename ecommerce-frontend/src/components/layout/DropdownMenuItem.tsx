"use client";

import Link from "next/link";
import { ChevronDown, Grid2X2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CATEGORIES = [
  { label: "Clothing", query: "clothing" },
  { label: "Electronics", query: "electronics" },
  { label: "Home Essentials", query: "home" },
  { label: "Accessories", query: "accessories" },
  { label: "Grocery", query: "grocery" },
];

export function CategoryDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button variant="ghost">
          <Grid2X2 className="h-4 w-4 " />
          <span className=" text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">Categories</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-52 rounded-xl shadow-lg border-muted/50 mt-1">
        {CATEGORIES.map((category) => (
          <DropdownMenuItem key={category.query} className="cursor-pointer rounded-lg mx-1 my-0.5">
            {/* Redirects to the /search route with the category as the query */}
            <Link href={`/search?q=${encodeURIComponent(category.query)}`} className="w-full font-medium text-sm">
              {category.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}