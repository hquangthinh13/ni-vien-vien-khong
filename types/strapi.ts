export type SimpleFetchOptions = {
  locale?: string;
  populate?: string;
  signal?: AbortSignal;
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
