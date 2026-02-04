export type SimpleFetchOptions = {
  locale?: string;
  populate?: string;
  signal?: AbortSignal;
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

export type StrapiEntity<T> = {
  id: number;
  documentId?: string;
  attributes: T;
};

export type StrapiSingleResponse<T> = {
  data: StrapiEntity<T> | null;
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

export type StrapiImageFormats = {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
};

export type StrapiImageAttributes = {
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
};
