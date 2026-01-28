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
    <footer className="w-full border-t border-border bg-card py-8 mt-auto">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm px-4">
          <div className="space-y-4 md:col-span-6 lg:row-span-2">
            <div className="space-y-2">
              <h4 className="font-bold uppercase"> {t("contact")} </h4>
              <Separator />
            </div>

            <div className="space-y-2">
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

          <div className="space-y-4 md:col-span-3">
            <div className="space-y-2">
              <h4 className="font-bold uppercase"> {t("highlight")}</h4>
              <Separator />
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("highlight-01")}{" "}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("highlight-02")}{" "}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("highlight-03")}{" "}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("highlight-04")}{" "}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-3">
            <div className="space-y-2">
              <h4 className="font-bold uppercase"> {t("follow")}</h4>
              <Separator />{" "}
            </div>

            <div className="flex gap-6 items-center text-foreground">
              {SOCIAL_LINKS.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:opacity-60 flex items-center justify-center"
                >
                  <social.icon size={social.size} className="fill-current" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ni Viện Viên Không. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
