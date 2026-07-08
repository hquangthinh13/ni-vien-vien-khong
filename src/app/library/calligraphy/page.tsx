import React from "react";
import { getAppLocale } from "@/shared/lib/i18n";
import CalligraphyList from "@/features/calligraphy/ui/CalligraphyList";
import { fetchCalligraphiesByCategory } from "@/features/calligraphy/api/calligraphy.api";
import type { CalligraphyCategory } from "@/types/categories";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

export const metadata: Metadata = {
  title: "Thư pháp thư họa",
};

export default async function CaligraphyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const locale = await getAppLocale();
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
    pagination: { page: currentPage, pageSize: 12 },
    populate: ["coverImage", "relatedCalligraphies"],
  });

  const initialData = Array.isArray(res.data) ? res.data : [];
  const paginationMeta = res.meta?.pagination;

  return (
    <PageShell>
      <AppBreadcrumb locale={locale} items={[{ label: locale === "vi" ? "Thư viện" : "Library" }, { label: locale === "vi" ? "Thư pháp thư họa" : "Calligraphy" }]} />
      <PageHeader title={locale === "vi" ? "Thư pháp thư họa" : "Calligraphy"} />
      <CalligraphyList
        key={`${initialCategory}-${currentPage}`}
        initialCategory={initialCategory}
        locale={locale}
        paginationMeta={paginationMeta}
        currentPage={currentPage}
        initialCalligraphies={initialData}
      />
    </PageShell>
  );
}
