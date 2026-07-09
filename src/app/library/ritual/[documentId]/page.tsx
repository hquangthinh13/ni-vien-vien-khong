import React from "react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { Ritual } from "@/features/ritual/model/ritual.types";
import {
  fetchLatestRituals,
  fetchRitualByDocumentId,
} from "@/features/ritual/api/ritual.api";
import { getAppLocale } from "@/shared/lib/i18n";
import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import RelatedRitualsSection from "@/features/ritual/ui/RelatedRitualsSection";
import { Metadata } from "next";
import DetailArticleLayout from "@/shared/layout/DetailArticleLayout";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

type Props = {
  params: { documentId: string };
};

export async function generateMetadata(
  { params }: { params: { documentId: string } },
): Promise<Metadata> {
  const { documentId } = await params;
  const locale = await getAppLocale();

  try {
    const response = await fetchRitualByDocumentId({
      locale,
      documentId,
      populate: "*",
    });

    const data = response?.data as Ritual;

    if (!data) {
      return { title: "Không tìm thấy nghi thức" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description: "Thông tin nghi thức tại Ni Viện Viên Không",
      openGraph: {
        title: data.title,
        description: "Thông tin nghi thức tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function RitualPage({ params }: Props) {
  const locale = await getAppLocale();
  const { documentId } = await params;

  let response;
  try {
    response = await fetchRitualByDocumentId({
      locale,
      documentId,
      populate: "relatedRituals",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }

  if (!response || !response.data) {
    notFound();
  }

  const data = response.data as Ritual;
  const latestResponse = await fetchLatestRituals(locale, 5);
  const latestRituals = Array.isArray(latestResponse.data)
    ? latestResponse.data
    : latestResponse.data
      ? [latestResponse.data]
      : [];
  const mergedRelatedRituals = mergeRelatedItems<Ritual>({
    manualItems: data.relatedRituals || [],
    latestItems: latestRituals,
    currentDocumentId: data.documentId,
    limit: 5,
  });

  return (
    <DetailArticleLayout
      locale={locale}
      breadcrumbItems={[
        { label: locale === "vi" ? "Thư viện" : "Library", href: "/library" },
        {
          label: locale === "vi" ? "Nghi thức nghi lễ" : "Rituals",
          href: "/library/ritual",
        },
        { label: data.title },
      ]}
      header={{
        label: locale === "vi" ? "Nghi thức nghi lễ" : "Ritual",
        title: data.title,
        meta: data.publishedAt ? (
          <DateTimeDisplay
            dateString={data.publishedAt}
            locale={locale}
            includeTime={false}
          />
        ) : null,
        imageUrl: data.coverImage
          ? getImageUrl(data.coverImage, "medium") || "/placeholder.png"
          : null,
        imageAlt: data.title || "Ritual cover image",
      }}
      content={
        data.content ? <RichTextRenderer content={data.content} /> : null
      }
      share={{
        title: data.title,
        url: `/library/ritual/${data.documentId}`,
      }}
      sidebar={
        <RelatedRitualsSection locale={locale} rituals={mergedRelatedRituals} />
      }
    />
  );
}
