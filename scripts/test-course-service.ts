import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchCourses,
  fetchCourseByDocumentId,
  fetchCoursesByCategory,
} from "@/components/Course/Course.service";
import type { CourseAttributes } from "@/components/Course/Course.type";
import { isValidCourseCategory, type CourseCategory } from "@/types/categories";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = process.argv[3] || "xb9gekv7pnj3z2m11iadwx2t";
const categoryArg = isValidCourseCategory(process.argv[4] as CourseCategory)
  ? (process.argv[4] as CourseCategory)
  : "Khóa Tu Mùa Hè";

const main = async () => {
  try {
    console.log("=== Testing Course Services ===\n");

    // Test 1: Fetch all courses
    // console.log("1. Fetching all courses (first page, 5 items):");
    // const allCourses = await fetchCourses({
    //   locale,
    //   pagination: { page: 1, pageSize: 5 },
    //   populate: "*",
    // });
    // console.log(`Total courses: ${allCourses.meta?.pagination?.total || 0}`);
    // console.log(allCourses);
    // console.log();

    // Test 2: Fetch course by documentId
    console.log(`2. Fetching course by documentId: ${documentId}`);
    const courseById = await fetchCourseByDocumentId({
      documentId,
      locale,
      populate: "*",
    });
    const courseData = courseById.data as CourseAttributes | null;
    const courseHighLightedImage = courseData?.highlightedImages || [];
    console.log(
      `Course Name: ${courseData?.courseName || "N/A"}, Highlighted Images Count: ${courseHighLightedImage.length}`,
    );
    console.log(
      courseHighLightedImage[0].formats?.large?.url || "No Image URL",
    );

    // console.log(JSON.stringify(courseById, null, 2));

    // Test 3: Fetch courses by category
    // console.log(`3. Fetching courses by category: ${categoryArg}`);
    // const coursesByCategory = await fetchCoursesByCategory({
    //   category: categoryArg,
    //   locale,
    //   populate: "*",
    //   pagination: { pageSize: 10 },
    // });
    // console.log(
    //   `Total courses in category "${categoryArg}": ${
    //     coursesByCategory.meta?.pagination?.total || 0
    //   }`,
    // );
    // console.log(coursesByCategory);
    // console.log();

    console.log("=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
