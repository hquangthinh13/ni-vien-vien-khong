import type { AppBreadcrumbItem } from "@/shared/layout/AppBreadcrumb";
import type { Locale } from "@/types/locale";
import { getCategoryLabel } from "@/types/categories";
import type {
  Activity,
  CourseContent,
} from "@/features/activity/model/activity.types";

const COURSE_ACTIVITY_CATEGORY = "Khóa Tu";

export function isCourseActivity(activity: Pick<Activity, "activityCategory">) {
  return activity.activityCategory === COURSE_ACTIVITY_CATEGORY;
}

export function getActivityBreadcrumbItems({
  activity,
  locale,
  detailHref,
  append = [],
}: {
  activity: Activity;
  locale: Locale;
  detailHref?: string;
  append?: AppBreadcrumbItem[];
}): AppBreadcrumbItem[] {
  const isCourse = isCourseActivity(activity);
  const courseContent = activity.courseContent as CourseContent | undefined;
  const category = isCourse
    ? courseContent?.courseCategory || activity.activityCategory
    : activity.activityCategory;
  const categoryLabel = getCategoryLabel(category, locale);

  const items: AppBreadcrumbItem[] = [
    {
      label: isCourse
        ? locale === "vi"
          ? "Khóa tu"
          : "Courses"
        : locale === "vi"
          ? "Tin tức"
          : "Activities",
      href: isCourse ? "/course" : "/activity",
    },
  ];

  if (categoryLabel) {
    items.push({ label: categoryLabel });
  }

  items.push({ label: activity.activityName, href: detailHref });

  return [...items, ...append];
}
