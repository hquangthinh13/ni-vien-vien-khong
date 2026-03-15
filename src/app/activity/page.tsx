import { fetchActivitiesByCategory } from "@/features/activity/api/activity.api";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import type { Locale } from "@/types/locale";
import type { ActivityCategory as ActivityCategoryType } from "@/types/categories";
import ActivityList from "@/features/activity/ui/ActivityList";
import TextMotionWrapper from "@/shared/motion/TextMotionWrapper";
import { Metadata } from "next";
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
    pagination: { page: currentPage, pageSize: 6 },
    sort: ["publishedAt:desc"],
    populate: ["coverImage", "courseContent"],
    category: initialCategory,
  });
  // console.log("Fetched activities for category:", initialCategory, response);
  const initialActivities = Array.isArray(response.data) ? response.data : [];
  const paginationMeta = response.meta?.pagination;
  return (
    <div className="page-container">
      <div className="flex flex-col gap-6 items-center mb-6">
        <TextMotionWrapper delay={0.2} className="text-center">
          <h2 className="page-header">Tin tức</h2>
        </TextMotionWrapper>
        <TextMotionWrapper delay={0.2}>
          <div className="opacity-80">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>{" "}
        </TextMotionWrapper>
      </div>
      <ActivityList
        key={`${initialCategory}-${currentPage}`}
        initialActivities={initialActivities}
        initialCategory={initialCategory}
        paginationMeta={paginationMeta}
        locale={locale}
        currentPage={currentPage}
      />
    </div>
  );
}
