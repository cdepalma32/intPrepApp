import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const TestNav = () => {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Test Navigation Menu</h1>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <a href="#" className="px-4 py-2 text-sm hover:underline">
              Link One
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a href="#" className="px-4 py-2 text-sm hover:underline">
              Link Two
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default TestNav;
