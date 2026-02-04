import { StrapiEntity, BaseFetchOptionsWithFields } from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { ActivityCategory } from "@/types/categories";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export type ActivityAttributes = {
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
};

export type Activity = StrapiEntity<ActivityAttributes>;

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

export type FetchActivitiesOptions =
  BaseFetchOptionsWithFields<ActivityAttributes>;

export type FetchActivityByDocumentIdOptions =
  BaseFetchOptionsWithFields<ActivityAttributes> & {
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
