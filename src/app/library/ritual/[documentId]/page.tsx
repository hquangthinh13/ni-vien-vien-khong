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
import { Metadata, ResolvingMetadata } from "next";
import DetailPageShell from "@/shared/layout/DetailPageShell";
import DetailHeader from "@/shared/layout/DetailHeader";
import DetailDivider from "@/shared/layout/DetailDivider";
import { mergeRelatedItems } from "@/shared/lib/related-content";

type Props = {
  params: { documentId: string };
};

export async function generateMetadata(
  { params }: { params: { documentId: string } },
  parent: ResolvingMetadata,
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
  } catch (error) {
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
    <DetailPageShell
      main={
        <div className="w-full max-w-none text-justify leading-relaxed">
          <DetailHeader
            label="Nghi thức nghi lễ"
            title={data.title}
            imageUrl={
              data.coverImage
                ? getImageUrl(data.coverImage, "medium") || "/placeholder.png"
                : null
            }
            imageAlt={data.title || "Ritual cover image"}
          />

          <DetailDivider />

          <div className="w-full">
            {data.content ? <RichTextRenderer content={data.content || []} /> : null}
          </div>
        </div>
      }
      sidebar={
        <RelatedRitualsSection locale={locale} rituals={mergedRelatedRituals} />
      }
    />
  );
}
