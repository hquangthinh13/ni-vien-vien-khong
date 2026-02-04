import { getStrapiURL, buildQuery } from "@/lib/api";
import type {
  CourseResponse,
  Course,
  CourseStatus,
  FetchCoursesOptions,
  FetchCourseByDocumentIdOptions,
  FetchCoursesByCategoryOptions,
  FetchActiveCoursesOptions,
  FetchCoursesByMonthOptions,
} from "./Course.type";

const COURSES_ENDPOINT = "/api/courses";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

export async function fetchCourses(
  options: FetchCoursesOptions = {},
): Promise<CourseResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(`${COURSES_ENDPOINT}${query ? `?${query}` : ""}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.status}`);
  }

  return (await res.json()) as CourseResponse;
}

export async function fetchCourseByDocumentId(
  options: FetchCourseByDocumentIdOptions,
): Promise<CourseResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${COURSES_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch course by documentId: ${res.status}`);
  }

  return (await res.json()) as CourseResponse;
}

export async function fetchCoursesByCategory(
  options: FetchCoursesByCategoryOptions,
): Promise<CourseResponse> {
  const query = buildQuery(options, false) as URLSearchParams;

  // Filter by category
  query.set("filters[category][$eq]", options.category);

  const url = getStrapiURL(
    `${COURSES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch courses by category: ${res.status}`);
  }

  return (await res.json()) as CourseResponse;
}

export async function fetchActiveCourses(
  options: FetchActiveCoursesOptions = {},
): Promise<CourseResponse> {
  const query = buildQuery(options, false) as URLSearchParams;

  // Get reference date (default to today)
  const referenceDate = options.referenceDate
    ? options.referenceDate.split("T")[0]
    : new Date().toISOString().split("T")[0];

  // Filter: endDate >= referenceDate (courses that haven't ended yet)
  query.set("filters[courseEndDate][$gte]", referenceDate);

  // Sort by start date
  if (!options.sort) {
    query.set("sort", "courseStartDate:asc");
  }

  const url = getStrapiURL(
    `${COURSES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch active courses: ${res.status}`);
  }

  return (await res.json()) as CourseResponse;
}

export async function fetchCoursesByMonth(
  options: FetchCoursesByMonthOptions,
): Promise<CourseResponse> {
  const query = buildQuery(options, false) as URLSearchParams;

  // Date range filter: first day to last day of month
  const startMonthDate = new Date(options.year, options.month - 1, 0)
    .toISOString()
    .split("T")[0];
  const endMonthDate = new Date(options.year, options.month, 0)
    .toISOString()
    .split("T")[0];

  // Filter courses that start within the month OR are ongoing during the month
  // This uses startDate for filtering
  query.set("filters[courseStartDate][$gte]", startMonthDate);
  query.set("filters[courseStartDate][$lte]", endMonthDate);

  const url = getStrapiURL(
    `${COURSES_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch courses by month and year: ${res.status}`);
  }

  return (await res.json()) as CourseResponse;
}

export function getCourseStatus(
  course: Course,
  referenceDate?: string,
): CourseStatus {
  const startDate = course.courseStartDate;
  const endDate = course.courseEndDate;
  // If no dates available, status is unknown
  if (!startDate && !endDate) {
    return "unknown";
  }

  const refDate = referenceDate
    ? new Date(referenceDate.split("T")[0])
    : new Date(new Date().toISOString().split("T")[0]);

  // Parse dates
  const start = startDate ? new Date(startDate.split("T")[0]) : null;
  const end = endDate ? new Date(endDate.split("T")[0]) : null;

  // Course hasn't started yet
  if (start && refDate < start) {
    return "upcoming";
  }

  // Course has ended
  if (end && refDate > end) {
    return "completed";
  }

  // Course is currently running
  if (start && refDate >= start && (!end || refDate <= end)) {
    return "ongoing";
  }

  return "unknown";
}

export function isCourseActive(
  course: Course,
  referenceDate?: string,
): boolean {
  const status = getCourseStatus(course, referenceDate);
  return status === "upcoming" || status === "ongoing";
}

export function filterCoursesByStatus(
  courses: Course[],
  status: CourseStatus,
  referenceDate?: string,
): Course[] {
  return courses.filter(
    (course) => getCourseStatus(course, referenceDate) === status,
  );
}

// Returns the documentId if the course is active, otherwise undefined
export function getActiveCourseID(course: Course): string | undefined {
  if (isCourseActive(course)) {
    return course.documentId;
  } else return undefined;
}
