import { StrapiEntity } from "@/types/strapi";
import type { Locale } from "@/types/locale";
import type { Activity } from "@/features/activity/model/activity.types";
import type { BasicInfoComponent } from "@/types/form-templates";

export type RegistrationStatus = "pending" | "active" | "cancelled";
export enum RegistrationStatusEnum {
  pending = "pending",
  active = "active",
  canceled = "canceled",
}
export interface IdentityDetail {
  [key: string]: unknown;
}
export interface MonasticDetail {
  [key: string]: unknown;
}
export interface RelationDetail {
  [key: string]: unknown;
}
export interface RoutineDetail {
  [key: string]: unknown;
}
export interface OtherDetail {
  [key: string]: unknown;
}

export interface RegistrationPayload {
  identityDetail?: IdentityDetail;
  monasticDetail?: MonasticDetail;
  relationDetail?: RelationDetail;
  routineDetail?: RoutineDetail;
  otherDetail?: OtherDetail;
}
export interface ActivityRegistration extends StrapiEntity {
  registreeData: BasicInfoComponent;
  registrationPayLoad?: RegistrationPayload;
  firstTimeRegistered: boolean;
  registrationStatus: RegistrationStatus;
  confirmed?: boolean;
  confirmationToken?: string;
  registeredActivity?: Activity;
  locale?: Locale;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  createdBy?: unknown;
  updatedBy?: unknown;
  localizations?: unknown[];
}

export type ActivityRegistrationResponse = {
  data: ActivityRegistration[] | ActivityRegistration | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type ActivityRegistrationFormData = {
  registreeData: BasicInfoComponent;
  registrationPayload?: RegistrationPayload;
  firstTimeRegistered: boolean;
  registeredActivity: string;
};
