import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchPoems,
  fetchPoemByDocumentId,
} from "@/components/Poem/Poem.service";
import type { Poem } from "@/components/Poem/Poem.type";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = "k0f64y9tdxubxmcicqmp30nw"; // Replace with a valid documentId for testing

const main = async () => {
  try {
    console.log("=== Testing Poem Services ===\n");

    // Test 1: Fetch all poems
    console.log("1. Fetching all poems (first page, 5 items):");
    const allPoems = await fetchPoems({
      locale,
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
      sort: "publishedAt:desc",
    });

    console.log(`Total poems: ${allPoems.meta?.pagination?.total || 0}`);
    const poemsList = allPoems.data as Poem[];
    if (Array.isArray(poemsList)) {
      poemsList.forEach((poem, index) => {
        console.log(
          `  ${index + 1}. ${poem.title} - ${poem.author || "Unknown"}`,
        );
      });
    }
    console.log();

    // Test 2: Fetch poem by documentId (if provided)
    if (documentId) {
      console.log(`2. Fetching poem by documentId: ${documentId}`);
      try {
        const poemById = await fetchPoemByDocumentId({
          documentId,
          locale,
          populate: "*",
        });

        if (poemById.data && !Array.isArray(poemById.data)) {
          const poem = poemById.data as Poem;
          console.log("Title:", poem.title);
          console.log("Author:", poem.author || "Unknown");
          console.log("Has cover image:", !!poem.coverImage);
          console.log("Related count:", poem.relatedPoems?.length || 0);
        }
      } catch (error) {
        console.log(
          "✗ Failed to fetch poem:",
          error instanceof Error ? error.message : error,
        );
      }
      console.log();
    } else {
      console.log("2. Skipping fetch by documentId (no documentId provided)\n");
    }

    // Test 3: Fetch poems with specific fields
    console.log("3. Fetching poems with specific fields only:");
    const specificFields = await fetchPoems({
      locale,
      fields: ["title", "author", "publishedAt"],
      pagination: { pageSize: 5 },
      sort: "publishedAt:desc",
    });

    if (Array.isArray(specificFields.data) && specificFields.data.length > 0) {
      console.log(
        `✓ Fetched ${specificFields.data.length} poems with limited fields`,
      );
      specificFields.data.forEach((poem, index) => {
        console.log(
          `  ${index + 1}. ${poem.title} - ${poem.author || "Unknown"}`,
        );
      });
    } else {
      console.log("⚠ No poems found");
    }
    console.log();

    console.log("=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
