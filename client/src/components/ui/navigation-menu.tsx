"use client";

import * as React from "react";
import {
  NavigationMenu as NavigationMenuPrimitive,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "@radix-ui/react-navigation-menu";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
);

const NavigationMenu = NavigationMenuPrimitive;
NavigationMenu.displayName = "NavigationMenu";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
};
