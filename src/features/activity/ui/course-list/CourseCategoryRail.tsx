import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import ArchiveCategoryRail from "@/shared/layout/archive/ArchiveCategoryRail";

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
    <ArchiveCategoryRail
      label={locale === "vi" ? "Danh mục" : "Categories"}
      items={COURSE_CATEGORIES.map((category) => ({
        value: category,
        label: getCourseCategoryLabel(category, locale),
      }))}
      activeValue={activeCategory}
      activeTotal={total}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
