"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import Link from "next/link";

import { MenuItem } from "@/shared/lib/menu-config";
import { ChevronDown } from "lucide-react";

const RecursiveMenuItem = ({ item }: { item: MenuItem }) => {
  if (item.items && item.items.length > 0) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="text-md cursor-pointer">
          <Link href={item.href || "#"} className="w-full ">
            {item.title}
          </Link>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {item.items.map((subItem: MenuItem, index: number) => (
              <RecursiveMenuItem key={index} item={subItem} />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem asChild className="text-md">
      <Link href={item.href || "#"} className="w-full cursor-pointer">
        {item.title}
      </Link>
    </DropdownMenuItem>
  );
};

const NavDropdownItem = ({ menu }: { menu: MenuItem }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-md font-bold cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:outline-none"
          >
            {menu.href ? (
              <Link className="" href={menu.href}>
                {menu.title}
              </Link>
            ) : (
              menu.title
            )}{" "}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          {menu.items?.map((subItem: MenuItem, subIdx: number) => (
            <RecursiveMenuItem key={subIdx} item={subItem} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default function DesktopNavigationMenu({
  menuData,
}: {
  menuData: MenuItem[];
}) {
  return (
    <div className="hidden md:flex items-center gap-2">
      {menuData.map((menu, idx) => {
        if (!menu.items) {
          return (
            <Button
              key={idx}
              variant="ghost"
              asChild
              className="text-md font-bold"
            >
              <Link href={menu.href || "#"}>{menu.title}</Link>
            </Button>
          );
        }

        return <NavDropdownItem key={idx} menu={menu} />;
      })}
    </div>
  );
}
