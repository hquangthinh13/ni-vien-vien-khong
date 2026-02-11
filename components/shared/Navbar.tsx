import React from "react";
import { useTranslations } from "next-intl";
import logo from "@/public/logo.svg";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";

import MobileNavigationMenu from "./MobileNavigationMenu";
import DesktopNavigationMenu from "./DesktopNavigationMenu";
import useMenuConfig from "@/lib/menu-config";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const menuConfig = useMenuConfig();

  return (
    <div className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
        <Image src={logo} alt="Logo" className="h-10 w-auto" />

        <DesktopNavigationMenu menuData={menuConfig} />

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] p-0 space-y-0 gap-0"
            >
              <SheetHeader className="p-4">
                <SheetTitle className="">{t("menu")}</SheetTitle>
              </SheetHeader>

              <div className="overflow-y-auto h-full pb-20 pt-0 mt-0">
                <MobileNavigationMenu menuData={menuConfig} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
