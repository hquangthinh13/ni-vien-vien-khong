import "dotenv/config";
import { isValidLocale } from "@/types/locale";

import { fetchRulePage } from "@/features/rulePage/api/rulePage.api";
import type { RulePageAttributes } from "@/features/rulePage/model/rulePage.types";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";
const main = async () => {
  try {
    console.log("=== Testing Rule Page Service ===\n");
    const fullResponse = await fetchRulePage({
      locale,
      populate: "coverImage",
    });

    console.log("Rule Page (full response):");
    console.dir(fullResponse, { depth: null });
  } catch (error) {
    console.error("Failed to test Rule Page fetch:", error);
    process.exitCode = 1;
  }
};

main();
