export type SimpleFetchOptions = {
  locale?: string;
  populate?: Array<string> | string;
  signal?: AbortSignal;
  filters?: Record<string, unknown>;
};

export type BaseFetchOptionsWithFields<T> = SimpleFetchOptions & {
  sort?: string | string[];
  fields?: Array<keyof T>;
  pagination?: {
    page?: number;
    pageSize?: number;
    limit?: number;
  };
};

export interface StrapiEntity {
  id: number;
  documentId: string;
}

export type StrapiSingleResponse<T extends StrapiEntity> = {
  data: T | null;
  meta?: Record<string, unknown>;
};

export type StrapiImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
};

export type ImageFormat =
  | "thumbnail"
  | "small"
  | "medium"
  | "large"
  | "original";

export type StrapiImageFormats = {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
};

export interface StrapiImageEntity extends StrapiEntity {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: StrapiImageFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
