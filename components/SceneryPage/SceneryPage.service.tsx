import { getStrapiURL, buildQuery } from "@/lib/api";
import { SimpleFetchOptions } from "@/types/strapi";
import type { SceneryPageResponse } from "./SceneryPage.type";

const HISTORY_PAGE_ENDPOINT = "/api/scenery-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch Scenery Page - Tinh Canh Vien Khong (with optional population) ============

export async function fetchSceneryPage(
  options: SimpleFetchOptions = {},
): Promise<SceneryPageResponse> {
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
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch history page: ${res.status}`);
  }

  return (await res.json()) as SceneryPageResponse;
}
