import React from "react";
import { fetchCoursesByCategory } from "@/features/activity/api/activity.api";
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
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const category = await searchParams;
  const categoryMapping: Record<string, CourseCategory> = {
    "mua-he": "Khóa Tu Mùa Hè",
    "xuat-gia-gieo-duyen": "Khóa Tu Xuất Gia Gieo Duyên",
    thien: "Khóa Thiền",
  };
  const initialCategory =
    categoryMapping[category?.category || ""] || "Khóa Tu Mùa Hè";

  const response = await fetchCoursesByCategory({
    locale: locale,
    pagination: { page: 1, pageSize: 8 },
    sort: "publishedAt:desc",
    populate: "coverImage",
    category: initialCategory,
  });
  // console.log("Fetched activities for category:", initialCategory, response);
  const initialActivities = Array.isArray(response.data) ? response.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Khóa tu
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>
      <div className="flex flex-1 w-full flex-col items-stretch">
        {" "}
        <CourseList
          key={initialCategory}
          initialCourses={initialActivities}
          initialCategory={initialCategory}
          locale={locale}
        />
      </div>
    </div>
  );
}
