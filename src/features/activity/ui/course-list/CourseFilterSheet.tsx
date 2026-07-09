"use client";

import { useState } from "react";
import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import ArchiveFilterSheet from "@/shared/layout/archive/ArchiveFilterSheet";
import CourseCategoryRail, {
  getCourseCategoryLabel,
} from "./CourseCategoryRail";

interface CourseFilterSheetProps {
  activeCategory: CourseCategory;
  currentYear?: number;
  years: number[];
  locale: Locale;
  total: number;
  onCategorySelect: (category: CourseCategory) => void;
  onYearSelect: (year?: number) => void;
}

export default function CourseFilterSheet({
  activeCategory,
  currentYear,
  years,
  locale,
  total,
  onCategorySelect,
  onYearSelect,
}: CourseFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const sortedYears = [...new Set(years)].sort((a, b) => b - a);
  const selectCategory = (category: CourseCategory) => {
    onCategorySelect(category);
    setOpen(false);
  };
  const selectYear = (year?: number) => {
    onYearSelect(year);
    setOpen(false);
  };

  return (
    <ArchiveFilterSheet
      open={open}
      onOpenChange={setOpen}
      side="right"
      triggerLabel={locale === "vi" ? "Bộ lọc" : "Filters"}
      title={locale === "vi" ? "Lọc khóa tu" : "Filter retreats"}
      description={
        locale === "vi"
          ? "Chọn danh mục và năm tổ chức."
          : "Choose a category and year."
      }
      summary={
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary">
            {getCourseCategoryLabel(activeCategory, locale)}
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {currentYear
              ? `${locale === "vi" ? "Năm" : "Year"} ${currentYear} · `
              : ""}
            {total}{" "}
            {locale === "vi"
              ? "khóa tu"
              : total === 1
                ? "retreat"
                : "retreats"}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        <CourseCategoryRail
          activeCategory={activeCategory}
          locale={locale}
          total={total}
          onSelect={selectCategory}
          compact
        />
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {locale === "vi" ? "Năm tổ chức" : "Year"}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={!currentYear ? "default" : "outline"}
              onClick={() => selectYear(undefined)}
            >
              {locale === "vi" ? "Tất cả" : "All"}
            </Button>
            {sortedYears.map((year) => (
              <Button
                key={year}
                type="button"
                variant={currentYear === year ? "default" : "outline"}
                onClick={() => selectYear(year)}
                className="font-mono"
              >
                {year}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </ArchiveFilterSheet>
  );
}
