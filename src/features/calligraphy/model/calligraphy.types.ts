import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { CalligraphyCategory } from "@/types/categories";

export interface Calligraphy extends StrapiEntity {
  title: string;
  description?: string;
  category?: CalligraphyCategory;
  coverImage?: StrapiImageEntity;
  relatedCalligraphies?: Calligraphy[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown;
}

export type CalligraphyResponse = {
  data: Calligraphy[] | Calligraphy | null;
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

export type FetchCalligraphiesOptions = BaseFetchOptionsWithFields<Calligraphy>;

export type FetchCalligraphyByDocumentIdOptions =
  BaseFetchOptionsWithFields<Calligraphy> & {
    documentId: string;
  };

export type FetchCalligraphiesByCategoryOptions = FetchCalligraphiesOptions & {
  category: CalligraphyCategory;
};
