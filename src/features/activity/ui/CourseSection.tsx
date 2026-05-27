import React from "react";
import type { Locale } from "@/types/locale";
import CourseSidebarCard from "./CourseSidebarCard";
import { Activity } from "../model/activity.types";
import MobileActivitiesCard from "@/features/activity/ui/MobileActivitiesCard";
import SimplifiedActivitiesCard from "@/features/activity/ui/SimplifiedActivitiesCard";
export default async function CourseSection({
  locale,
  courses,
}: {
  locale: Locale;
  courses: Activity[];
}) {
  return (
    <div className="mt-4">
      <div className="hidden lg:grid grid-cols-1 gap-0">
        {courses.map((course) => (
          <MobileActivitiesCard
            key={course.id}
            activity={course}
            locale={locale}
            // variant="bottom"
          />
        ))}{" "}
      </div>
      <div className="grid grid-cols-1 flex-col lg:hidden gap-0">
        {courses.map((course, index) => (
          <MobileActivitiesCard
            key={course.id}
            activity={course}
            locale={locale}
            isCourse={true}
            // variant={"hero"}
            // variant={index === 0 ? "hero" : "compact"}
          />
        ))}{" "}
      </div>
    </div>
  );
}
