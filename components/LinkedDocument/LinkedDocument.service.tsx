import { getStrapiURL, buildQuery } from "@/lib/api";
import type {
  LinkedDocumentResponse,
  LinkedDocument,
  FetchLinkedDocumentsOptions,
  FetchLinkedDocumentByDocumentIdOptions,
  FetchLinkedDocumentsByCategoryOptions,
} from "./LinkedDocument.type";

const LINKED_DOCUMENTS_ENDPOINT = "/api/linked-documents";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Fetch All Linked Documents ============

export async function fetchLinkedDocuments(
  options: FetchLinkedDocumentsOptions = {},
): Promise<LinkedDocumentResponse> {
  const query = buildQuery(options);

  const url = getStrapiURL(
    `${LINKED_DOCUMENTS_ENDPOINT}${query ? `?${query}` : ""}`,
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
    throw new Error(`Failed to fetch linked documents: ${res.status}`);
  }

  return (await res.json()) as LinkedDocumentResponse;
}

// ============ 2. Fetch Linked Document by DocumentId ============

export async function fetchLinkedDocumentByDocumentId(
  options: FetchLinkedDocumentByDocumentIdOptions,
): Promise<LinkedDocumentResponse> {
  const query = buildQuery(options);
  const url = getStrapiURL(
    `${LINKED_DOCUMENTS_ENDPOINT}/${options.documentId}${query ? `?${query}` : ""}`,
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
    throw new Error(
      `Failed to fetch linked document by documentId: ${res.status}`,
    );
  }

  return (await res.json()) as LinkedDocumentResponse;
}

export async function fetchLinkedDocumentsByCategory(
  options: FetchLinkedDocumentsByCategoryOptions,
): Promise<LinkedDocumentResponse> {
  const query = buildQuery(options, false) as URLSearchParams;

  // Filter by category
  query.set("filters[category][$eq]", options.category);

  const url = getStrapiURL(
    `${LINKED_DOCUMENTS_ENDPOINT}${query.toString() ? `?${query}` : ""}`,
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
    throw new Error(
      `Failed to fetch linked documents by category: ${res.status}`,
    );
  }

  return (await res.json()) as LinkedDocumentResponse;
}
