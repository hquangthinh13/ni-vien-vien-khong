import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchCourses,
  fetchCourseByDocumentId,
  fetchCoursesByCategory,
  fetchActiveCourses,
  fetchCoursesByMonth,
  getCourseStatus,
  isCourseActive,
  filterCoursesByStatus,
} from "@/features/course/api/course.api";
import type { Course } from "@/features/course/model/course.types";
import { isValidCourseCategory, type CourseCategory } from "@/types/categories";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = process.argv[3] || "wl9j6cbybt6i4lvebqcmr8b4";
const categoryArg = isValidCourseCategory(process.argv[4] as CourseCategory)
  ? (process.argv[4] as CourseCategory)
  : "Khóa Tu Mùa Hè";

const main = async () => {
  try {
    console.log("=== Testing Course Services ===\n");

    // Test 1: Fetch all courses
    console.log("1. Fetching all courses (first page, 5 items):");
    const allCourses = await fetchCourses({
      locale,
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
    });
    console.log(`Total courses: ${allCourses.meta?.pagination?.total || 0}`);
    const coursesList = allCourses.data as Course[];
    if (Array.isArray(coursesList)) {
      console.log(
        "Course names:",
        coursesList.map((c) => c?.courseName),
      );
    }
    console.log();

    // Test 2: Fetch course by documentId
    console.log(`2. Fetching course by documentId: ${documentId}`);
    const courseById = await fetchCourseByDocumentId({
      documentId,
      locale,
      populate: "*",
    });
    if (courseById.data && !Array.isArray(courseById.data)) {
      const course = courseById.data as Course;
      console.log("Course name:", course.courseName);
      console.log("Category:", course.category);
      console.log("Start date:", course.courseStartDate || "N/A");
      console.log("End date:", course.courseEndDate || "N/A");
      console.log("Status:", getCourseStatus(course));
      console.log("Is active:", isCourseActive(course));
      console.log("Has cover image:", !!course.coverImage);
      console.log("Number of videos:", course.videoSection?.length || 0);
      console.log(
        "Number of highlighted images:",
        course.highlightedImages?.length || 0,
      );
    }
    console.log();

    // Test 3: Fetch courses by category
    console.log(`3. Fetching courses by category: ${categoryArg}`);
    const coursesByCategory = await fetchCoursesByCategory({
      category: categoryArg,
      locale,
      populate: "*",
      pagination: { pageSize: 10 },
    });
    if (Array.isArray(coursesByCategory.data)) {
      console.log(`Found ${coursesByCategory.data.length} courses`);
      coursesByCategory.data.forEach((course, index) => {
        console.log(
          `  ${index + 1}. ${course.courseName} (${course.category}) - Status: ${getCourseStatus(course)}`,
        );
      });
    }
    console.log();

    // Test 4: Fetch active courses
    console.log("4. Fetching active courses:");
    const activeCourses = await fetchActiveCourses({
      locale,
      populate: "*",
      pagination: { pageSize: 10 },
    });
    if (Array.isArray(activeCourses.data)) {
      console.log(`Found ${activeCourses.data.length} active courses`);
      activeCourses.data.forEach((course, index) => {
        console.log(
          `  ${index + 1}. ${course.courseName} - ${course.courseStartDate} to ${course.courseEndDate}`,
        );
      });
    }
    console.log();

    // Test 5: Fetch courses by month
    const now = new Date();
    console.log(
      `5. Fetching courses for ${now.getFullYear()}/${now.getMonth() + 1}:`,
    );
    const coursesByMonth = await fetchCoursesByMonth({
      locale,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      populate: "*",
    });
    if (Array.isArray(coursesByMonth.data)) {
      console.log(`Found ${coursesByMonth.data.length} courses`);
      coursesByMonth.data.forEach((course, index) => {
        console.log(
          `  ${index + 1}. ${course.courseName} - ${course.courseStartDate} to ${course.courseEndDate}`,
        );
      });
    }
    console.log();

    // Test 6: Filter courses by status
    if (Array.isArray(allCourses.data) && allCourses.data.length > 0) {
      console.log("6. Filtering courses by status:");
      const upcomingCourses = filterCoursesByStatus(
        allCourses.data,
        "upcoming",
      );
      const ongoingCourses = filterCoursesByStatus(allCourses.data, "ongoing");
      const completedCourses = filterCoursesByStatus(
        allCourses.data,
        "completed",
      );
      console.log(`  Upcoming: ${upcomingCourses.length}`);
      console.log(`  Ongoing: ${ongoingCourses.length}`);
      console.log(`  Completed: ${completedCourses.length}`);
    }

    console.log("\n=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
