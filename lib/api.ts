import {
  SimpleFetchOptions,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
  ImageFormat,
} from "@/types/strapi";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export function getStrapiURL(path = "") {
  return `${STRAPI_URL}${path}`;
}

export const buildQuery = (
  options: SimpleFetchOptions | BaseFetchOptionsWithFields<unknown>,
  returnParamString: boolean = true,
): URLSearchParams | string => {
  const params = new URLSearchParams();

  if (options.locale) params.set("locale", options.locale);

  if ("populate" in options && options.populate) {
    params.set("populate", options.populate);
  }

  if ("fields" in options && options.fields && options.fields.length > 0) {
    options.fields.forEach((field) => params.append("fields", String(field)));
  }

  if ("sort" in options && options.sort) {
    if (Array.isArray(options.sort)) {
      options.sort.forEach((sortField) => params.append("sort", sortField));
    }
  }

  if ("pagination" in options && options.pagination) {
    if (options.pagination.page) {
      params.set("pagination[page]", String(options.pagination.page));
    }
    if (options.pagination.pageSize) {
      params.set("pagination[pageSize]", String(options.pagination.pageSize));
    }
    if (options.pagination.limit) {
      params.set("pagination[limit]", String(options.pagination.limit));
    }
  }
  if (!returnParamString) {
    return params;
  }

  return params.toString();
};

export function getImageUrl(
  imageComponent: StrapiImageEntity | undefined,
  format: ImageFormat = "original",
): string | null {
  const imageProvider = imageComponent?.provider;
  console.log(imageComponent);
  if (format !== "original") {
    const formats = imageComponent?.formats;
    const formatData = formats ? formats[format] : null;
    if (formatData) {
      if (imageProvider === "local") {
        return getStrapiURL(formatData.url);
      }
      return formatData.url;
    }
  }

  if (imageProvider === "local") {
    return getStrapiURL(imageComponent?.url || "");
  }
  return imageComponent?.url || null;
}
