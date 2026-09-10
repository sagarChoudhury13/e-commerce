"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'

export const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false); // Closes the search bar
      setQuery(""); // Resets the input field
    }
  };

  return (
    // Replaced the wrapping <div> with a <form> to handle the "Enter" key press
    <form onSubmit={handleSearch} className="flex items-center">
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
          isSearchOpen ? "w-40 sm:w-64 opacity-100 mr-2" : "w-0 opacity-0 mr-0"
        }`}
      >
        <Input 
          ref={searchInputRef}
          type="search"
          placeholder="Search products..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded-full bg-muted/50"
        />
      </div>
      
      {/* Search Toggle Button */}
      <Button
        type="button" // Critical: Prevents this button from triggering form submission
        variant="ghost" 
        size="icon" 
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="text-muted-foreground hover:text-foreground rounded-full"
      >
        {isSearchOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle search</span>
      </Button>
    </form>
  )
}

export default SearchBar