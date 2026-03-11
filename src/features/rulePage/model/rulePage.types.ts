import {
  StrapiSingleResponse,
  StrapiImageEntity,
  StrapiEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface RulePageAttributes extends StrapiEntity {
  coverImage?: StrapiImageEntity;
  title: string;
  description: string;
  content: BlocksContent;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
}

export type RulePageResponse = StrapiSingleResponse<RulePageAttributes>;
