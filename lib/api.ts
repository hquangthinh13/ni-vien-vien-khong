import { SimpleFetchOptions, BaseFetchOptionsWithFields } from "@/types/strapi";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export function getStrapiURL(path = "") {
  return `${STRAPI_URL}${path}`;
}

export const buildQuery = (
  options: SimpleFetchOptions | BaseFetchOptionsWithFields<unknown>,
) => {
  const params = new URLSearchParams();

  if (options.locale) params.set("locale", options.locale);

  const populate = options.populate ?? "*";
  params.set("populate", populate);

  if ("fields" in options && options.fields && options.fields.length > 0) {
    options.fields.forEach((field) => params.append("fields", String(field)));
  }

  return params.toString();
};

// fetch(getStrapiURL('/api/posts'))
