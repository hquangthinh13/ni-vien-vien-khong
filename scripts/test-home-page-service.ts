import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchHomePage,
  fetchHomePageFields,
} from "@/components/HomePage/HomePage.service";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";

const main = async () => {
  try {
    const [fullResponse, fieldsResponse] = await Promise.all([
      fetchHomePage({ locale, populate: "*" }),
      fetchHomePageFields({
        locale,
        populate: "*",
        fields: ["openingMessage"],
      }),
    ]);

    console.log("Home Page (full response):");
    console.dir(fullResponse, { depth: null });

    console.log("\nHome Page (fields response):");
    console.dir(fieldsResponse, { depth: null });
  } catch (error) {
    console.error("Failed to test Home Page fetch:", error);
    process.exitCode = 1;
  }
};

void main();
