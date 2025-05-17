import React, { useState } from "react";
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
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white border-b shadow-sm px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          IntPrepApp
        </Link>

        <div className="flex items-center gap-4">
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

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-xl text-gray-700 focus:outline-none"
          >
            ☰
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer bg-gray-200 text-gray-700">
                  <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden px-4 py-2 space-y-2 bg-white border-b shadow-sm">
          <Link to="/" className="block text-sm" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
