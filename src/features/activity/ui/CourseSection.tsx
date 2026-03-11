import React from "react";
import { fetchActivitiesByCategory } from "@/features/activity/api/activity.api";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import CourseSidebarCard from "./CourseSidebarCard";

export default async function CourseSection() {
  const locale = (await getLocale()) as Locale;
  const category = "Khóa Tu";
  try {
    const res = await fetchActivitiesByCategory({
      locale,
      category: category,
      sort: ["activityStartDate:desc"],
      pagination: { limit: 5 },
      populate: "coverImage",
    });
    console.log("Fetched courses:", category, res);
    const data = Array.isArray(res?.data)
      ? res.data
      : res?.data
        ? [res.data]
        : [];

    if (data.length === 0) {
      return (
        <div className="pt-4 text-muted-foreground">No activities found.</div>
      );
    }

    return (
      <div className="mt-4 flex flex-col gap-2">
        {data.map((course) => (
          <CourseSidebarCard key={course.id} course={course} locale={locale} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return <div className="pt-4 text-red-500">Failed to load activities.</div>;
  }
}
