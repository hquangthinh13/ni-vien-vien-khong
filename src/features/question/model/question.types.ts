import type { Locale } from "@/types/locale";
import { StrapiEntity, BaseFetchOptionsWithFields } from "@/types/strapi";

export type QuestionFormData = {
  fullName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  title: string;
  questionContent: string;
  locale: Locale;
};

export type QuestionStatus = "pending" | "answered" | "rejected";

export interface VideoResponse extends StrapiEntity {
  title?: string;
  videoLink: string;
}

export interface BlogResponse extends StrapiEntity {
  title?: string;
  responseContent: string;
}

export interface Question extends StrapiEntity {
  fullName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  title: string;
  questionContent: string;
  questionStatus?: QuestionStatus;
  videoResponseContent?: VideoResponse;
  blogResponseContent?: BlogResponse;
  locale?: Locale;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export type QuestionResponse = {
  data: Question[] | Question | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type FetchAnsweredQuestionsOptions =
  BaseFetchOptionsWithFields<Question>;
