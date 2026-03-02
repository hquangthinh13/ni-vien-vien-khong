import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import type {
  RitualResponse,
  FetchRitualsOptions,
  FetchRitualByDocumentIdOptions,
} from "../model/ritual.types";

const RITUALS_ENDPOINT = "/api/rituals";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch All Rituals ============

export async function fetchRituals(
  options: FetchRitualsOptions = {},
): Promise<RitualResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${RITUALS_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch rituals: ${res.status}`);
  }

  return (await res.json()) as RitualResponse;
}

// ============ 2. Fetch Ritual by DocumentId ============

export async function fetchRitualByDocumentId(
  options: FetchRitualByDocumentIdOptions,
): Promise<RitualResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${RITUALS_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch ritual by documentId: ${res.status}`);
  }

  return (await res.json()) as RitualResponse;
}
