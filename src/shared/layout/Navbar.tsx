import React from "react";
import { useTranslations } from "next-intl";
import logo from "@/public/logo_slogan.svg";
import Image from "next/image";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";

import MobileNavigationMenu from "./MobileNavigationMenu";
import DesktopNavigationMenu from "./DesktopNavigationMenu";
import useMenuConfig from "@/shared/lib/menu-config";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const menuConfig = useMenuConfig();

  return (
    <div className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto max-w-7xl p-4 grid grid-cols-3 items-center">
        {" "}
        <Link className="flex mr-auto" href="/">
          <Image
            src={logo}
            alt="Logo"
            className="max-h-14 h-auto w-auto"
            loading="eager"
            priority
          />
        </Link>
        <div className="flex justify-center z-60">
          <DesktopNavigationMenu menuData={menuConfig} />
        </div>
        <div className="flex items-center gap-2 justify-end">
          {" "}
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Menu"
                variant="ghost"
                size="icon"
                className="lg:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 p-0 space-y-0 gap-0">
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
