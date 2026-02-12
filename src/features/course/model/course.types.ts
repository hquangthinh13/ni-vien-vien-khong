import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { CourseCategory } from "@/types/categories";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import type { CourseRegistration } from "@/features/courseRegistration/model/courseRegistration.types";

export type VideoSection = {
  id: number;
  day?: number;
  title?: string;
  videoLink: string;
  haveOrdinalDate: boolean | null;
};

export type PodcastSection = {
  id: number;
  day?: number;
  title?: string;
  podcastAsset: unknown;
  haveOrdinalDate: boolean | null;
};

export type CourseStatus = "upcoming" | "ongoing" | "completed" | "unknown";
export interface Course extends StrapiEntity {
  courseName: string;
  courseContent?: BlocksContent;
  category?: CourseCategory;
  courseStartDate?: string; // ISO date string
  courseEndDate?: string; // ISO date string
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: Locale;
  coverImage?: StrapiImageEntity;
  highlightedImages?: StrapiImageEntity[];
  videoSection?: VideoSection[];
  podcastSection?: PodcastSection[];
  courseRegistration?: CourseRegistration[];
  localizations?: unknown[];
}

export type CourseResponse = {
  data: Course[] | Course | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// Fetch Options Types

export type FetchCoursesOptions = BaseFetchOptionsWithFields<Course>;

export type FetchCourseByDocumentIdOptions =
  BaseFetchOptionsWithFields<Course> & {
    documentId: string;
  };

export type FetchCoursesByCategoryOptions = FetchCoursesOptions & {
  category: CourseCategory;
};

export type FetchActiveCoursesOptions = FetchCoursesOptions & {
  referenceDate?: string; // ISO date string, defaults to today
};

export type FetchCoursesByMonthOptions = FetchCoursesOptions & {
  year: number;
  month: number; // 1-12
};
