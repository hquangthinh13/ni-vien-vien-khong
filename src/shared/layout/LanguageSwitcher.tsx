"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

function getLocaleFromCookie() {
  if (typeof document === "undefined") return "vi";
  const locale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1];

  return locale === "en" ? "en" : "vi";
}

const LanguageSwitcher = () => {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = React.useState<"vi" | "en">(() =>
    getLocaleFromCookie(),
  );

  const toggleLanguage = () => {
    const newLocale = currentLocale === "vi" ? "en" : "vi";

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; samesite=lax`;

    setCurrentLocale(newLocale);
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={toggleLanguage}
      disabled={true}
      className="flex items-center gap-2 hover:cursor-pointer transition-all"
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
