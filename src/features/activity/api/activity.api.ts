import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import type {
  ActivityResponse,
  Activity,
  CourseStatus,
  FetchActivitiesOptions,
  FetchActivityByDocumentIdOptions,
  FetchActiveActivityOptions,
  FetchActivitiesByMonthOptions,
  FetchActivitiesByCategoryOptions,
  FetchCourseByCategoryOptions,
} from "@/features/activity/model/activity.types";
import {
  ACTIVITY_POPULATE_COURSE_CONTENT,
  ACTIVITY_POPULATE_REGISTRATION_FORM,
  ACTIVITY_POPULATE_REGISTRATION_FORM_AND_COURSE_CONTENT,
  mergePopulateOptions,
} from "@/features/activity/api/activity.populate";

const ACTIVITIES_ENDPOINT = "/api/activities";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

const SORT_DEFAULT = "activityStartDate:asc";
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
    next: { revalidate: 1200 },
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
  // console.log("Fetching Activity by documentId with URL:", url);
  // console.log("Using options:", options);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activity by documentId: ${res.status}`);
  }

  return (await res.json()) as ActivityResponse;
}

export async function fetchActivityByDocumentIdWithCourseContent(
  options: FetchActivityByDocumentIdOptions,
): Promise<ActivityResponse> {
  return await fetchActivityByDocumentId(
    mergePopulateOptions(options, ACTIVITY_POPULATE_COURSE_CONTENT),
  );
}

export async function fetchActivityByDocumentIdWithRegistrationForm(
  options: FetchActivityByDocumentIdOptions,
): Promise<ActivityResponse> {
  return await fetchActivityByDocumentId(
    mergePopulateOptions(options, ACTIVITY_POPULATE_REGISTRATION_FORM),
  );
}

export async function fetchActivityByDocumentIdWithRegistrationFormAndCourseContent(
  options: FetchActivityByDocumentIdOptions,
): Promise<ActivityResponse> {
  return await fetchActivityByDocumentId(
    mergePopulateOptions(
      options,
      ACTIVITY_POPULATE_REGISTRATION_FORM_AND_COURSE_CONTENT,
    ),
  );
}

// ============ 3. Get Nearest Activity (by activityDate) ============

export async function fetchActiveActivities(
  options: FetchActiveActivityOptions,
): Promise<ActivityResponse> {
  // Set sort, limit, and filter for nearest future activity
  if (!options.sort) {
    options.sort = SORT_DEFAULT;
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
  query.set("filters[activityStartDate][$gte]", options.referenceDate);

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
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch active activities: ${res.status}`);
  }

  return (await res.json()) as ActivityResponse;
}

// ============ 4. Get Activities by Month ============

export async function fetchActivitiesByMonth(
  options: FetchActivitiesByMonthOptions,
): Promise<ActivityResponse> {
  if (!options.sort) {
    options.sort = SORT_DEFAULT;
  }
  const query = buildQuery(options, false) as URLSearchParams;
  // Date range filter: first day to last day of month
  // const startDate = new Date(options.year, options.month - 1, 0)
  //   .toISOString()
  //   .split("T")[0];
  // const endDate = new Date(options.year, options.month, 0)
  //   .toISOString()
  //   .split("T")[0];
  function toDateString(year: number, month: number, day: number) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const startDate = toDateString(options.year, options.month, 1);

  const lastDay = new Date(options.year, options.month, 0).getDate();

  const endDate = toDateString(options.year, options.month, lastDay);

  // query.set("filters[activityStartDate][$gte]", startDate);
  // query.set("filters[activityEndDate][$lte]", endDate);
  query.set("filters[activityStartDate][$gte]", startDate);
  query.set("filters[activityStartDate][$lte]", endDate);
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
    next: { revalidate: 1200 },
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
  if (!options.sort) {
    options.sort = SORT_DEFAULT;
  }
  const query = buildQuery(options, false) as URLSearchParams;

  // Filter by category
  if (options.category === "Tất cả") {
    // Do not add any filter for "all" category
    query.set("filters[activityCategory][$ne]", "Khóa Tu"); // Exclude "Khóa Tu" from general activities
  } else {
    query.set("filters[activityCategory][$eq]", options.category);
  }
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
    next: { revalidate: 1200 },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch activities by category: ${res.statusText} (${res.status})`,
    );
  }

  return (await res.json()) as ActivityResponse;
}

export async function fetchCoursesByCategory(
  options: FetchCourseByCategoryOptions,
): Promise<ActivityResponse> {
  if (!options.sort) {
    options.sort = SORT_DEFAULT;
  }
  const query = buildQuery(options, false) as URLSearchParams;

  query.set("filters[activityCategory][$eq]", "Khóa Tu");

  if (options.category === "Tất cả") {
    // Do not add any filter for "all" category
  } else {
    query.set("filters[courseContent][courseCategory][$eq]", options.category);
  }
  // All course  have activity category = "course"
  // query.set("filters[activityCategory][$eq]", "Khóa Tu");
  // Filter by course category
  // query.set("filters[courseContent][courseCategory][$eq]", options.category);

  // Filter by year if provided
  if (options.year) {
    const startOfYear = `${options.year}-01-01T00:00:00.000Z`;
    const endOfYear = `${options.year}-12-31T23:59:59.999Z`;

    query.set("filters[activityStartDate][$between][0]", startOfYear);
    query.set("filters[activityStartDate][$between][1]", endOfYear);
  }

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
    next: { revalidate: 1200 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch courses by category: ${res.status}`);
  }
  return (await res.json()) as ActivityResponse;
}
export function getActivityStatus(
  activity: Activity,
  referenceDate?: string,
): CourseStatus {
  const startDate = new Date(activity.activityStartDate);
  const endDate = new Date(activity.activityEndDate);
  if (!startDate || !endDate) {
    return "unknown";
  }

  const refDate = referenceDate ? new Date(referenceDate) : new Date();

  if (refDate < startDate) {
    return "upcoming";
  }

  if (refDate >= startDate && refDate <= endDate) {
    return "ongoing";
  }

  if (refDate > endDate) {
    return "completed";
  }
  return "unknown";
}

export function isActive(activity: Activity, referenceDate?: string): boolean {
  const status = getActivityStatus(activity, referenceDate);
  return status === "upcoming" || status === "ongoing";
}
export async function fetchAllCourseYears(): Promise<number[]> {
  const query = new URLSearchParams();

  query.set("fields[0]", "activityStartDate");

  query.set("filters[activityCategory][$eq]", "Khóa Tu");

  // query.set("pagination[limit]", "-1");

  const url = getStrapiURL(
    `${ACTIVITIES_ENDPOINT}${query.toString() ? `?${query.toString()}` : ""}`,
  );

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${AUTHORIZED_TOKEN}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [new Date().getFullYear()];

  const response = await res.json();
  const activities = response.data as Activity[];

  console.log("Fetched activities for year extraction:", activities);

  const years = Array.from(
    new Set(
      activities
        .filter((a) => a.activityStartDate)
        .map((a) => new Date(a.activityStartDate).getFullYear()),
    ),
  ).sort((a, b) => b - a);

  return years.length > 0 ? years : [new Date().getFullYear()];
}
