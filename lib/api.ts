const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export function getStrapiURL(path = "") {
  return `${STRAPI_URL}${path}`;
}

// fetch(getStrapiURL('/api/posts'))