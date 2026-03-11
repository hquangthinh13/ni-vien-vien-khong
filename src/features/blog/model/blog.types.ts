import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface Blog extends StrapiEntity {
  title: string;
  slug: string;
  blogContent: BlocksContent;
  coverImage: StrapiImageEntity;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: Locale;
}

export type BlogResponse = {
  data: Blog[] | Blog | null;
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

export type FetchBlogsOptions = BaseFetchOptionsWithFields<Blog>;

export type FetchBlogByDocumentIdOptions = BaseFetchOptionsWithFields<Blog> & {
  documentId: string;
};
