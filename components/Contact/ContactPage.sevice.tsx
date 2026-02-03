import { getStrapiURL, buildQuery } from "@/lib/api";
import { SimpleFetchOptions } from "@/types/strapi";

import type {
  ContactPageAttributes,
  ContactPageResponse,
  FetchContactPageFieldsOptions,
} from "./ContactPage.type";

const CONTACT_PAGE_ENDPOINT = "/api/contact-page";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

export async function fetchContactPage(
  options: SimpleFetchOptions = {},
): Promise<ContactPageResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${CONTACT_PAGE_ENDPOINT}${query ? `?${query}` : ""}`,
  );

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch contact page: ${res.status}`);
  }

  return (await res.json()) as ContactPageResponse;
}

export async function fetchContactPageFields(
  options: FetchContactPageFieldsOptions,
): Promise<ContactPageResponse> {
  const params = new URLSearchParams();

  if (options.locale) params.set("locale", options.locale);
  if (options.fields.length > 0) {
    options.fields.forEach((field) => params.append("fields", String(field)));
  }

  const url = getStrapiURL(
    `${CONTACT_PAGE_ENDPOINT}${params.toString() ? `?${params}` : ""}`,
  );

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch contact page fields: ${res.status}`);
  }

  return (await res.json()) as ContactPageResponse;
}
