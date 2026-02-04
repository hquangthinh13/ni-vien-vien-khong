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
