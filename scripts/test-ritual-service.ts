import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchRituals,
  fetchRitualByDocumentId,
} from "@/features/ritual/api/ritual.api";
import type { Ritual } from "@/features/ritual/model/ritual.types";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = process.argv[3]
  ? process.argv[3]
  : "r9ps1cjunadazu13api4v84p";

const main = async () => {
  try {
    console.log("=== Testing Ritual Services ===\n");

    // Test 1: Fetch all rituals
    console.log("1. Fetching all rituals (first page, 5 items):");
    const allRituals = await fetchRituals({
      locale,
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
      sort: "publishedAt:desc",
    });

    console.log(`Total rituals: ${allRituals.meta?.pagination?.total || 0}`);
    const ritualsList = allRituals.data as Ritual[];
    if (Array.isArray(ritualsList)) {
      ritualsList.forEach((ritual, index) => {
        console.log(`  ${index + 1}. ${ritual.documentId}`);
      });
    }
    console.log();

    // Test 2: Fetch ritual by documentId (if provided)
    if (documentId) {
      console.log(`2. Fetching ritual by documentId: ${documentId}`);
      try {
        const ritualById = await fetchRitualByDocumentId({
          documentId,
          locale,
          populate: "*",
        });

        if (ritualById.data && !Array.isArray(ritualById.data)) {
          const ritual = ritualById.data as Ritual;
          console.log("Title:", ritual.title);
          console.log("Has cover image:", !!ritual.coverImage);
          console.log("Related count:", ritual.relatedRituals?.length || 0);
        }
      } catch (error) {
        console.log(
          "✗ Failed to fetch ritual:",
          error instanceof Error ? error.message : error,
        );
      }
      console.log();
    } else {
      console.log("2. Skipping fetch by documentId (no documentId provided)\n");
    }

    // Test 3: Fetch rituals with specific fields
    console.log("3. Fetching rituals with specific fields only:");
    const specificFields = await fetchRituals({
      locale,
      fields: ["title", "publishedAt"],
      pagination: { pageSize: 5 },
      sort: "publishedAt:desc",
    });

    if (Array.isArray(specificFields.data) && specificFields.data.length > 0) {
      console.log(
        `✓ Fetched ${specificFields.data.length} rituals with limited fields`,
      );
      specificFields.data.forEach((ritual, index) => {
        console.log(`  ${index + 1}. ${ritual.title}`);
      });
    } else {
      console.log("⚠ No rituals found");
    }
    console.log();

    console.log("=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
