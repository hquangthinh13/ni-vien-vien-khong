"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import { normalizeLocale, SUPPORTED_LOCALES, type Locale } from "@/types/locale";

function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return normalizeLocale(undefined);
  const locale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1];

  return normalizeLocale(locale);
}

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = React.useState<Locale>(() =>
    getLocaleFromCookie(),
  );

  const toggleLanguage = () => {
    const currentIndex = SUPPORTED_LOCALES.indexOf(currentLocale);
    const newLocale =
      SUPPORTED_LOCALES[(currentIndex + 1) % SUPPORTED_LOCALES.length];

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; samesite=lax`;

    setCurrentLocale(newLocale);
    router.replace(pathname);
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={toggleLanguage}
      className="hover:bg-white/0 flex items-center gap-2 hover:cursor-pointer transition-all"
    >
      {currentLocale === "vi" ? (
        <>
          <Icon icon="circle-flags:vn" />
          <span>VI</span>
        </>
      ) : (
        <>
          <Icon icon="circle-flags:us" />
          <span>EN</span>
        </>
      )}
    </Button>
  );
};

const LanguageSwitcherWrapper = dynamic(() => import("./LanguageSwitcher"), {
  ssr: false,
  loading: () => (
    <Button variant="ghost" size="lg">
      ...
    </Button>
  ),
});

export { LanguageSwitcherWrapper as LanguageSwitcher };
export default LanguageSwitcher;
