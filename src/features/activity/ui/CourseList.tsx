"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Activity } from "../model/activity.types";
import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCategoryRail from "./course-list/CourseCategoryRail";
import CourseYearTimeline from "./course-list/CourseYearTimeline";
import CourseFilterSheet from "./course-list/CourseFilterSheet";
import CourseResultsHeader from "./course-list/CourseResultsHeader";
import CourseEditorialGrid from "./course-list/CourseEditorialGrid";

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="hidden border-r border-border/80 pr-6 lg:col-span-3 lg:block">
          <CourseCategoryRail
            activeCategory={initialCategory}
            locale={locale}
            total={totalPosts}
            onSelect={(category) => handleUpdateQuery(category)}
          />
        </aside>

        <section className="min-w-0 lg:col-span-9">
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

          <div className="mt-6">
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
                <CourseEditorialGrid
                  courses={initialCourses}
                  locale={locale}
                />
              ) : (
                <div className="border-b border-border/80 py-16 text-center">
                  <p className="text-base text-foreground">
                    {locale === "vi"
                      ? "Chưa tìm thấy khóa tu phù hợp."
                      : "No matching results."}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    onClick={handleClearFilters}
                    className="mt-2"
                  >
                    {locale === "vi"
                      ? "Xem tất cả khóa tu"
                      : "View all courses"}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {paginationMeta && paginationMeta.pageCount > 1 ? (
            <nav
              aria-label={locale === "vi" ? "Phân trang" : "Pagination"}
              className="mt-10 flex items-center justify-center gap-4 border-t border-border/80 pt-6"
            >
              <Button
                disabled={currentPage <= 1}
                onClick={() => handleUpdateQuery(undefined, currentPage - 1)}
                size="icon"
                variant="outline"
                aria-label={locale === "vi" ? "Trang trước" : "Previous page"}
              >
                <ChevronLeft />
              </Button>
              <span className="font-mono text-xs text-muted-foreground">
                {locale === "vi" ? "Trang" : "Page"}{" "}
                <strong className="font-semibold text-foreground">
                  {currentPage}
                </strong>{" "}
                {locale === "vi" ? "trên" : "of"} {paginationMeta.pageCount}
              </span>
              <Button
                disabled={currentPage >= paginationMeta.pageCount}
                onClick={() => handleUpdateQuery(undefined, currentPage + 1)}
                size="icon"
                variant="outline"
                aria-label={locale === "vi" ? "Trang sau" : "Next page"}
              >
                <ChevronRight />
              </Button>
            </nav>
          ) : null}
        </section>
      </div>
    </div>
  );
}
