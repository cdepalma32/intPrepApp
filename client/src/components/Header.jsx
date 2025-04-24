// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="bg-white border-b shadow-sm px-4 py-2 flex justify-between items-center">
      {/* Logo / App Name */}
      <Link to="/" className="text-xl font-bold text-primary">
        IntPrepApp
      </Link>

      {/* Navigation Links */}
      <NavigationMenu>
        <NavigationMenuList className="gap-4 hidden md:flex">
          <NavigationMenuItem>
            <Link to="/" className="text-sm hover:underline">
              Home
            </Link>
          </NavigationMenuItem>
          {user && (
            <NavigationMenuItem>
              <Link to="/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Side: Auth */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;