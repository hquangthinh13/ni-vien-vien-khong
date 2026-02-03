import React from "react";
import { useTranslations } from "next-intl";
import logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
interface MenuItem {
  title: string;
  href: string;
  desc: string;
}
interface MenuData {
  trigger: string;
  items: MenuItem[];
}
const Navbar = () => {
  const t = useTranslations("Navbar");

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-white">
      {/* --- DESKTOP NAVBAR --- */}
      <div className="hidden md:flex mx-auto max-w-6xl p-4 items-center justify-between">
        <div className="flex flex-1">
          <Image src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} font-bold`}
                >
                  <Link href="/">{t("home")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>{" "}
          <RenderMenu data={t.raw("about")} />
          <RenderMenu data={t.raw("activity")} />
          {/* <RenderMenu data={t.raw("retreat")} /> */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} font-bold`}
                >
                  <Link href="/course">{t("course.trigger")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <RenderMenu data={t.raw("library")} />
          <RenderMenu data={t.raw("visit")} />
          {/* <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} font-bold`}
                >
                  <Link href="/contact">{t("contact")}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu> */}
        </div>
        <div className="flex flex-1 justify-end">
          <LanguageSwitcher />
        </div>
      </div>
      {/* --- MOBILE NAVBAR --- */}
      <div className="flex md:hidden p-4 items-center justify-between">
        <Image src={logo} alt="Logo" className="h-8 w-auto" />

        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[250px] overflow-y-auto pl-3"
            >
              <SheetHeader className="pl-0">
                <SheetTitle> {t("menu")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-0">
                <Link href="/contact" className="px-2 py-3 font-bold text-sm">
                  {t("home")}
                </Link>
                <MobileNavItem data={t.raw("about")} />
                <MobileNavItem data={t.raw("activity")} />
                <MobileNavItem data={t.raw("course")} />
                <MobileNavItem data={t.raw("library")} />
                <MobileNavItem data={t.raw("visit")} />
                <Link href="/contact" className="px-2 py-3 font-bold text-sm">
                  {t("contact")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
const RenderMenu = ({ data }: { data: MenuData }) => {
  const linkTriggers = ["Tin tức", "News", "Activities", "Activity"];

  const shouldLink = linkTriggers.includes(data.trigger);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {shouldLink ? (
            <Link href="/activity">
              <NavigationMenuTrigger className="font-bold cursor-pointer">
                {data.trigger}
              </NavigationMenuTrigger>
            </Link>
          ) : (
            <NavigationMenuTrigger className="font-bold">
              {data.trigger}
            </NavigationMenuTrigger>
          )}
          <NavigationMenuContent>
            <ul className="min-w-65 ">
              {data.items.map((item, index) => (
                <ListItem key={index} title={item.title} href={item.href}>
                  {item.desc}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
function ListItem({
  title,
  children,
  href,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { title: string; href: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {/* <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p> */}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
const MobileNavItem = ({ data }: { data: MenuData }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value={data.trigger} className="border-b">
      <AccordionTrigger
        className="px-2 hover:no-underline hover:tracking-wide transition-all delay-150 duration-300 ease-in-out
 hover:cursor-pointer font-bold"
      >
        {data.trigger}
      </AccordionTrigger>
      <AccordionContent>
        <ul className="flex flex-col ">
          {data.items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="block p-3 pl-6 text-sm hover:bg- rounded-md"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
export default Navbar;
