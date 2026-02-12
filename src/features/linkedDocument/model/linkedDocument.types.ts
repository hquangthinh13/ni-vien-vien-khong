import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { LinkedDocumentCategory } from "@/types/categories";

export interface LinkedDocument extends StrapiEntity {
  title: string;
  link: string;
  category: LinkedDocumentCategory;
  coverImage?: StrapiImageEntity;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
}

export type LinkedDocumentResponse = {
  data: LinkedDocument[] | LinkedDocument | null;
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

export type FetchLinkedDocumentsOptions =
  BaseFetchOptionsWithFields<LinkedDocument>;

export type FetchLinkedDocumentByDocumentIdOptions =
  BaseFetchOptionsWithFields<LinkedDocument> & {
    documentId: string;
  };

export type FetchLinkedDocumentsByCategoryOptions =
  FetchLinkedDocumentsOptions & {
    category: LinkedDocumentCategory;
  };
