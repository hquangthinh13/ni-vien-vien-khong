export type Locale = "vi" | "en";

export const DEFAULT_LOCALE: Locale = "vi";

export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export const AVAILABLE_LOCALES: Locale[] = [...SUPPORTED_LOCALES];

export const isValidLocale = (locale: unknown): locale is Locale => {
  return typeof locale === "string" && AVAILABLE_LOCALES.includes(locale as Locale);
};

export const normalizeLocale = (locale: unknown): Locale => {
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
};
