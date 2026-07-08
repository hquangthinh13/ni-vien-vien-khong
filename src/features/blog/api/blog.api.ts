import { getStrapiURL, buildQuery } from "@/shared/lib/api";

import type {
  BlogResponse,
  FetchBlogsOptions,
  FetchBlogByDocumentIdOptions,
} from "@/features/blog/model/blog.types";
import type { Locale } from "@/types/locale";

const BLOGS_ENDPOINT = "/api/blogs";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

export async function fetchBlogs(
  options: FetchBlogsOptions = {},
): Promise<BlogResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${BLOGS_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activities: ${res.status}`);
  }

  return (await res.json()) as BlogResponse;
}

export async function fetchLatestBlogs(
  locale: Locale,
  limit: number = 5,
): Promise<BlogResponse> {
  return fetchBlogs({
    locale,
    sort: ["publishedAt:desc"],
    pagination: { limit },
    populate: "coverImage",
  });
}

// ============ 2. Fetch Blog by DocumentId ============

export async function fetchBlogByDocumentId(
  options: FetchBlogByDocumentIdOptions,
): Promise<BlogResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${BLOGS_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
  );
  // console.log("Fetching Blog by documentId with URL:", url);
  // console.log("Using options:", options);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activity by documentId: ${res.status}`);
  }

  return (await res.json()) as BlogResponse;
}
