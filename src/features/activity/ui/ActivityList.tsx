"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import type { Activity } from "../model/activity.types";
import type { ActivityCategory } from "@/types/categories";
import { getCategoryLabel } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { extractPreviewContent } from "@/shared/lib/utils";
import { getStatusLabel } from "../api/activity.api";
import ArchiveCategoryRail, {
  type ArchiveCategoryItem,
} from "@/shared/layout/archive/ArchiveCategoryRail";
import ArchiveFilterSheet from "@/shared/layout/archive/ArchiveFilterSheet";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import EditorialMediaCard from "@/shared/layout/archive/EditorialMediaCard";
import EmptyState from "@/shared/layout/EmptyState";
import PaginationControls from "@/shared/layout/PaginationControls";
import CourseEditorialGrid from "./course-list/CourseEditorialGrid";

interface ActivityListProps {
  initialActivities: Activity[];
  initialCategory: ActivityCategory;
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
}

const CATEGORIES: ActivityCategory[] = [
  "Tất cả",
  "Phật Sự Trong Nước",
  "Phật Sự Nước Ngoài",
  "Lớp Học Phật Pháp",
  "Tin Tức Khác",
];

const CATEGORY_SLUGS: Record<ActivityCategory, string> = {
  "Tất cả": "all",
  "Phật Sự Trong Nước": "domestic",
  "Phật Sự Nước Ngoài": "international",
  "Lớp Học Phật Pháp": "dharma-class",
  "Tin Tức Khác": "others",
  "Khóa Tu": "all",
};

export default function ActivityList({
  initialActivities,
  initialCategory,
  locale,
  paginationMeta,
  currentPage,
}: ActivityListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = paginationMeta?.total ?? initialActivities.length;
  const categoryItems: ArchiveCategoryItem<ActivityCategory>[] = CATEGORIES.map(
    (category) => ({
      value: category,
      label: getCategoryLabel(category, locale),
    }),
  );

  const updateQuery = (category?: ActivityCategory, page?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", CATEGORY_SLUGS[category]);
      params.set("page", "1");
    }
    if (page) params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // const [featuredActivity, ...remainingActivities] = initialActivities;

  const renderCard = (activity: Activity, variant: "featured" | "standard") => {
    const status = getStatusLabel(activity, locale);
    return (
      <EditorialMediaCard
        key={activity.documentId}
        locale={locale}
        variant={variant}
        item={{
          key: activity.documentId,
          href: `/activity/${activity.slug}-${activity.documentId}`,
          title: activity.activityName,
          imageUrl: getImageUrl(activity.coverImage, "medium"),
          imageAlt:
            activity.coverImage?.alternativeText || activity.activityName,
          excerpt: extractPreviewContent(activity.content),
          category: getCategoryLabel(activity.activityCategory, locale),
          date: activity.publishedAt,
          secondaryMeta: status ? (
            <span className="text-xs font-medium text-secondary-foreground/70">
              {status}
            </span>
          ) : undefined,
        }}
      />
    );
  };

  return (
    <div className="w-full">
      <ArchiveFilterSheet
        triggerLabel={locale === "vi" ? "Bộ lọc" : "Filters"}
        title={locale === "vi" ? "Danh mục tin tức" : "Activity categories"}
        description={
          locale === "vi"
            ? "Chọn danh mục bài viết muốn xem."
            : "Choose the activity category to view."
        }
        summary={
          <p className="text-sm font-semibold text-primary">
            {getCategoryLabel(initialCategory, locale)}{" "}
            <span className="font-mono text-xs font-normal text-muted-foreground">
              ({total})
            </span>
          </p>
        }
      >
        <ArchiveCategoryRail
          label={locale === "vi" ? "Danh mục" : "Categories"}
          items={categoryItems}
          activeValue={initialCategory}
          activeTotal={total}
          onSelect={(category) => updateQuery(category)}
          compact
        />
      </ArchiveFilterSheet>

      <ArchivePageLayout
        railClassName="hidden lg:block"
        rail={
          <ArchiveCategoryRail
            label={locale === "vi" ? "Danh mục" : "Categories"}
            items={categoryItems}
            activeValue={initialCategory}
            activeTotal={total}
            onSelect={(category) => updateQuery(category)}
          />
        }
      >
        <div className="hidden lg:block">
          <ArchiveResultsHeader
            title={getCategoryLabel(initialCategory, locale)}
            total={total}
            countLabel={
              locale === "vi" ? "bài viết" : total === 1 ? "post" : "posts"
            }
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${initialCategory}-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {initialActivities.length > 0 ? (
              <CourseEditorialGrid
                courses={initialActivities}
                locale={locale}
              />
            ) : (
              <EmptyState
                message={
                  locale === "vi"
                    ? "Chưa có hoạt động trong danh mục này."
                    : "No activities are available in this category."
                }
              />
            )}
          </motion.div>
        </AnimatePresence>

        {paginationMeta ? (
          <PaginationControls
            currentPage={currentPage}
            pageCount={paginationMeta.pageCount}
            locale={locale}
            onPageChange={(page) => updateQuery(undefined, page)}
            className="mt-10 border-t border-border/80 pt-6"
          />
        ) : null}
      </ArchivePageLayout>
    </div>
  );
}
