import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import { SimpleFetchOptions } from "@/types/strapi";
import type { RulePageResponse } from "@/features/rulePage/model/rulePage.types";

const RULE_PAGE_ENDPOINT = "/api/rule-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

export async function fetchRulePage(
  options: SimpleFetchOptions = {},
): Promise<RulePageResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(`${RULE_PAGE_ENDPOINT}${query ? `?${query}` : ""}`);

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
    throw new Error(`Failed to fetch rule page: ${res.status}`);
  }

  return (await res.json()) as RulePageResponse;
}
