import {
  StrapiSingleResponse,
  StrapiImageEntity,
  StrapiEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";

export type IntroductionPageActivity = {
  id: number;
  startTime: string;
  endTime: string;
  itemName: string;
  itemNote?: string;
};

export interface IntroductionPageAttributes extends StrapiEntity {
  title: string;
  content?: string;
  useTemplate?: boolean;
  activities?: IntroductionPageActivity[];
  coverImage?: StrapiImageEntity;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
}

export type IntroductionPageResponse =
  StrapiSingleResponse<IntroductionPageAttributes>;
