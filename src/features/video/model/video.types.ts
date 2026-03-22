import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
export type Video = {
  id: number;
  title: string;
  videoLink?: string;
};

export interface VideoPlaylist extends StrapiEntity {
  title: string;
  description?: string;
  coverImage?: StrapiImageEntity;
  videos: Video[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  localizations?: unknown;
}

export type VideoPlaylistResponse = {
  data: VideoPlaylist[] | VideoPlaylist | null;
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

export type FetchVideoPlaylistOptions =
  BaseFetchOptionsWithFields<VideoPlaylist>;

export type FetchVideoPlaylistByDocumentIdOptions =
  BaseFetchOptionsWithFields<VideoPlaylist> & {
    documentId: string;
  };
