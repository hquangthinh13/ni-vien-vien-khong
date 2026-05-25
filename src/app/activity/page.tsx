import { fetchActivitiesByCategory } from "@/features/activity/api/activity.api";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import type { ActivityCategory as ActivityCategoryType } from "@/types/categories";
import ActivityList from "@/features/activity/ui/ActivityList";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";

export const metadata: Metadata = {
  title: "Tin tức",
};

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { category: categorySlug, page: pageSlug } = await searchParams;

  const currentPage = Number(pageSlug) || 1;
  const categoryMapping: Record<string, ActivityCategoryType> = {
    domestic: "Phật Sự Trong Nước",
    international: "Phật Sự Nước Ngoài",
    "dharma-class": "Lớp Học Phật Pháp",
    others: "Tin Tức Khác",
    all: "Tất cả",
  };
  const initialCategory = categoryMapping[categorySlug || ""] || "Tất cả";

  const response = await fetchActivitiesByCategory({
    locale,
    pagination: { page: currentPage, pageSize: 9 },
    sort: ["publishedAt:desc"],
    populate: ["coverImage", "courseContent"],
    category: initialCategory,
  });

  const initialActivities = Array.isArray(response.data) ? response.data : [];
  const paginationMeta = response.meta?.pagination;

  return (
    <PageShell>
      <PageHeader title={locale === "vi" ? "Tin tức" : "Activities"} />
      <ActivityList
        key={`${initialCategory}-${currentPage}`}
        initialActivities={initialActivities}
        initialCategory={initialCategory}
        paginationMeta={paginationMeta}
        locale={locale}
        currentPage={currentPage}
      />
    </PageShell>
  );
}