import { StrapiEntity } from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { Course } from "@/components/Course/Course.type";

export interface CourseRegistration extends StrapiEntity {
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
}

export type CourseRegistrationResponse = {
  data: CourseRegistration[] | CourseRegistration | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type CourseRegistrationFormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  registedCourseId: string;
};
