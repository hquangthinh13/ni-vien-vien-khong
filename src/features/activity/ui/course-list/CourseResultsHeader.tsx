import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
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
    <ArchiveResultsHeader
      title={getCourseCategoryLabel(activeCategory, locale)}
      total={total}
      countLabel={
        locale === "vi" ? "khóa tu" : total === 1 ? "retreat" : "retreats"
      }
      meta={
        currentYear ? (
          <p className="font-mono text-xs text-muted-foreground">
            {locale === "vi" ? "Năm" : "Year"} {currentYear}
          </p>
        ) : undefined
      }
      clearLabel={
        hasFilters
          ? locale === "vi"
            ? "Xóa bộ lọc"
            : "Clear filters"
          : undefined
      }
      onClear={hasFilters ? onClear : undefined}
    />
  );
}
