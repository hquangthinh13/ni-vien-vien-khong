import { StrapiSingleResponse, StrapiImageAttributes } from "@/types/strapi";
import type { Locale } from "@/types/locale";

export type HomePageAttributes = {
  openingMessage: string;
  coverImage?: StrapiImageAttributes;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
};

export type HomePageResponse = StrapiSingleResponse<HomePageAttributes>;
