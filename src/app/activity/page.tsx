import { fetchActivitiesByCategory } from "@/features/activity/api/activity.api";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import type { Locale } from "@/types/locale";
import type { ActivityCategory as ActivityCategoryType } from "@/types/categories";
import ActivityList from "@/features/activity/ui/ActivityList";
export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { category: categorySlug } = await searchParams;
  const categoryMapping: Record<string, ActivityCategoryType> = {
    domestic: "Phật Sự Trong Nước",
    international: "Phật Sự Nước Ngoài",
    "dharma-class": "Lớp Học Phật Pháp",
    others: "Tin Tức Khác",
  };
  const initialCategory =
    categoryMapping[categorySlug || ""] || "Phật Sự Trong Nước";
  const response = await fetchActivitiesByCategory({
    locale,
    pagination: { page: 1, pageSize: 8 },
    sort: "publishedAt:desc",
    populate: "coverImage",
    category: initialCategory,
  });
  console.log("Fetched activities for category:", initialCategory, response);
  const initialActivities = Array.isArray(response.data) ? response.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Tin tức
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>
      <div className="flex flex-1 w-full flex-col items-stretch">
        {" "}
        <ActivityList
          key={initialCategory}
          initialActivities={initialActivities}
          initialCategory={initialCategory}
          locale={locale}
        />
      </div>
    </div>
  );
}
