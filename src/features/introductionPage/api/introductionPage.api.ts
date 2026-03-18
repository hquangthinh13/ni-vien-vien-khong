import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import { SimpleFetchOptions } from "@/types/strapi";
import type { IntroductionPageResponse } from "../model/introductionPage.types";

const INTRODUCTION_PAGE_ENDPOINT = "/api/introduction-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch Introduction Page (with optional population) ============

export async function fetchIntroductionPage(
  options: SimpleFetchOptions = {},
): Promise<IntroductionPageResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${INTRODUCTION_PAGE_ENDPOINT}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch introduction page: ${res.status}`);
  }

  return (await res.json()) as IntroductionPageResponse;
}
