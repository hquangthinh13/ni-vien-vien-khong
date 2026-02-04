import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchLinkedDocuments,
  fetchLinkedDocumentByDocumentId,
  fetchLinkedDocumentsByCategory,
} from "@/components/LinkedDocument/LinkedDocument.service";
import type { LinkedDocument } from "@/components/LinkedDocument/LinkedDocument.type";
import {
  isValidLinkedDocumentCategory,
  type LinkedDocumentCategory,
} from "@/types/categories";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const documentId = process.argv[3];
const categoryArg = isValidLinkedDocumentCategory(
  process.argv[4] as LinkedDocumentCategory,
)
  ? (process.argv[4] as LinkedDocumentCategory)
  : "Tài Liệu Phật Pháp";

const main = async () => {
  try {
    console.log("=== Testing Linked Document Services ===\n");

    // Test 1: Fetch all linked documents
    console.log("1. Fetching all linked documents (first page, 5 items):");
    const allDocuments = await fetchLinkedDocuments({
      locale,
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
    });
    console.log(
      `Total documents: ${allDocuments.meta?.pagination?.total || 0}`,
    );
    const documentsList = allDocuments.data as LinkedDocument[];
    if (Array.isArray(documentsList)) {
      console.log("Document titles:");
      documentsList.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.title} (${doc.category})`);
      });
    }
    console.log();

    // Test 2: Fetch linked document by documentId (if provided)
    if (documentId) {
      console.log(`2. Fetching linked document by documentId: ${documentId}`);
      try {
        const documentById = await fetchLinkedDocumentByDocumentId({
          documentId,
          locale,
          populate: "*",
        });
        if (documentById.data && !Array.isArray(documentById.data)) {
          const doc = documentById.data as LinkedDocument;
          console.log("Document title:", doc.title);
          console.log("Category:", doc.category);
          console.log("Link:", doc.link);
          console.log("Has cover image:", !!doc.coverImage);
          console.log("Created at:", doc.createdAt || "N/A");
        }
      } catch (error) {
        console.log(
          "✗ Failed to fetch document:",
          error instanceof Error ? error.message : error,
        );
      }
      console.log();
    } else {
      console.log("2. Skipping fetch by documentId (no documentId provided)\n");
    }

    // Test 3: Fetch linked documents by category
    console.log(`3. Fetching linked documents by category: ${categoryArg}`);
    const documentsByCategory = await fetchLinkedDocumentsByCategory({
      category: categoryArg,
      locale,
      populate: "*",
      pagination: { pageSize: 10 },
    });
    if (Array.isArray(documentsByCategory.data)) {
      console.log(`Found ${documentsByCategory.data.length} documents`);
      documentsByCategory.data.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.title} - ${doc.link}`);
      });
    }
    console.log();

    // Test 4: Fetch linked documents with specific fields
    console.log("4. Fetching linked documents with specific fields only:");
    const specificFields = await fetchLinkedDocuments({
      locale,
      fields: ["title", "category", "link"],
      pagination: { pageSize: 5 },
    });
    if (Array.isArray(specificFields.data) && specificFields.data.length > 0) {
      console.log(
        `✓ Fetched ${specificFields.data.length} documents with limited fields`,
      );
      console.log("\n  Documents:");
      specificFields.data.forEach((doc, index) => {
        console.log(`    ${index + 1}. "${doc.title}"`);
        console.log(`       Category: ${doc.category}`);
        console.log(`       Link: ${doc.link}`);
      });
    } else {
      console.log("⚠ No documents found");
    }
    console.log();

    // Test 5: Fetch all categories
    console.log("5. Fetching documents grouped by category:");
    const categories: LinkedDocumentCategory[] = [
      "Tài Liệu Phật Pháp",
      "Kinh Sách",
      "Bài Giảng",
      "Tài Liệu Khác",
    ];

    for (const category of categories) {
      try {
        const docs = await fetchLinkedDocumentsByCategory({
          category,
          locale,
          pagination: { pageSize: 100 },
        });
        const count = Array.isArray(docs.data) ? docs.data.length : 0;
        console.log(`  ${category}: ${count} documents`);
      } catch (error) {
        console.log(`  ${category}: Error fetching`);
      }
    }
    console.log();

    console.log("=== All tests completed successfully! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
