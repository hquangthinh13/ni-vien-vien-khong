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

export type VideoResponseAttributes = {
  title?: string;
  responseContent: string;
};

export type BlogResponseAttributes = {
  title?: string;
  videoLink: string;
};

export type VideoResponse = StrapiEntity<VideoResponseAttributes>;

export type BlogResponse = StrapiEntity<BlogResponseAttributes>;

export type QuestionAttributes = {
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
};

export type Question = StrapiEntity<QuestionAttributes>;

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
  BaseFetchOptionsWithFields<QuestionAttributes>;
