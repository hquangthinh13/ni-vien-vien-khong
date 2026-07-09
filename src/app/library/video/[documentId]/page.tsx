import React from "react";
import { getAppLocale } from "@/shared/lib/i18n";

import type { VideoPlaylist } from "@/features/video/model/video.types";
import {
  fetchLatestVideoPlaylists,
  fetchVideoByDocumentId,
} from "@/features/video/api/video.api";
import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import DetailArticleLayout from "@/shared/layout/DetailArticleLayout";
import DetailVideoAccordion from "@/shared/layout/DetailVideoAccordion";
import RelatedVideosSection from "@/features/video/ui/RelatedVideosSection";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

type Props = {
  params: Promise<{ documentId: string }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { documentId } = await params;
  const locale = await getAppLocale();

  try {
    const response = await fetchVideoByDocumentId({
      locale,
      documentId,
      populate: ["coverImage", "videos"],
    });

    const data = response?.data as VideoPlaylist;

    if (!data) {
      return { title: "Không tìm thấy pháp thoại" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description:
        data.description || "Danh sách pháp thoại tại Ni Viện Viên Không",
      keywords: ["Pháp thoại", "Ni Viện Viên Không", `${data.title}`],
      openGraph: {
        title: data.title,
        description: data.description,
        url: `/library/video/${data.documentId}`,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: data.title,
              },
            ]
          : ["/placeholder.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description:
          data.description || "Danh sách pháp thoại tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : ["/placeholder.png"],
      },
      alternates: {
        canonical: `/library/video/${data.documentId}`,
      },
    };
  } catch {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function VideoPage({ params }: Props) {
  const locale = await getAppLocale();
  const { documentId } = await params;

  let response;
  try {
    response = await fetchVideoByDocumentId({
      locale,
      documentId,
      populate: ["coverImage", "videos"],
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

  const data = response.data as VideoPlaylist;
  const latestResponse = await fetchLatestVideoPlaylists(locale, 5);
  const latestVideos = Array.isArray(latestResponse.data)
    ? latestResponse.data
    : latestResponse.data
      ? [latestResponse.data]
      : [];
  const relatedVideos = mergeRelatedItems<VideoPlaylist>({
    manualItems: [],
    latestItems: latestVideos,
    currentDocumentId: data.documentId,
    limit: 5,
  });
  return (
    <DetailArticleLayout
      locale={locale}
      breadcrumbItems={[
        { label: locale === "vi" ? "Thư viện" : "Library", href: "/library" },
        {
          label: locale === "vi" ? "Pháp thoại" : "Dharma Talks",
          href: "/library/video",
        },
        { label: data.title },
      ]}
      header={{
        label: locale === "vi" ? "Pháp thoại" : "Video",
        title: data.title,
        meta: data.publishedAt ? (
          <DateTimeDisplay
            dateString={data.publishedAt}
            locale={locale}
            includeTime={false}
          />
        ) : null,
        imageUrl: getImageUrl(data.coverImage) || "/placeholder.png",
        imageAlt: data.title || "Video cover image",
      }}
      content={
        data.description ? (
          <p className="text-left leading-7 text-muted-foreground">
            {data.description}
          </p>
        ) : null
      }
      share={{
        title: data.title,
        url: `/library/video/${data.documentId}`,
      }}
      supplementary={
        <DetailVideoAccordion
          locale={locale}
          items={data.videos.map((video, index) => ({
            id: video.id,
            title: video.title,
            videoLink: video.videoLink || "",
            indexLabel: String(index + 1).padStart(2, "0"),
            eyebrow: `${locale === "vi" ? "Pháp thoại" : "Dharma Talk"} ${String(index + 1).padStart(2, "0")}`,
          }))}
        />
      }
      sidebar={<RelatedVideosSection videos={relatedVideos} locale={locale} />}
    />
  );
}
