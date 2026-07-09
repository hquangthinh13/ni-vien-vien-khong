import React from "react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import type { Blog } from "@/features/blog/model/blog.types";
import { getAppLocale } from "@/shared/lib/i18n";
import {
  fetchBlogByDocumentId,
  fetchLatestBlogs,
} from "@/features/blog/api/blog.api";
import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import DetailArticleLayout from "@/shared/layout/DetailArticleLayout";
import RelatedBlogsSection from "@/features/blog/ui/RelatedBlogsSection";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const locale = await getAppLocale();

  try {
    const response = await fetchBlogByDocumentId({
      locale,
      documentId,
    });

    const data = response?.data as Blog;

    if (!data) {
      return { title: "Không tìm thấy bài viết" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description: "Chia sẻ từ Ni Viện Viên Không",
      openGraph: {
        title: data.title,
        description: "Chia sẻ từ Ni Viện Viên Không",
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function ActivityPage({ params }: Props) {
  const locale = await getAppLocale();
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  let response;
  try {
    response = await fetchBlogByDocumentId({
      locale,
      documentId,
      populate: "*",
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

  const data = response.data as Blog;
  const latestResponse = await fetchLatestBlogs(locale, 5);
  const latestBlogs = Array.isArray(latestResponse.data)
    ? latestResponse.data
    : latestResponse.data
      ? [latestResponse.data]
      : [];
  const relatedBlogs = mergeRelatedItems<Blog>({
    manualItems: [],
    latestItems: latestBlogs,
    currentDocumentId: data.documentId,
    limit: 5,
  });

  return (
    <DetailArticleLayout
      locale={locale}
      breadcrumbItems={[
        { label: locale === "vi" ? "Thư viện" : "Library", href: "/library" },
        {
          label: locale === "vi" ? "Chia sẻ" : "Blog",
          href: "/library/blog",
        },
        { label: data.title },
      ]}
      header={{
        label: locale === "vi" ? "Chia sẻ" : "Blog",
        title: data.title,
        meta: data.publishedAt ? (
          <DateTimeDisplay
            dateString={data.publishedAt}
            locale={locale}
            includeTime={false}
          />
        ) : null,
        imageUrl: getImageUrl(data.coverImage) || "/placeholder.png",
        imageAlt: data.title || "Blog cover image",
      }}
      content={
        data.blogContent ? (
          <RichTextRenderer content={data.blogContent} />
        ) : null
      }
      share={{
        title: data.title,
        url: `/library/blog/${data.slug}-${data.documentId}`,
      }}
      sidebar={<RelatedBlogsSection blogs={relatedBlogs} locale={locale} />}
    />
  );
}
