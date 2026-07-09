"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { cn } from "@/shared/lib/utils";
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
    <div className="flex items-center justify-between lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="w-full" variant="outline" size="sm">
            <SlidersHorizontal />
            {locale === "vi" ? "Bộ lọc" : "Filters"}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[min(90vw,24rem)] overflow-y-auto bg-card"
          data-lenis-prevent
        >
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="font-serif text-xl">
              {locale === "vi" ? "Lọc khóa tu" : "Filter retreats"}
            </SheetTitle>
            <SheetDescription>
              {locale === "vi"
                ? "Chọn danh mục và năm tổ chức."
                : "Choose a category and year."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-8 px-4 py-5">
            <section>
              <h3 className="mb-3 pr-4 font-mono text-xs font uppercase tracking-widest text-muted-foreground">
                {locale === "vi" ? "Danh mục" : "Categories"}
              </h3>
              <CourseCategoryRail
                activeCategory={activeCategory}
                locale={locale}
                total={total}
                onSelect={selectCategory}
                compact
              />
            </section>

            <section>
              <h3 className="mb-3 px-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {locale === "vi" ? "Năm tổ chức" : "Year"}
              </h3>
              <div className="grid grid-cols-3 gap-2 px-4">
                <Button
                  type="button"
                  variant={!currentYear ? "default" : "outline"}
                  onClick={() => selectYear(undefined)}
                  className="font-serif"
                >
                  {locale === "vi" ? "Tất cả" : "All"}
                </Button>
                {sortedYears.map((year) => (
                  <Button
                    key={year}
                    type="button"
                    variant={currentYear === year ? "default" : "outline"}
                    onClick={() => selectYear(year)}
                    className={cn("font-serif")}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
