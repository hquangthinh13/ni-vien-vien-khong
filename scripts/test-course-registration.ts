import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchActiveCourses,
  isCourseActive,
  getActiveCourseID,
  fetchCourses,
} from "@/components/Course/Course.service";
import { createCourseRegistration } from "@/components/CourseRegistration/CourseRegistration.service";
import type { CourseRegistrationFormData } from "@/components/CourseRegistration/CourseRegistration.type";
import type { Course } from "@/components/Course/Course.type";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";

const main = async () => {
  try {
    console.log("=== Testing Course Registration Services ===\n");

    // Step 1: Fetch active courses
    console.log("1. Fetching all active courses:");
    const activeCourses = await fetchActiveCourses({
      locale,
      populate: "*",
      pagination: { pageSize: 10 },
    });

    if (!Array.isArray(activeCourses.data) || activeCourses.data.length === 0) {
      console.log("⚠ No active courses found");
      console.log("=== Tests completed! ===");
      return;
    }

    const coursesList = activeCourses.data as Course[];
    console.log(`✓ Found ${coursesList.length} active courses`);
    coursesList.forEach((course, index) => {
      console.log(
        `  ${index + 1}. ${course.courseName} (ID: ${course.documentId}) - Active: ${isCourseActive(course)}`,
      );
    });
    console.log();

    // Step 2: Use the first active course to create registrations
    const selectedCourse = coursesList[0];
    const courseId = getActiveCourseID(selectedCourse); // Should be valid since it's active
    console.log(
      `2. Using course: "${selectedCourse.courseName}" (ID: ${courseId})\n`,
    );

    // Test 1: Create registration with all fields including the active course ID
    console.log(
      "3. Creating course registration with all fields (using active course ID):",
    );
    const formDataFull: CourseRegistrationFormData = {
      fullName: "Nguyễn Văn A",
      phoneNumber: "+84912345678",
      email: "nguyenvana@example.com",
      address: "123 Đường Lê Lợi, Hà Nội, Việt Nam",
      registedCourseId: courseId,
    };

    try {
      const registrationFull = await createCourseRegistration(formDataFull);
      console.log("✓ Registration created successfully!");
      console.log("Response:", JSON.stringify(registrationFull, null, 2));
    } catch (error) {
      console.log(
        "✗ Failed to create registration:",
        error instanceof Error ? error.message : error,
      );
    }
    console.log();

    // Test 2: Create registration with minimal fields
    console.log("4. Creating course registration with undefined courseID:");
    const formDataMinimal: CourseRegistrationFormData = {
      fullName: "Trần Thị B",
      phoneNumber: "+84987654321",
      email: "tranthib@example.com",
      registedCourseId: undefined as unknown as string, // Intentionally incorrect for testing
    };

    try {
      const registrationMinimal =
        await createCourseRegistration(formDataMinimal);
      console.log("✓ Registration created successfully!");
      console.log("Response:", JSON.stringify(registrationMinimal, null, 2));
    } catch (error) {
      console.log(
        "✗ Failed to create registration:",
        error instanceof Error ? error.message : error,
      );
    }
    console.log();

    console.log("=== All tests completed! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
