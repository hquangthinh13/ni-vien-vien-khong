import React from "react";
import { fetchCourses } from "./Course.service";
async function getCourses() {
  const res = await fetchCourses({
    sort: ["courseStartDate:desc"],
    pagination: { limit: 5 },
    populate: "*",
  });
  // console.log("Fetched data:", res);
  return res;
}
import CourseSidebarCard from "@/components/Course/CourseSidebarCard";

export default async function CourseSection() {
  try {
    const courses = await getCourses();

    const data = Array.isArray(courses?.data)
      ? courses.data
      : courses?.data
        ? [courses.data]
        : [];

    if (data.length === 0) {
      return <div className="p-4 text-gray-500">No activities found.</div>;
    }

    return (
      <div className="mt-4 flex flex-col gap-2">
        {data.map((course) => (
          <CourseSidebarCard key={course.id} course={course} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return <div className="p-4 text-red-500">Failed to load activities.</div>;
  }
}
