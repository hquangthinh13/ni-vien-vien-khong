import React from "react";
import type { Locale } from "@/types/locale";
import CourseSidebarCard from "./CourseSidebarCard";
import { Activity } from "../model/activity.types";

export default async function CourseSection({
  locale,
  courses,
}: {
  locale: Locale;
  courses: Activity[];
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {courses.map((course) => (
        <CourseSidebarCard key={course.id} course={course} locale={locale} />
      ))}
    </div>
  );
}
