import { StrapiSingleResponse } from "@/types/strapi";
import type { Locale } from "@/types/locale";

export type ContactPageAttributes = {
  address: string;
  phoneNumber: string;
  emailPrimary: string;
  haveSecondaryEmail: boolean;
  emailSecondary?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: Locale;
  facebookLink?: string;
  youtubeLink?: string;
  messengerLink?: string;
  zaloLink?: string;
};

export type ContactPageResponse = StrapiSingleResponse<ContactPageAttributes>;
