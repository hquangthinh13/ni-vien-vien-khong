import React from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import lineOrnament from "@/public/ornament-01.svg";
import CalligraphyList from "@/features/calligraphy/ui/CalligraphyList";
import { fetchCalligraphiesByCategory } from "@/features/calligraphy/api/calligraphy.api";
import type { CalligraphyCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Thư pháp thư họa",
};
export default async function CaligraphyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { category: categorySlug, page: pageSlug } = await searchParams;
  const currentPage = Number(pageSlug) || 1;

  const categoryMapping: Record<string, CalligraphyCategory> = {
    "kinh-phap-cu": "Kinh Pháp Cú",
    "kinh-tung": "Kinh Tụng",
    "chu-de-khac": "Chủ Đề Khác",
    all: "Tất cả",
  };
  const initialCategory = categoryMapping[categorySlug || ""] || "Tất cả";

  const res = await fetchCalligraphiesByCategory({
    locale,
    category: initialCategory,
    pagination: { page: currentPage, pageSize: 6 },
    populate: ["coverImage", "relatedCalligraphies"],
  });
  // console.log("Fetched calligraphies for category:", initialCategory, res);
  const initialData = Array.isArray(res.data) ? res.data : [];
  const paginationMeta = res.meta?.pagination;
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

      <div className="w-full px-4">
        <CalligraphyList
          key={`${initialCategory}-${currentPage}`}
          initialCategory={initialCategory}
          locale={locale}
          paginationMeta={paginationMeta}
          currentPage={currentPage}
          initialCalligraphies={initialData}
        />
      </div>
    </div>
  );
}
