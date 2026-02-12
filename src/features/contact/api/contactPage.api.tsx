import { getStrapiURL, buildQuery } from "@/lib/api";
import { SimpleFetchOptions, BaseFetchOptionsWithFields } from "@/types/strapi";

import type {
  ContactPageResponse,
  ContactPageAttributes,
} from "@/features/contact/model/contactPage.types";

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
  options: BaseFetchOptionsWithFields<ContactPageAttributes>,
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
    throw new Error(`Failed to fetch contact page fields: ${res.status}`);
  }

  return (await res.json()) as ContactPageResponse;
}
