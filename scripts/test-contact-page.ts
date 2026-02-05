import "dotenv/config";
import { isValidLocale } from "@/types/locale";
import {
  fetchContactPage,
  fetchContactPageFields,
} from "@/components/Contact/ContactPage.sevice";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";

const main = async () => {
  try {
    const [fullResponse, fieldsResponse] = await Promise.all([
      fetchContactPage({ locale }),
      fetchContactPageFields({
        locale,
        fields: ["address", "phoneNumber", "emailPrimary"],
      }),
    ]);

    console.log("Contact Page (full response):");
    console.dir(fullResponse, { depth: null });

    console.log("\nContact Page (fields response):");
    console.dir(fieldsResponse, { depth: null });
  } catch (error) {
    console.error("Failed to test Contact Page fetch:", error);
    process.exitCode = 1;
  }
};

void main();
