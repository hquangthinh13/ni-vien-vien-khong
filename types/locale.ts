export type Locale = "vi" | "en";

export const AVAILABLE_LOCALES: Locale[] = ["vi", "en"];

export const isValidLocale = (locale: unknown): locale is Locale => {
  return typeof locale === "string" && AVAILABLE_LOCALES.includes(locale as Locale);
};
