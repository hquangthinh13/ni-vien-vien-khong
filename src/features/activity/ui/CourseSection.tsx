import React from "react";
import type { Locale } from "@/types/locale";
import CourseSidebarCard from "./CourseSidebarCard";
import { Activity } from "../model/activity.types";
import MobileActivitiesCard from "@/features/activity/ui/MobileActivitiesCard";

export default async function CourseSection({
  locale,
  courses,
}: {
  locale: Locale;
  courses: Activity[];
}) {
  return (
    <div className="mt-4">
      <div className="hidden lg:flex flex-col gap-2">
        {courses.map((course) => (
          <CourseSidebarCard key={course.id} course={course} locale={locale} />
        ))}{" "}
      </div>
      <div className="flex flex-col lg:hidden gap-2">
        {courses.map((course) => (
          <MobileActivitiesCard
            key={course.id}
            activity={course}
            locale={locale}
            isCourse={true}
          />
        ))}{" "}
      </div>
    </div>
  );
}
