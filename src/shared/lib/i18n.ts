import { getLocale } from "next-intl/server";
import { normalizeLocale } from "@/types/locale";

export async function getAppLocale() {
  return normalizeLocale(await getLocale());
}
