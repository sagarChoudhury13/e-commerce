import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  GitBranch,
  LifeBuoy,
  LogIn,
  UserPlus,
  LogOut,
  User2,
  CircleUserRound,
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

import {Button} from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";




export function UserDropdown() {
  
  const user = useAuthStore((state) => state.user);
  const  logout = useAuthStore((state)=> state.logout)

  if(!user){
    return (<DropdownMenu>
      <DropdownMenuTrigger 
  nativeButton={true}
  render={<Button variant="ghost" className="relative h-8 w-8 rounded-full" />}
>
  <Avatar className="h-8 w-8 border border-border bg-primary/10 hover:opacity-80 transition-opacity">
    <AvatarFallback className="bg-primary text-primary-foreground font-semibold uppercase text-xs">
      <User2/>
    </AvatarFallback>
  </Avatar>
</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
      nativeButton={false}
      render={<Link href="/login" className="cursor-pointer" />}
    >
      <LogIn className="mr-2 h-4 w-4" />
      <span>
        Log In
      </span>
    </DropdownMenuItem>
        
        
        <DropdownMenuItem 
      nativeButton={false}
      render={<Link href="/signup" className="cursor-pointer" />}
    >
      <UserPlus className="mr-2 h-4 w-4" />
      <span>
        Sign Up
      </span>
    </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);
  }

  const initial = user?.name?.[0] || user?.email?.[0]  ;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
  nativeButton={true}
  render={<Button variant="ghost" className="relative h-8 w-8 rounded-full" />}
>
  <Avatar className="h-8 w-8 border border-border bg-primary/10 hover:opacity-80 transition-opacity">
    <AvatarFallback className="bg-primary text-primary-foreground font-semibold uppercase text-xs">
      {initial}
    </AvatarFallback>
  </Avatar>
</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
  {/* Header: User Info */}
 <DropdownMenuGroup>
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">
          {user.name ? `Hi ${user.name}!` : "My Account"}
        </p>
        <p className="text-xs leading-none text-muted-foreground">
          {user.email}
        </p>
      </div>
    </DropdownMenuLabel>
  </DropdownMenuGroup>
  
  <DropdownMenuSeparator />

  {/* Section 1: Account Links */}
  <DropdownMenuGroup>
    <DropdownMenuItem 
      nativeButton={false}
      render={<Link href="/orders" className="cursor-pointer" />}
    >
      <Package className="mr-2 h-4 w-4" />
      <span>Orders</span>
    </DropdownMenuItem>
    
    <DropdownMenuItem 
      nativeButton={false}
      render={<Link href="/addresses" className="cursor-pointer" />}
    >
      <MapPin className="mr-2 h-4 w-4" />
      <span>Addresses</span>
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />

  {/* Section 2: External/Support Links */}
  <DropdownMenuGroup>
    <DropdownMenuItem 
      nativeButton={false}
      render={<Link href="https://github.com/sagarChoudhury13/e-commerce" target="_blank" className="cursor-pointer" />}
    >
      <GitBranch className="mr-2 h-4 w-4" />
      <span>GitHub</span>
    </DropdownMenuItem>
    
    <DropdownMenuItem 
      nativeButton={false}
      render={<Link href="/support" className="cursor-pointer" />}
    >
      <LifeBuoy className="mr-2 h-4 w-4" />
      <span>Support</span>
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />

  {/* Section 3: Logout */}
  <DropdownMenuItem
    onClick={logout}
    variant="destructive"
  >
    <LogOut className="mr-2 h-4 w-4" />
    <span>Log out</span>
  </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)};


export default UserDropdown;