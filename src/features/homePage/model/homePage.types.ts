import {
  StrapiSingleResponse,
  StrapiImageEntity,
  StrapiEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";

export interface HomePageAttributes extends StrapiEntity {
  openingMessage: string;
  coverImage?: StrapiImageEntity;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
}

export type HomePageResponse = StrapiSingleResponse<HomePageAttributes>;
