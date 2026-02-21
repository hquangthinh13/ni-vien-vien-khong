import "dotenv/config";
import { isValidLocale } from "@/types/locale";


import { fetchIntroductionPage } from "@/features/introductionPage/api/introductionPage.api";
import type { IntroductionPageAttributes } from "@/features/introductionPage/model/introductionPage.types";
// import type { MonasteryPageAttributes } from "@/components/MonasteryPage/MonasteryPage.type";
// import { fetchMonasteryPage } from "@/components/MonasteryPage/MonasteryPage.service";



const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";

const main = async () => {
  try {
    console.log("=== Testing Introduction Page Service ===\n");

    const fullResponse = await fetchIntroductionPage({
      locale,
      populate: "*",
    });

    console.log("Introduction Page (full response):");
    console.dir(fullResponse, { depth: null });

    const data = fullResponse.data as IntroductionPageAttributes | null;
    if (data) {
      console.log("\nIntroduction Page summary:");
      console.log("Title:", data.title || "(missing)");
      console.log("Use template:", data.useTemplate ?? false);
      console.log("Activities count:", data.activities?.length || 0);
      console.log("Has cover image:", !!data.coverImage);
    }
  } catch (error) {
    console.error("Failed to test Introduction Page fetch:", error);
    process.exitCode = 1;
  }
};

void main();
