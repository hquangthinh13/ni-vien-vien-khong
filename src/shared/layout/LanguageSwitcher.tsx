"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { normalizeLocale, SUPPORTED_LOCALES, type Locale } from "@/types/locale";

interface LanguageSwitcherProps {
  className?: string;
}

function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return normalizeLocale(undefined);

  const locale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1];

  return normalizeLocale(locale);
}

function LanguageSwitcherComponent({ className }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Footer");
  const [currentLocale, setCurrentLocale] = useState<Locale>(() =>
    getLocaleFromCookie(),
  );

  const toggleLanguage = () => {
    const currentIndex = SUPPORTED_LOCALES.indexOf(currentLocale);
    const newLocale =
      SUPPORTED_LOCALES[(currentIndex + 1) % SUPPORTED_LOCALES.length];
    const query = searchParams.toString();
    const hash = window.location.hash;
    const destination = `${pathname}${query ? `?${query}` : ""}${hash}`;

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; samesite=lax`;

    setCurrentLocale(newLocale);
    router.replace(destination, { scroll: false });
    router.refresh();
  };

  const languageLabel =
    currentLocale === "vi" ? "Tiếng Việt" : "English";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={`${t("language")}: ${languageLabel}`}
      className={cn(
        "hover:bg-accent/0 px-0 text-xs",
        className,
      )}
    >
      <Icon
        icon={currentLocale === "vi" ? "circle-flags:vn" : "circle-flags:us"}
      />
      <span>{languageLabel}</span>
    </Button>
  );
}

const LanguageSwitcher = dynamic<LanguageSwitcherProps>(
  () => Promise.resolve(LanguageSwitcherComponent),
  {
    ssr: false,
    loading: () => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled
        className="h-8 min-w-24 border border-border/80 bg-background/50"
      >
        ...
      </Button>
    ),
  },
);

export { LanguageSwitcher };
export default LanguageSwitcherComponent;
