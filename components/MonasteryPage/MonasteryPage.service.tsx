import { getStrapiURL, buildQuery } from "@/lib/api";
import { SimpleFetchOptions } from "@/types/strapi";
import type { MonasteryPageResponse } from "./MonasteryPage.type";
const MONASTERY_PAGE_ENDPOINT = "/api/monastery-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch Monastery Page - Tu Vien Khac (with optional population) ============

export async function fetchMonasteryPage(
  options: SimpleFetchOptions = {},
): Promise<MonasteryPageResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${MONASTERY_PAGE_ENDPOINT}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch monastery page: ${res.status}`);
  }

  return (await res.json()) as MonasteryPageResponse;
}
