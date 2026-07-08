import { getStrapiURL, buildQuery } from "@/shared/lib/api";

import type {
  VideoPlaylistResponse,
  FetchVideoPlaylistOptions,
  FetchVideoPlaylistByDocumentIdOptions,
} from "@/features/video/model/video.types";
import type { Locale } from "@/types/locale";

const VIDEO_ENDPOINT = "/api/videos";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch All Videos ============

export async function fetchVideo(
  options: FetchVideoPlaylistOptions = {},
): Promise<VideoPlaylistResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${VIDEO_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    next: { revalidate: 1200 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch videos: ${res.status}`);
  }

  return (await res.json()) as VideoPlaylistResponse;
}

export async function fetchLatestVideoPlaylists(
  locale: Locale,
  limit: number = 5,
): Promise<VideoPlaylistResponse> {
  return fetchVideo({
    locale,
    sort: ["publishedAt:desc"],
    pagination: { limit },
    populate: "coverImage",
  });
}

// ============ 2. Fetch Video by DocumentId ============

export async function fetchVideoByDocumentId(
  options: FetchVideoPlaylistByDocumentIdOptions,
): Promise<VideoPlaylistResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${VIDEO_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
  );

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    next: { revalidate: 1200 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch videos by documentId: ${res.status}`);
  }

  return (await res.json()) as VideoPlaylistResponse;
}
