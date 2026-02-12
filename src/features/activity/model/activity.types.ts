import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { ActivityCategory } from "@/types/categories";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface Activity extends StrapiEntity {
  title: string;
  slug: string;
  description?: string;
  content?: BlocksContent;
  isEvent?: boolean;
  activityDate: string; // ISO date string
  category?: ActivityCategory;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: Locale;
  coverImage?: StrapiImageEntity;
  // relatedActivities?: {
  //   data: Activity[];
  // };
  relatedActivities?: Activity[];
}

export type ActivityResponse = {
  data: Activity[] | Activity | null;
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

export type FetchActivitiesOptions = BaseFetchOptionsWithFields<Activity>;

export type FetchActivityByDocumentIdOptions =
  BaseFetchOptionsWithFields<Activity> & {
    documentId: string;
  };

export type FetchNearestActivityOptions = FetchActivitiesOptions & {
  referenceDate?: string; // ISO date string
};

export type FetchActivitiesByMonthOptions = FetchActivitiesOptions & {
  year: number;
  month: number; // 1-12
};

export type FetchActivitiesByCategoryOptions = FetchActivitiesOptions & {
  category: ActivityCategory;
};
