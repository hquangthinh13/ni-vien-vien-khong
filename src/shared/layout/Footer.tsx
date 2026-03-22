import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/shared/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/ui/hover-card";
import Link from "next/link";
import {
  SiFacebook,
  SiYoutube,
  SiZalo,
  SiMessenger,
} from "@icons-pack/react-simple-icons";
import EmbeddedMap from "@/features/contact/ui/EmbeddedMap";
import { fetchContactPage } from "@/features/contact/api/contactPage.api";
import { Locale } from "@/types/locale";
import { getLocale, getTranslations } from "next-intl/server";

const Footer = async () => {
  const locale = (await getLocale()) as Locale;
  const response = await fetchContactPage({
    locale,
  });

  const SOCIAL_LINKS = [
    {
      icon: SiFacebook,
      href:
        response.data?.facebookLink ||
        "https://www.facebook.com/NiVienVienKhong",
      size: 24,
    },
    {
      icon: SiYoutube,
      href:
        response.data?.youtubeLink ||
        "https://www.youtube.com/c/NiVi%E1%BB%87nVi%C3%AAnKh%C3%B4ng",
      size: 26,
    },
    {
      icon: SiMessenger,
      href: response.data?.messengerLink || "https://m.me/Nivienvienkhong",
      size: 24,
    },
    {
      icon: SiZalo,
      href: response.data?.zaloLink || "https://zalo.me/0974469963",
      size: 28,
    },
  ];
  const t = await getTranslations("Footer");

  return (
    <footer className="relative w-full border-t border-border bg-card pt-8 pb-4 mt-auto">
      <div className=" mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm px-4">
          {/* Lien he */}
          <div className="space-y-4 md:col-span-6 ">
            <div className="space-y-2">
              <h1 className="font-bold uppercase justify-center flex md:justify-start">
                {t("contact")}
              </h1>
              <Separator className="mx-auto max-w-32 md:max-w-full" />
            </div>
            <div className="space-y-2 flex-col flex items-center md:items-start">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                    <MapPin
                      size={15}
                      strokeWidth={1.5}
                      color="var(--muted-foreground)"
                    />
                    <p className="text-muted-foreground text-center md:text-left">
                      {response.data?.address}
                    </p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center items-center w-fit h-auto aspect-video p-0 overflow-hidden border-none shadow-2xl">
                  <EmbeddedMap />
                </HoverCardContent>
              </HoverCard>

              <div className="flex space-x-2 items-center">
                <Phone
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">
                  {response.data?.phoneNumber}
                </p>
              </div>

              <div className="flex space-x-2 items-center">
                <Mail
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">
                  {response.data?.emailPrimary}
                </p>
              </div>

              <div className="flex space-x-2 items-center">
                <Mail
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">
                  {response.data?.emailSecondary}
                </p>
              </div>
            </div>
          </div>

          {/* Danh muc noi bat */}
          <div className="space-y-4 md:col-span-3">
            <div className="space-y-2">
              <h1 className="font-bold uppercase justify-center flex md:justify-start">
                {t("highlight")}
              </h1>
              <Separator className="mx-auto max-w-32 md:max-w-full" />
            </div>
            <div className="space-y-2 text-muted-foreground flex flex-col items-center md:items-start">
              <Link
                href="/course"
                className="hover:text-primary transition-colors"
              >
                {t("highlight-01")}{" "}
              </Link>
              <Link
                href="/library/blog"
                className="hover:text-primary transition-colors"
              >
                {t("highlight-02")}{" "}
              </Link>
              <Link
                href="/library/calligraphy"
                className="hover:text-primary transition-colors"
              >
                {t("highlight-03")}{" "}
              </Link>
              <Link
                href="/activity"
                className="hover:text-primary transition-colors"
              >
                {t("highlight-04")}{" "}
              </Link>
            </div>
          </div>

          {/* Theo doi ngay */}
          <div className="space-y-4 md:col-span-3">
            <div className="space-y-2">
              <h1 className="font-bold uppercase justify-center flex md:justify-start">
                {t("follow")}
              </h1>
              <Separator className="mx-auto max-w-32 md:max-w-full" />
            </div>
            <div className="flex gap-6 items-center justify-center md:justify-start text-foreground">
              {SOCIAL_LINKS.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <social.icon
                    size={social.size}
                    className="fill-current hover:fill-primary transition-all duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>
          {/*  */}
        </div>

        <div className="mt-8 pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ni Viện Viên Không. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
