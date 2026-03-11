import React from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import lineOrnament from "@/public/ornament-01.svg";
import CalligraphyList from "@/features/calligraphy/ui/CalligraphyList";
import { fetchCalligraphiesByCategory } from "@/features/calligraphy/api/calligraphy.api";
import type { Locale } from "@/types/locale";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Thư pháp thư họa",
};
const CaligraphyPage = async () => {
  const locale = (await getLocale()) as Locale;
  const initialCategory = "Kinh Pháp Cú";

  const res = await fetchCalligraphiesByCategory({
    locale,
    category: initialCategory,
    pagination: { page: 1, pageSize: 12 },
    populate: "*",
  });

  const initialData = Array.isArray(res.data) ? res.data : [];

  return (
    <div className="w-full max-w-7xl mx-auto my-10">
      <div className="flex flex-col w-full gap-6 items-center mb-10 px-4">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Thư pháp thư họa
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12">
        <CalligraphyList
          initialCalligraphies={initialData}
          initialCategory={initialCategory}
          locale={locale}
        />
      </div>
    </div>
  );
};

export default CaligraphyPage;
