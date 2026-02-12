import { getStrapiURL, buildQuery } from "@/lib/api";
import type {
  PoemResponse,
  FetchPoemsOptions,
  FetchPoemByDocumentIdOptions,
} from "../model/poem.types";

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
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch poems: ${res.status}`);
  }

  return (await res.json()) as PoemResponse;
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
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch poem by documentId: ${res.status}`);
  }

  return (await res.json()) as PoemResponse;
}
