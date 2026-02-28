// Write example code to test activity services

// Usecase 1: Get all active activities (for Calendar Page - Activity DropDown Filter)
import { fetchActiveActivities } from "@/features/activity/api/activity.api";
async function testFetchActiveActivities() {
  try {
    //referenceDate can be set to a specific date for testing, or left undefined to use today's date
    const activities = await fetchActiveActivities({
      locale: "vi",
      pagination: {
        page: 1,
        pageSize: 3,
      },

      referenceDate: "2026-03-05", // Example reference date for testing
    });
    console.log("Active Activities:", activities);
  } catch (error) {
    console.error("Error fetching active activities:", error);
  }
}
// testFetchActiveActivities();

// Usecase 2: Get Activity by activityCategory (for Activity List Page)
import { fetchActivitiesByCategory } from "@/features/activity/api/activity.api";
async function testFetchActivitiesByCategory() {
  try {
    const activities = await fetchActivitiesByCategory({
      category: "Phật Sự Trong Nước", // Example category for testing
      locale: "vi",
      pagination: {
        page: 1,
        pageSize: 5,
      },
      populate: ["coverImage"], // Example populate fields for testing
    });
    console.log("Activities by Category:", activities);
  } catch (error) {
    console.error("Error fetching activities by category:", error);
  }
}
//testFetchActivitiesByCategory();

// Usecase 3: Get Activity by documentId (for Activity Detail Page)
import { fetchActivityByDocumentId } from "@/features/activity/api/activity.api";
const documentId = "lgv3gu7ccx3u7dpwwn5zhqh4";
async function testFetchActivityByDocumentId() {
  try {
    const activity = await fetchActivityByDocumentId({
      documentId,
      locale: "vi",
      populate: ["coverImage", "relatedActivities.coverImage"],
    });
    console.log("Activity by Document ID:", activity);
    console.log(
      "Related Activities:",
      Array.isArray(activity.data)
        ? undefined
        : activity.data?.relatedActivities,
    );
  } catch (error) {
    console.error("Error fetching activity by document ID:", error);
  }
}
// testFetchActivityByDocumentId();

// Usecase 4: Get Registration Form by documentId (for Activity Registration Page)
import { fetchActivityByDocumentIdWithRegistrationForm } from "@/features/activity/api/activity.api";
async function testFetchActivityByDocumentIdWithRegistrationForm() {
  try {
    const activity = await fetchActivityByDocumentIdWithRegistrationForm({
      documentId,
      locale: "vi",
      populate: ["coverImage", "relatedActivities.coverImage"],
    });
    console.log("Activity by Document ID:", activity);
  } catch (error) {
    console.error("Error fetching activity by document ID:", error);
  }
}
// testFetchActivityByDocumentIdWithRegistrationForm();

// Usecase 5: Get Course by documentId with detailed courseContent (for Course Detail Page)
// Note: only course activities have courseContent, so this function will return courseContent only if the activity is a course. For non-course activities, courseContent will be null.
import { fetchActivityByDocumentIdWithCourseContent } from "@/features/activity/api/activity.api";
async function testFetchActivityByDocumentIdWithCourseContent() {
  try {
    const activity = await fetchActivityByDocumentIdWithCourseContent({
      documentId,
      locale: "vi",
      populate: ["coverImage", "relatedActivities.coverImage"],
    });
    console.log("Activity by Document ID:", activity);
  } catch (error) {
    console.error("Error fetching activity by document ID:", error);
  }
}
//testFetchActivityByDocumentIdWithCourseContent();

// Usecase 6: Get Course by courseCategory (for Course List Page)
import { fetchCoursesByCategory } from "@/features/activity/api/activity.api";
async function testFetchCoursesByCategory() {
  try {
    const activities = await fetchCoursesByCategory({
      category: "Khóa Tu Mùa Hè", // Example course category for testing
      locale: "vi",
      pagination: {
        page: 1,
        pageSize: 5,
      },
      populate: ["coverImage"], // Example populate fields for testing
    });
    console.log("Courses by Category:", activities);
  } catch (error) {
    console.error("Error fetching courses by category:", error);
  }
}
// testFetchCoursesByCategory();

// Usecase 7: Get nearest upcoming activity (for Home Page - Nearest Activity Section) --> fetchActive activities with pagination pageSize = 1 will return the nearest upcoming activity, since the API sorts active activities by start date in ascending order by default.

// Usecase 8: Check if activity is open for registration (for Activity Detail Page)
import { isActive } from "@/features/activity/api/activity.api";
async function testIsActive() {
  try {
    const activityResponse = await fetchActivityByDocumentId({
      documentId,
      locale: "vi",
    });
    const activity = Array.isArray(activityResponse.data)
      ? null
      : activityResponse.data;
    if (activity) {
      const activeStatus = isActive(activity);
      console.log(
        `Is activity "${activity.activityName}" active?`,
        activeStatus,
      );
    } else {
      console.log("Activity not found");
    }
  } catch (error) {
    console.error("Error fetching activity or checking active status:", error);
  }
}
testIsActive();

// Usecase 9: Get activities by month (for Calendar Page - Monthly View)
