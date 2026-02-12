import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface Poem extends StrapiEntity {
  title: string;
  author?: string;
  coverImage?: StrapiImageEntity;
  content?: BlocksContent;
  poem?: Poem;
  relatedPoems?: Poem[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown;
}

export type PoemResponse = {
  data: Poem[] | Poem | null;
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

export type FetchPoemsOptions = BaseFetchOptionsWithFields<Poem>;

export type FetchPoemByDocumentIdOptions = BaseFetchOptionsWithFields<Poem> & {
  documentId: string;
};
