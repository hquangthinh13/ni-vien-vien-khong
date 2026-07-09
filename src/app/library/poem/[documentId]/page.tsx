import React from "react";
import {
  fetchLatestPoems,
  fetchPoemByDocumentId,
} from "@/features/poem/api/poem.api";
import type { Poem } from "@/features/poem/model/poem.types";
import { getAppLocale } from "@/shared/lib/i18n";
import { getImageUrl } from "@/shared/lib/api";
import RelatedPoems from "@/features/poem/ui/RelatedPoems";
import { Metadata } from "next";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import DetailArticleLayout from "@/shared/layout/DetailArticleLayout";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import { notFound } from "next/navigation";

type Props = {
  params: { documentId: string };
};

export async function generateMetadata(
  { params }: { params: { documentId: string } },
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
  } catch {
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
    notFound();
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
    <DetailArticleLayout
      locale={locale}
      breadcrumbItems={[
        { label: locale === "vi" ? "Thư viện" : "Library", href: "/library" },
        {
          label: locale === "vi" ? "Thơ thiền" : "Poems",
          href: "/library/poem",
        },
        { label: data.title },
      ]}
      header={{
        label: locale === "vi" ? "Thơ thiền" : "Poem",
        title: data.title,
        meta: data.author ? (
          <span className="text-sm text-muted-foreground">{data.author}</span>
        ) : null,
        centered: true,
      }}
      content={
        data.content ? (
          <RichTextRenderer isPoem content={data.content} />
        ) : null
      }
      share={{
        title: data.title,
        url: `/library/poem/${data.documentId}`,
      }}
      sidebar={<RelatedPoems locale={locale} poems={mergedRelatedPoems} />}
    />
  );
}
