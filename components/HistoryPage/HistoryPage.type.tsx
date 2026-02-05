import {
  StrapiSingleResponse,
  StrapiImageEntity,
  StrapiEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface HistoryPageAttributes extends StrapiEntity {
  title: string;
  content: BlocksContent;
  coverImage?: StrapiImageEntity;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown[];
}

export type HistoryPageResponse = StrapiSingleResponse<HistoryPageAttributes>;
