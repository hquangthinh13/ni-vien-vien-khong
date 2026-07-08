import React from "react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { formatShortDate } from "@/shared/lib/utils";
import type { Blog } from "@/features/blog/model/blog.types";
import { getAppLocale } from "@/shared/lib/i18n";
import {
  fetchBlogByDocumentId,
  fetchLatestBlogs,
} from "@/features/blog/api/blog.api";
import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import DetailPageShell from "@/shared/layout/DetailPageShell";
import DetailHeader from "@/shared/layout/DetailHeader";
import DetailDivider from "@/shared/layout/DetailDivider";
import RelatedBlogsSection from "@/features/blog/ui/RelatedBlogsSection";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
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
  } catch (error) {
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
    <DetailPageShell
      main={
        <div className="w-full max-w-none text-justify leading-relaxed">
          <AppBreadcrumb
            locale={locale}
            items={[
              { label: locale === "vi" ? "Thư viện" : "Library" },
              {
                label: locale === "vi" ? "Chia sẻ" : "Blog",
                href: "/library/blog",
              },
              { label: data.title },
            ]}
            className="mb-6"
          />
          <DetailHeader
            label={locale === "vi" ? "Chia sẻ" : "Blog"}
            title={data.title}
            meta={
              data.publishedAt ? (
                <div className="flex items-center gap-2 text-xs lg:text-sm font-sans text-muted-foreground">
                  <span>{formatShortDate(data.publishedAt, locale)}</span>
                </div>
              ) : null
            }
            imageUrl={getImageUrl(data.coverImage) || "/placeholder.png"}
            imageAlt={data.title || "Blog cover image"}
          />

          <DetailDivider />

          <div className="w-full">
            {data.blogContent ? (
              <RichTextRenderer content={data.blogContent || []} />
            ) : null}
          </div>
        </div>
      }
      sidebar={<RelatedBlogsSection blogs={relatedBlogs} locale={locale} />}
    />
  );
}
