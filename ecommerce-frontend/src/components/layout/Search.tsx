"use client"

import {useState, useRef, useEffect} from 'react';
import '@/app/globals.css'
import {Search, X} from 'lucide-react'
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button'

export const SearchBar = () =>{
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  return (
    <div className="flex items-center">
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                isSearchOpen ? "w-40 sm:w-64 opacity-100 mr-2" : "w-0 opacity-0 mr-0"
              }`}
            >
              <Input 
                ref={searchInputRef}
                type="search"
                placeholder="Search products..." 
                className="h-9 w-full rounded-full bg-muted/50"
              />
            </div>
            
            {/* Search Toggle Button */}
            <Button
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
          </div>
  )
}

export default SearchBar