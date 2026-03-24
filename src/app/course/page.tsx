import React from "react";
import {
  fetchCoursesByCategory,
  fetchAllCourseYears,
} from "@/features/activity/api/activity.api";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import type { Locale } from "@/types/locale";
import type { CourseCategory } from "@/types/categories";
import CourseList from "@/features/activity/ui/CourseList";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Khóa tu",
};
export default async function CoursePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; year?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
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
    locale: locale,
    pagination: { page: currentPage, pageSize: 9 },
    sort: ["activityStartDate:desc"],
    populate: ["coverImage", "courseContent"],
    category: initialCategory,
    year: currentYear,
  });
  const initialActivities = Array.isArray(response.data) ? response.data : [];
  const paginationMeta = response.meta?.pagination;

  return (
    <div className="page-container">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h1 className="page-header">Khóa tu</h1>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>
      <div className="flex flex-1 w-full flex-col items-stretch">
        {" "}
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
    </div>
  );
}
