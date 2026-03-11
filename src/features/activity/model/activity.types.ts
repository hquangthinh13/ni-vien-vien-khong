import {
  StrapiEntity,
  BaseFetchOptionsWithFields,
  StrapiImageEntity,
} from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { ActivityCategory, CourseCategory } from "@/types/categories";
import type { FormSection, ComponentType } from "@/types/form-components";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import type { ActivityRegistration } from "@/features/courseRegistration/model/activityRegistration.types";

export type CourseStatus = "upcoming" | "ongoing" | "completed" | "unknown";

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

export type CourseContent = {
  id: number;
  courseCategory: CourseCategory;
  highlightedImages?: StrapiImageEntity[];
  videoSection?: VideoSection[];
  podcastSection?: PodcastSection[];
};
export interface Activity extends StrapiEntity {
  activityName: string;
  slug: string;
  content?: BlocksContent;
  activityStartDate: string; // ISO date string
  activityEndDate: string; // ISO date string
  activityCategory?: ActivityCategory;
  coverImage?: StrapiImageEntity;
  registrationLimit: number;
  ageRestricted: boolean;
  minAge?: number;
  maxAge?: number;
  courseContent?: CourseContent;
  registrationForm: RegistrationFormTemplate;
  activityRegistration?: ActivityRegistration[];
  relatedActivities?: Activity[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: Locale;
}

export type CustomizedComponent = {
  id: number;
  label: string;
  section: FormSection;
  type: ComponentType;
};
export type TextInput = {
  id: number;
  label: string;
};
export type MultipleChoiceOption = {
  id: number;
  haveOtherValue: boolean;
  multipleSelection: boolean;
  options: TextInput[];
};
export type RegistrationFormTemplate = {
  id: number;
  registrationDescription?: BlocksContent;
  defaultIdentitySectionIncluded: boolean;
  defaultMonasticSectionIncluded: boolean;
  defaultRelationSectionIncluded: boolean;
  defaultRoutineSectionIncluded: boolean;
  customizedComponents: CustomizedComponent[];
  commitmentMessages: TextInput[];
};

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

export type FetchActiveActivityOptions = FetchActivitiesOptions & {
  referenceDate?: string; // ISO date string
};

export type FetchActivitiesByMonthOptions = FetchActivitiesOptions & {
  year: number;
  month: number; // 1-12
};

export type FetchActivitiesByCategoryOptions = FetchActivitiesOptions & {
  category: ActivityCategory;
};

export type FetchCourseByCategoryOptions = FetchActivitiesOptions & {
  category: CourseCategory;
};
