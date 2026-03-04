import {
  StrapiSingleResponse,
  StrapiImageEntity,
  StrapiEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";

export interface RulePageAttributes extends StrapiEntity {
  coverImage?: StrapiImageEntity;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
}

export type RulePageResponse = StrapiSingleResponse<RulePageAttributes>;
