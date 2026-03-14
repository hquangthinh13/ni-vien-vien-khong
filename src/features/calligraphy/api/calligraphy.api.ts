import { getStrapiURL, buildQuery, getImageUrl } from "@/shared/lib/api";
import type {
  CalligraphyResponse,
  Calligraphy,
  FetchCalligraphiesOptions,
  FetchCalligraphyByDocumentIdOptions,
  FetchCalligraphiesByCategoryOptions,
} from "../model/calligraphy.types";
import type { ImageFormat } from "@/types/strapi";

const CALLIGRAPHIES_ENDPOINT = "/api/calligraphies";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch All Calligraphies ============

export async function fetchCalligraphies(
  options: FetchCalligraphiesOptions = {},
): Promise<CalligraphyResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(
    `${CALLIGRAPHIES_ENDPOINT}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch calligraphies: ${res.status}`);
  }

  return (await res.json()) as CalligraphyResponse;
}

// ============ 2. Fetch Calligraphy by DocumentId ============

export async function fetchCalligraphyByDocumentId(
  options: FetchCalligraphyByDocumentIdOptions,
): Promise<CalligraphyResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${CALLIGRAPHIES_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
  );

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    // next: { revalidate: 0 },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch calligraphy by documentId: ${res.status}`);
  }

  return (await res.json()) as CalligraphyResponse;
}

// ============ 3. Fetch Calligraphies by Category ============

export async function fetchCalligraphiesByCategory(
  options: FetchCalligraphiesByCategoryOptions,
): Promise<CalligraphyResponse> {
  const query = buildQuery(options, false) as URLSearchParams;

  if (options.category === "Tất cả") {
    // Do not add any filter for "all" category
  } else {
    query.set("filters[category][$eq]", options.category);
  }
  // Filter by category
  // query.set("filters[category][$eq]", options.category);

  const url = getStrapiURL(
    `${CALLIGRAPHIES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch calligraphies by category: ${res.status}`);
  }

  return (await res.json()) as CalligraphyResponse;
}

// ============ 4. Get Cover Image URL (with specified format) ============

export function getCalligraphyImages(
  calligraphyList: Calligraphy[],
  format: ImageFormat = "medium",
): string[] | null {
  if (calligraphyList && calligraphyList.length > 0) {
    return calligraphyList
      .map((calligraphy) => {
        if (calligraphy.coverImage) {
          return getImageUrl(calligraphy.coverImage, format);
        }
        return null;
      })
      .filter((url): url is string => url !== null);
  }
  return [];
}

// ============ 5. Check if Calligraphy has Cover Image ============

export function hasCoverImage(calligraphy: Calligraphy): boolean {
  return !!calligraphy.coverImage;
}

// ============ 6. Check if Calligraphy has Related Calligraphies ============

export function hasRelatedCalligraphies(calligraphy: Calligraphy): boolean {
  return !!(
    calligraphy.relatedCalligraphies &&
    calligraphy.relatedCalligraphies.length > 0
  );
}

// ============ 7. Get Related Calligraphies Count ============

export function getRelatedCalligraphiesCount(calligraphy: Calligraphy): number {
  return calligraphy.relatedCalligraphies?.length || 0;
}
