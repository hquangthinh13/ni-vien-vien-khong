"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Activity } from "../model/activity.types";
import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CourseCategoryRail from "./course-list/CourseCategoryRail";
import CourseYearTimeline from "./course-list/CourseYearTimeline";
import CourseFilterSheet from "./course-list/CourseFilterSheet";
import CourseResultsHeader from "./course-list/CourseResultsHeader";
import CourseEditorialGrid from "./course-list/CourseEditorialGrid";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import PaginationControls from "@/shared/layout/PaginationControls";
import EmptyState from "@/shared/layout/EmptyState";

interface ActivityListProps {
  initialCourses: Activity[];
  initialCategory: CourseCategory;
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
  availableYears: number[];
  currentYear: number | undefined;
}

export default function CourseList({
  initialCourses,
  initialCategory,
  locale,
  paginationMeta,
  currentPage,
  availableYears,
  currentYear,
}: ActivityListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPosts = paginationMeta?.total ?? initialCourses.length;
  const reverseMapping: Record<string, string> = {
    "Khóa Tu Mùa Hè": "mua-he",
    "Khóa Tu Xuất Gia Gieo Duyên": "xuat-gia-gieo-duyen",
    "Khóa Thiền": "thien",
    Khác: "khac",
    "Tất cả": "all",
  };

  const handleUpdateQuery = (
    newCategory?: CourseCategory,
    newPage?: number,
    newYear?: number | "all",
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory) {
      params.set("category", reverseMapping[newCategory] || "all");
      params.set("page", "1");
    }
    if (newYear !== undefined) {
      if (newYear === "all") params.delete("year");
      else params.set("year", newYear.toString());
      params.set("page", "1");
    }
    if (newPage) {
      params.set("page", newPage.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("year");
    params.delete("page");
    router.push(params.size ? `?${params.toString()}` : "?", {
      scroll: false,
    });
  };

  return (
    <div className="w-full">
      <CourseFilterSheet
        activeCategory={initialCategory}
        currentYear={currentYear}
        years={availableYears}
        locale={locale}
        total={totalPosts}
        onCategorySelect={(category) => handleUpdateQuery(category)}
        onYearSelect={(year) =>
          handleUpdateQuery(undefined, undefined, year ?? "all")
        }
      />

      <ArchivePageLayout
        railClassName="hidden lg:block"
        rail={
          <CourseCategoryRail
            activeCategory={initialCategory}
            locale={locale}
            total={totalPosts}
            onSelect={(category) => handleUpdateQuery(category)}
          />
        }
      >
        <div className="hidden lg:block">
          <CourseYearTimeline
            years={availableYears}
            currentYear={currentYear}
            locale={locale}
            onSelect={(year) =>
              handleUpdateQuery(undefined, undefined, year ?? "all")
            }
          />
        </div>

        <div className="mt-6 hidden lg:block">
          <CourseResultsHeader
            activeCategory={initialCategory}
            currentYear={currentYear}
            locale={locale}
            total={totalPosts}
            onClear={handleClearFilters}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${initialCategory}-${currentYear ?? "all"}-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {initialCourses.length > 0 ? (
              <CourseEditorialGrid courses={initialCourses} locale={locale} />
            ) : (
              <EmptyState
                message={
                  locale === "vi"
                    ? "Chưa có khóa trong danh mục này."
                    : "No courses are available in this category."
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
            onPageChange={(page) => handleUpdateQuery(undefined, page)}
            className="mt-10 border-t border-border/80 pt-6"
          />
        ) : null}
      </ArchivePageLayout>
    </div>
  );
}
