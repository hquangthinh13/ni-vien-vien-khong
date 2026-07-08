import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import type {
  PoemResponse,
  FetchPoemsOptions,
  FetchPoemByDocumentIdOptions,
} from "../model/poem.types";
import type { Locale } from "@/types/locale";

const POEMS_ENDPOINT = "/api/poems";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch All Poems ============

export async function fetchPoems(
  options: FetchPoemsOptions = {},
): Promise<PoemResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${POEMS_ENDPOINT}${query ? `?${query}` : ""}`);

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
    throw new Error(`Failed to fetch poems: ${res.status}`);
  }

  return (await res.json()) as PoemResponse;
}

export async function fetchLatestPoems(
  locale: Locale,
  limit: number = 5,
): Promise<PoemResponse> {
  return fetchPoems({
    locale,
    sort: ["publishedAt:desc"],
    pagination: { limit },
    populate: "*",
  });
}

// ============ 2. Fetch Poem by DocumentId ============

export async function fetchPoemByDocumentId(
  options: FetchPoemByDocumentIdOptions,
): Promise<PoemResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${POEMS_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
  );

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
    throw new Error(`Failed to fetch poem by documentId: ${res.status}`);
  }

  return (await res.json()) as PoemResponse;
}
