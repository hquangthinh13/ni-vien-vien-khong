import React from "react";
import {
  fetchCoursesByCategory,
  fetchAllCourseYears,
} from "@/features/activity/api/activity.api";
import { getAppLocale } from "@/shared/lib/i18n";
import type { CourseCategory } from "@/types/categories";
import CourseList from "@/features/activity/ui/CourseList";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";

export const metadata: Metadata = {
  title: "Khóa tu",
};

export default async function CoursePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; year?: string }>;
}) {
  const locale = await getAppLocale();
  const {
    category: categorySlug,
    page: pageSlug,
    year: yearSlug,
  } = await searchParams;

  const currentYear = yearSlug ? Number(yearSlug) : undefined;
  const currentPage = Number(pageSlug) || 1;
  const availableYears = await fetchAllCourseYears();

  const categoryMapping: Record<string, CourseCategory> = {
    "mua-he": "Khóa Tu Mùa Hè",
    "xuat-gia-gieo-duyen": "Khóa Tu Xuất Gia Gieo Duyên",
    thien: "Khóa Thiền",
    all: "Tất cả",
    khac: "Khác",
  };
  const initialCategory = categoryMapping[categorySlug || ""] || "Tất cả";

  const response = await fetchCoursesByCategory({
    locale,
    pagination: { page: currentPage, pageSize: 9 },
    sort: ["activityStartDate:desc"],
    populate: ["coverImage", "courseContent"],
    category: initialCategory,
    year: currentYear,
  });

  const initialActivities = Array.isArray(response.data) ? response.data : [];
  const paginationMeta = response.meta?.pagination;

  return (
    <PageShell>
      <PageHeader title={locale === "vi" ? "Khóa tu" : "Courses"} />
      <div className="flex w-full flex-1 flex-col items-stretch">
        <CourseList
          key={`${initialCategory}-${currentPage}`}
          initialCourses={initialActivities}
          initialCategory={initialCategory}
          locale={locale}
          paginationMeta={paginationMeta}
          currentPage={currentPage}
          availableYears={availableYears}
          currentYear={currentYear}
        />
      </div>
    </PageShell>
  );
}