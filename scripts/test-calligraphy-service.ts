import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchCalligraphies,
  fetchCalligraphyByDocumentId,
  fetchCalligraphiesByCategory,
  getCalligraphyImages,
} from "@/features/calligraphy/api/calligraphy.api";
import type { Calligraphy } from "@/features/calligraphy/model/calligraphy.types";
import {
  isValidCalligraphyCategory,
  type CalligraphyCategory,
} from "@/types/categories";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = process.argv[3];
const categoryArg = isValidCalligraphyCategory(
  process.argv[4] as CalligraphyCategory,
)
  ? (process.argv[4] as CalligraphyCategory)
  : "Kinh Pháp Cú";

const main = async () => {
  try {
    console.log("=== Testing Calligraphy Services ===\n");

    // Test 1: Fetch all calligraphies
    console.log("1. Fetching all calligraphies (first page, 5 items):");
    const allCalligraphies = await fetchCalligraphies({
      locale,
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
    });

    console.log(
      `Total calligraphies: ${allCalligraphies.meta?.pagination?.total || 0}`,
    );

    const calligraphyList = allCalligraphies.data as Calligraphy[];
    if (Array.isArray(calligraphyList)) {
      calligraphyList.forEach((calligraphy, index) => {
        console.log(
          `  ${index + 1}. ${calligraphy.title} (${calligraphy.category || "N/A"})`,
        );
      });

      const images = getCalligraphyImages(calligraphyList, "medium") || [];
      console.log(`  Images found: ${images.length}`);
    }
    console.log();

    // Test 2: Fetch calligraphy by documentId (if provided)
    if (documentId) {
      console.log(`2. Fetching calligraphy by documentId: ${documentId}`);
      try {
        const calligraphyById = await fetchCalligraphyByDocumentId({
          documentId,
          locale,
          populate: "*",
        });

        if (calligraphyById.data && !Array.isArray(calligraphyById.data)) {
          const calligraphy = calligraphyById.data as Calligraphy;
          console.log("Title:", calligraphy.title);
          console.log("Category:", calligraphy.category || "N/A");
          console.log("Has cover image:", !!calligraphy.coverImage);
          console.log(
            "Related count:",
            calligraphy.relatedCalligraphies?.length || 0,
          );
        }
      } catch (error) {
        console.log(
          "✗ Failed to fetch calligraphy:",
          error instanceof Error ? error.message : error,
        );
      }
      console.log();
    } else {
      console.log("2. Skipping fetch by documentId (no documentId provided)\n");
    }

    // Test 3: Fetch calligraphies by category
    console.log(`3. Fetching calligraphies by category: ${categoryArg}`);
    const calligraphiesByCategory = await fetchCalligraphiesByCategory({
      category: categoryArg,
      locale,
      populate: "*",
      pagination: { pageSize: 10 },
    });

    if (Array.isArray(calligraphiesByCategory.data)) {
      console.log(`Found ${calligraphiesByCategory.data.length} calligraphies`);
      calligraphiesByCategory.data.forEach((calligraphy, index) => {
        console.log(`  ${index + 1}. ${calligraphy.title}`);
      });
    }
    console.log();

    // Test 4: Fetch calligraphies with specific fields
    console.log("4. Fetching calligraphies with specific fields only:");
    const specificFields = await fetchCalligraphies({
      locale,
      fields: ["title", "category"],
      pagination: { pageSize: 5 },
    });

    if (Array.isArray(specificFields.data) && specificFields.data.length > 0) {
      console.log(
        `✓ Fetched ${specificFields.data.length} calligraphies with limited fields`,
      );
      specificFields.data.forEach((calligraphy, index) => {
        console.log(
          `  ${index + 1}. ${calligraphy.title} (${calligraphy.category || "N/A"})`,
        );
      });
    } else {
      console.log("⚠ No calligraphies found");
    }
    console.log();

    console.log("=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
