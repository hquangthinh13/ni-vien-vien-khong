import React from "react";
import { useTranslations } from "next-intl";
import logo from "@/public/logo_slogan.svg";
import Image from "next/image";
import { cn } from "../lib/utils";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Menu, MessageCircleQuestion } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import MobileNavigationMenu from "./MobileNavigationMenu";
import DesktopNavigationMenu from "./DesktopNavigationMenu";
import useMenuConfig from "@/shared/lib/menu-config";
export default function Navbar({ className }: { className?: string }) {
  const t = useTranslations("Navbar");

  const menuConfig = useMenuConfig();

  return (
    <div className={cn("sticky top-0 z-50 border-b bg-card", className)}>
      <div className="mx-auto max-w-7xl px-4 py-2 grid grid-cols-3 items-center">
        <Link className="flex mr-auto" href="/">
          <Image
            src={logo}
            alt="Logo"
            className="max-h-10 h-auto w-auto"
            loading="eager"
            priority
          />
        </Link>
        <div className="flex justify-center z-60">
          <DesktopNavigationMenu menuData={menuConfig} />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Button
            asChild
            variant="ghost"
            className="hover:bg-accent/0"
          >
            <Link
              href="/library/question#question-form"
              aria-label={t("questionCta")}
            >
              <MessageCircleQuestion data-icon="inline-start" />
              <span className="hidden sm:inline">{t("questionCta")}</span>
            </Link>
          </Button>
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

              <div
                data-lenis-prevent
                className="overflow-y-auto h-full pb-20 pt-0 mt-0"
              >
                <MobileNavigationMenu menuData={menuConfig} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>{" "}
    </div>
  );
}
