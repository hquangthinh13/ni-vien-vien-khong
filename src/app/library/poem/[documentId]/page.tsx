import React from "react";
import {
  fetchLatestPoems,
  fetchPoemByDocumentId,
} from "@/features/poem/api/poem.api";
import type { Poem } from "@/features/poem/model/poem.types";
import { getAppLocale } from "@/shared/lib/i18n";
import { getImageUrl } from "@/shared/lib/api";
import RelatedPoems from "@/features/poem/ui/RelatedPoems";
import { Metadata, ResolvingMetadata } from "next";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import DetailPageShell from "@/shared/layout/DetailPageShell";
import DetailHeader from "@/shared/layout/DetailHeader";
import DetailDivider from "@/shared/layout/DetailDivider";
import EmptyState from "@/shared/layout/EmptyState";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

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
    const response = await fetchPoemByDocumentId({
      locale,
      documentId,
    });

    const data = response?.data as Poem;

    if (!data) {
      return { title: "Không tìm thấy bài thơ" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description: data.author || "Thông tin bài thơ tại Ni Viện Viên Không",
      openGraph: {
        title: data.title,
        description: data.author || "Thông tin bài thơ tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function PoemPage({ params }: Props) {
  const locale = await getAppLocale();
  const { documentId } = await params;

  let data: Poem | null = null;

  try {
    const fullResponse = await fetchPoemByDocumentId({
      documentId,
      locale,
    });
    data = (
      Array.isArray(fullResponse.data)
        ? fullResponse.data[0]
        : fullResponse.data
    ) as Poem | null;
  } catch (error) {
    console.error("Error fetching poem by documentId:", error);
  }

  if (!data) {
    return (
      <div className="page-container">
        <EmptyState
          message={
            locale === "vi" ? "Không tìm thấy bài thơ." : "Poem not found."
          }
        />
      </div>
    );
  }

  const latestResponse = await fetchLatestPoems(locale, 5);
  const latestPoems = Array.isArray(latestResponse.data)
    ? latestResponse.data
    : latestResponse.data
      ? [latestResponse.data]
      : [];
  const mergedRelatedPoems = mergeRelatedItems<Poem>({
    manualItems: data.relatedPoems || [],
    latestItems: latestPoems,
    currentDocumentId: data.documentId,
    limit: 5,
  });

  return (
    <DetailPageShell
      main={
        <div className="w-full max-w-none text-justify leading-relaxed">
          <AppBreadcrumb
            locale={locale}
            items={[
              { label: locale === "vi" ? "Thư viện" : "Library" },
              {
                label: locale === "vi" ? "Thơ thiền" : "Poems",
                href: "/library/poem",
              },
              { label: data.title },
            ]}
            className="mb-6"
          />
          <DetailHeader
            label={locale === "en" ? "Poem" : "Thơ thiền"}
            title={data.title}
            centered
          />

          <DetailDivider />

          <div className="w-full">
            {data.content ? (
              <RichTextRenderer isPoem={true} content={data.content || []} />
            ) : null}
          </div>
        </div>
      }
      sidebar={<RelatedPoems locale={locale} poems={mergedRelatedPoems} />}
    />
  );
}
