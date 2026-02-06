import { getStrapiURL, buildQuery } from "@/lib/api";
import type {
  ActivityResponse,
  FetchActivitiesOptions,
  FetchActivityByDocumentIdOptions,
  FetchNearestActivityOptions,
  FetchActivitiesByMonthOptions,
  FetchActivitiesByCategoryOptions,
} from "./Activity.type";

const ACTIVITIES_ENDPOINT = "/api/activities";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

export async function fetchActivities(
  options: FetchActivitiesOptions = {},
): Promise<ActivityResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${ACTIVITIES_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activities: ${res.status}`);
  }

  return (await res.json()) as ActivityResponse;
}

// ============ 2. Fetch Activity by DocumentId ============

export async function fetchActivityByDocumentId(
  options: FetchActivityByDocumentIdOptions,
): Promise<ActivityResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${ACTIVITIES_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
  );
  console.log("Fetching Activity by documentId with URL:", url);
  console.log("Using options:", options);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activity by documentId: ${res.status}`);
  }

  return (await res.json()) as ActivityResponse;
}

// ============ 3. Get Nearest Activity (by activityDate) ============

export async function fetchNearestActivity(
  options: FetchNearestActivityOptions,
): Promise<ActivityResponse> {
  // Set sort, limit, and filter for nearest future activity
  options.sort = "activityDate:asc";
  // options.pagination = { limit: 1 };
  options.sort = "activityDate:asc";
  if (!options.pagination) {
    options.pagination = { limit: 1 };
  }
  const query = buildQuery(options, false) as URLSearchParams;

  // Filter: activityDate >= today
  const today = new Date().toISOString().split("T")[0];
  if (!options.referenceDate) {
    options.referenceDate = today;
  } else {
    // Ensure referenceDate is in YYYY-MM-DD format
    options.referenceDate = options.referenceDate.split("T")[0];
  }
  query.set("filters[activityDate][$gte]", options.referenceDate);

  const url = getStrapiURL(
    `${ACTIVITIES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch nearest activity: ${res.status}`);
  }

  return (await res.json()) as ActivityResponse;
}

// ============ 4. Get Activities by Month ============

export async function fetchActivitiesByMonth(
  options: FetchActivitiesByMonthOptions,
): Promise<ActivityResponse> {
  options.sort = "activityDate:asc";
  const query = buildQuery(options, false) as URLSearchParams;
  // Date range filter: first day to last day of month
  const startDate = new Date(options.year, options.month - 1, 0)
    .toISOString()
    .split("T")[0];
  const endDate = new Date(options.year, options.month, 0)
    .toISOString()
    .split("T")[0];

  query.set("filters[activityDate][$gte]", startDate);
  query.set("filters[activityDate][$lte]", endDate);

  const url = getStrapiURL(
    `${ACTIVITIES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(
      `Failed to fetch activities by month and year: ${res.status}`,
    );
  }

  return (await res.json()) as ActivityResponse;
}

// ============ 5. Get Activities by Category ============

export async function fetchActivitiesByCategory(
  options: FetchActivitiesByCategoryOptions,
): Promise<ActivityResponse> {
  options.sort = "activityDate:asc";
  const query = buildQuery(options, false) as URLSearchParams;

  // Filter by category
  query.set("filters[category][$eq]", options.category);

  const url = getStrapiURL(
    `${ACTIVITIES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch activities by category: ${res.status}`);
  }

  return (await res.json()) as ActivityResponse;
}
