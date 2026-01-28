import React from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  SiFacebook,
  SiYoutube,
  SiZalo,
  SiMessenger,
} from "@icons-pack/react-simple-icons";
const SOCIAL_LINKS = [
  { icon: SiFacebook, href: "https://facebook.com/...", size: 20 },
  { icon: SiYoutube, href: "https://youtube.com/...", size: 22 },
  { icon: SiMessenger, href: "https://m.me/...", size: 20 },
  { icon: SiZalo, href: "https://zalo.me/...", size: 24 },
];
const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="relative w-full border-t border-border bg-card pt-8 pb-4 mt-auto">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm px-4">
          {/* Lien he */}
          <div className="space-y-4 md:col-span-6 ">
            <div className="space-y-2">
              <h4 className="font-bold uppercase justify-center flex md:justify-start">
                {t("contact")}
              </h4>
              <Separator className="mx-auto max-w-32 md:max-w-full" />
            </div>
            <div className="space-y-2 flex-col flex items-center md:items-start">
              <div className="flex space-x-2 items-center">
                <MapPin
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">{t("address-01")} </p>
              </div>

              <div className="flex space-x-2 items-center">
                <Phone
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">+84 97 446 99 63</p>
              </div>

              <div className="flex space-x-2 items-center">
                <Mail
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">lieuphap@gmail.com</p>
              </div>

              <div className="flex space-x-2 items-center">
                <Mail
                  size={15}
                  strokeWidth={1.5}
                  color="var(--muted-foreground)"
                />
                <p className="text-muted-foreground">
                  nivienvienkhong2019@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Danh muc noi bat */}
          <div className="space-y-4 md:col-span-3">
            <div className="space-y-2">
              <h4 className="font-bold uppercase justify-center flex md:justify-start">
                {t("highlight")}
              </h4>
              <Separator className="mx-auto max-w-32 md:max-w-full" />
            </div>
            <div className="space-y-2 text-muted-foreground flex flex-col items-center md:items-start">
              <a href="#" className="hover:text-primary transition-colors">
                {t("highlight-01")}{" "}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("highlight-02")}{" "}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("highlight-03")}{" "}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("highlight-04")}{" "}
              </a>
            </div>
          </div>

          {/* Theo doi ngay */}
          <div className="space-y-4 md:col-span-3">
            <div className="space-y-2">
              <h4 className="font-bold uppercase justify-center flex md:justify-start">
                {t("follow")}
              </h4>
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
