"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("vi");

  // Lấy locale từ cookie khi component mount
  useEffect(() => {
    const locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];
    if (locale) {
      setCurrentLocale(locale);
    }
  }, []);

  const toggleLanguage = () => {
    const newLocale = currentLocale === "vi" ? "en" : "vi";

    // 1. Lưu ngôn ngữ mới vào Cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

    // 2. Cập nhật state để giao diện đổi ngay lập tức
    setCurrentLocale(newLocale);

    // 3. Refresh để Server nhận locale mới
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={toggleLanguage}
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
}
