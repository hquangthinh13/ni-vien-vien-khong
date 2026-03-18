import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import { SimpleFetchOptions } from "@/types/strapi";
import type { HistoryPageResponse } from "@/features/historyPage/model/historyPage.types";

const HISTORY_PAGE_ENDPOINT = "/api/history-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch History Page (with optional population) ============

export async function fetchHistoryPage(
  options: SimpleFetchOptions = {},
): Promise<HistoryPageResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${HISTORY_PAGE_ENDPOINT}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch history page: ${res.status}`);
  }

  return (await res.json()) as HistoryPageResponse;
}
