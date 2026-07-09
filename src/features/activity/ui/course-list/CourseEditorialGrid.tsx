import type { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import CourseArchiveCard from "./CourseArchiveCard";

interface CourseEditorialGridProps {
  courses: Activity[];
  locale: Locale;
}

export default function CourseEditorialGrid({
  courses,
  locale,
}: CourseEditorialGridProps) {
  const [featuredCourse, ...remainingCourses] = courses;

  if (!featuredCourse) return null;

  return (
    <div className="flex flex-col gap-5">
      <CourseArchiveCard
        activity={featuredCourse}
        locale={locale}
        variant="featured" 
      />

      {remainingCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {remainingCourses.map((course) => (
            <CourseArchiveCard
              key={course.documentId}
              activity={course}
              locale={locale}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
