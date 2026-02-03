import { SimpleFetchOptions } from "@/types/strapi";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export function getStrapiURL(path = "") {
  return `${STRAPI_URL}${path}`;
}

export const buildQuery = ({ locale, populate }: SimpleFetchOptions) => {
  const params = new URLSearchParams();

  if (locale) params.set("locale", locale);
  params.set("populate", populate ?? "*");

  return params.toString();
};

// fetch(getStrapiURL('/api/posts'))
