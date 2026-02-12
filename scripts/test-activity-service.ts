import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import { getImageUrl } from "@/lib/api";
import {
  fetchActivities,
  fetchActivityByDocumentId,
  fetchNearestActivity,
  fetchActivitiesByMonth,
  fetchActivitiesByCategory,
} from "@/features/activity/api/activity.api";
import type { Activity } from "@/features/activity/model/activity.types";
import {
  isValidActivityCategory,
  type ActivityCategory,
} from "@/types/categories";
import { format } from "path";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = process.argv[3]
  ? process.argv[3]
  : "n0j654v40yeeh650peevhza2";
const categoryArg = isValidActivityCategory(process.argv[4] as ActivityCategory)
  ? process.argv[4]
  : "Phật Sự Trong Nước";

const main = async () => {
  try {
    const [allActivities, nearestActivity] = await Promise.all([
      fetchActivities({
        locale,
        populate: "coverImage",
        pagination: { page: 1, pageSize: 5 },
        sort: "activityDate:desc",
      }),
      fetchNearestActivity({
        locale,
        populate: "*",
      }),
    ]);
    const nearestActivityData = (allActivities.data as Activity[])[0];
    const coverImageUrl = getImageUrl(nearestActivityData.coverImage);

    // console.log("Activities (first page):");
    // console.dir(allActivities, { depth: null });

    console.log("\nNearest activity:");
    // console.dir(nearestActivity, { depth: null });
    console.log("Cover image URL:", coverImageUrl);

    // const now = new Date();
    // console.log(`\\nCurrent date: ${now.toISOString()}`);
    // console.log(`Current month: ${now.getMonth() + 1}`);
    // console.log(`Current year: ${now.getFullYear()}`);
    // const byMonth = await fetchActivitiesByMonth({
    //   locale,
    //   year: now.getFullYear(),
    //   month: now.getMonth() + 1,
    //   pagination: { page: 1, pageSize: 10 },
    //   sort: "activityDate:asc",
    // });

    // console.log("\nActivities by current month:");
    // console.dir(byMonth, { depth: null });

    if (categoryArg) {
      const byCategory = await fetchActivitiesByCategory({
        locale,
        category: categoryArg as ActivityCategory,
        pagination: { page: 1, pageSize: 10 },
        sort: "activityDate:asc",
      });

      //   console.log(`\nActivities by category (${categoryArg}):`);
      //   console.dir(byCategory, { depth: null });
    }

    if (documentId) {
      const byDocumentId = await fetchActivityByDocumentId({
        locale,
        documentId: documentId,
      });

      console.log(`\nActivity by documentId (${documentId}):`);
      console.dir(byDocumentId, { depth: null });
    }
  } catch (error) {
    console.error("Failed to test Activity service:", error);
    process.exitCode = 1;
  }
};

void main();
