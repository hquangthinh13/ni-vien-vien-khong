import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import { getCourseCategoryLabel } from "./CourseCategoryRail";

interface CourseResultsHeaderProps {
  activeCategory: CourseCategory;
  currentYear?: number;
  locale: Locale;
  total: number;
  onClear: () => void;
}

export default function CourseResultsHeader({
  activeCategory,
  currentYear,
  locale,
  total,
  onClear,
}: CourseResultsHeaderProps) {
  const hasFilters = activeCategory !== "Tất cả" || Boolean(currentYear);

  return (
    <div className="flex flex-row justify-between items-center gap-3 border-b border-border/80 pb-4">
      <span className=" text-xs text-muted-foreground flex gap-2">
        <p className="text-primary">
          {getCourseCategoryLabel(activeCategory, locale)}{" "}
        </p>
        ·
        {currentYear ? (
          <p>
            {locale === "vi" ? "Năm" : "Year"} {currentYear}{" "}
          </p>
        ) : null}
        ·
        <p>
          {total} {locale === "vi" ? "khóa tu" : "retreats"}
        </p>
      </span>

      {hasFilters ? (
        <Button type="button" variant="ghost" size="xs" onClick={onClear}>
          {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
        </Button>
      ) : null}
    </div>
  );
}
