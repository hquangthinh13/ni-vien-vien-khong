import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface Ritual extends StrapiEntity {
  title: string;
  content?: BlocksContent;
  coverImage?: StrapiImageEntity;
  ritual?: Ritual;
  relatedRituals?: Ritual[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown;
}

export type RitualResponse = {
  data: Ritual[] | Ritual | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// Fetch Options Types

export type FetchRitualsOptions = BaseFetchOptionsWithFields<Ritual>;

export type FetchRitualByDocumentIdOptions =
  BaseFetchOptionsWithFields<Ritual> & {
    documentId: string;
  };
