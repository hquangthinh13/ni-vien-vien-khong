import {
  StrapiSingleResponse,
  StrapiImageEntity,
  StrapiEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";

export type MonasteryAttributes = {
  id: number;
  monasteryName: string;
  monasteryAddress: string;
  coverImage?: StrapiImageEntity;
  monasteryDescription?: string;
  openingHour?: string;
  closingHour?: string;
};

export interface MonasteryPageAttributes extends StrapiEntity {
  title: string;
  content?: string;
  useTemplate?: boolean;
  monasteries?: MonasteryAttributes[];
  coverImage?: StrapiImageEntity;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
}

export type MonasteryPageResponse =
  StrapiSingleResponse<MonasteryPageAttributes>;
