import { getStrapiURL, buildQuery } from "@/lib/api";
import type {
  CourseResponse,
  Course,
  FetchCoursesOptions,
  FetchCourseByDocumentIdOptions,
  FetchCoursesByCategoryOptions,
} from "./Course.type";

const COURSES_ENDPOINT = "/api/courses";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch All Courses (with optional fields, pagination, sort) ============

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

// ============ 2. Fetch Course by DocumentId ============

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

// ============ 3. Get Courses by Category ============

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
