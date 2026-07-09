import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { cn } from "@/shared/lib/utils";

const COURSE_CATEGORIES: CourseCategory[] = [
  "Tất cả",
  "Khóa Tu Mùa Hè",
  "Khóa Tu Xuất Gia Gieo Duyên",
  "Khóa Thiền",
  "Khác",
];

const CATEGORY_LABELS: Record<Locale, Record<CourseCategory, string>> = {
  vi: {
    "Tất cả": "Tất cả",
    "Khóa Tu Mùa Hè": "Khóa Tu Mùa Hè",
    "Khóa Tu Xuất Gia Gieo Duyên": "Khóa Tu Xuất Gia Gieo Duyên",
    "Khóa Thiền": "Khóa Thiền",
    Khác: "Khác",
  },
  en: {
    "Tất cả": "All retreats",
    "Khóa Tu Mùa Hè": "Summer Retreats",
    "Khóa Tu Xuất Gia Gieo Duyên": "Monastic Retreats",
    "Khóa Thiền": "Meditation Retreats",
    Khác: "Others",
  },
};

export function getCourseCategoryLabel(
  category: CourseCategory,
  locale: Locale,
) {
  return CATEGORY_LABELS[locale][category];
}

interface CourseCategoryRailProps {
  activeCategory: CourseCategory;
  locale: Locale;
  total: number;
  onSelect: (category: CourseCategory) => void;
  compact?: boolean;
}

export default function CourseCategoryRail({
  activeCategory,
  locale,
  total,
  onSelect,
  compact = false,
}: CourseCategoryRailProps) {
  return (
    <nav
      aria-label={locale === "vi" ? "Danh mục khóa tu" : "Retreat categories"}
      className={cn(
        "flex flex-col",
        compact ? "gap-1" : "sticky top-24 gap-2",
      )}
    >
      {!compact ? (
              <p className="mb-3 font-mono text-xs font uppercase tracking-widest text-muted-foreground">
          {locale === "vi" ? "Danh mục" : "Categories"}
        </p>
      ) : null}

      {COURSE_CATEGORIES.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(category)}
            className={cn(
              "group relative flex min-h-11 w-full cursor-pointer items-center font-semibold justify-between gap-3 border-l-2 px-4 py-2.5 text-left text-sm transition-colors",
              active
                ? "border-primary bg-primary/5 font-semibold text-primary"
                : "border-transparent text-foreground/75 hover:border-primary/40 hover:bg-primary/3 hover:text-foreground",
            )}
          >
            <span>{getCourseCategoryLabel(category, locale)}</span>
            {active ? (
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {total}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
