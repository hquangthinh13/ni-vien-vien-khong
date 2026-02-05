import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import { fetchHistoryPage } from "@/components/HistoryPage/HistoryPage.service";
import type { HistoryPageAttributes } from "@/components/HistoryPage/HistoryPage.type";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";

const main = async () => {
  try {
    console.log("=== Testing History Page Service ===\n");

    const fullResponse = await fetchHistoryPage({
      locale,
      populate: "*",
    });

    console.log("History Page (full response):");
    console.dir(fullResponse, { depth: null });

    const data = fullResponse.data as HistoryPageAttributes | null;
    if (data) {
      console.log("\nHistory Page summary:");
      console.log("Title:", data.title || "(missing)");
      console.log("Has cover image:", !!data.coverImage);
      console.log("Content length:", data.content?.length || 0, "characters");
    }
  } catch (error) {
    console.error("Failed to test History Page fetch:", error);
    process.exitCode = 1;
  }
};

void main();
