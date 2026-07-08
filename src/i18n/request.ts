import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { normalizeLocale } from "@/types/locale";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = normalizeLocale(store.get("locale")?.value);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
