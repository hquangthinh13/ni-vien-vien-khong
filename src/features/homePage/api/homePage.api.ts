import { getStrapiURL, buildQuery } from "@/lib/api";
import { SimpleFetchOptions, BaseFetchOptionsWithFields } from "@/types/strapi";

import type { HomePageAttributes, HomePageResponse } from "../model/homePage.types";
import Home from "@/app/page";

const HOME_PAGE_ENDPOINT = "/api/home-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch Home Page (with optional population) ============

export async function fetchHomePage(
  options: SimpleFetchOptions = {},
): Promise<HomePageResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(`${HOME_PAGE_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch home page: ${res.status}`);
  }

  return (await res.json()) as HomePageResponse;
}

// ============ 2. Fetch Home Page with Specific Fields ============

export async function fetchHomePageFields(
  options: BaseFetchOptionsWithFields<HomePageAttributes>,
): Promise<HomePageResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${HOME_PAGE_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch home page fields: ${res.status}`);
  }

  return (await res.json()) as HomePageResponse;
}

// ============ 3. Image URL Utility ============
