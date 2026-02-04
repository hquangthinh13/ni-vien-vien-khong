import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageAttributes,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { CourseCategory } from "@/types/categories";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

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

export type CourseRegistrationAttributes = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  confirmed?: boolean;
  confirmationToken?: string;
  registedCourse?: Course;
  locale?: Locale;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  createdBy?: unknown;
  updatedBy?: unknown;
  localizations?: unknown[];
};

export type CourseRegistration = StrapiEntity<CourseRegistrationAttributes>;

export type CourseStatus = "upcoming" | "ongoing" | "completed" | "unknown";

export type CourseAttributes = {
  courseName: string;
  courseContent?: BlocksContent;
  category?: CourseCategory;
  courseStartDate?: string; // ISO date string
  courseEndDate?: string; // ISO date string
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: Locale;
  coverImage?: StrapiImageAttributes;
  highlightedImages?: StrapiImageAttributes[];
  videoSection?: VideoSection[];
  podcastSection?: PodcastSection[];
  courseRegistration?: CourseRegistration[];
  localizations?: unknown[];
};

export type Course = StrapiEntity<CourseAttributes>;

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

export type FetchCoursesOptions = BaseFetchOptionsWithFields<CourseAttributes>;

export type FetchCourseByDocumentIdOptions =
  BaseFetchOptionsWithFields<CourseAttributes> & {
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
