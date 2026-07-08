import React from "react";
import { PlayCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

import { getVideoId } from "@/shared/lib/utils";
import { getAppLocale } from "@/shared/lib/i18n";

import type { VideoPlaylist } from "@/features/video/model/video.types";
import {
  fetchLatestVideoPlaylists,
  fetchVideoByDocumentId,
} from "@/features/video/api/video.api";
import { formatShortDate } from "@/shared/lib/utils";

import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import DetailPageShell from "@/shared/layout/DetailPageShell";
import RelatedVideosSection from "@/features/video/ui/RelatedVideosSection";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import DetailHeader from "@/shared/layout/DetailHeader";

type Props = {
  params: Promise<{ documentId: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
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
  } catch (error) {
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
    <DetailPageShell
      main={
        <div className="flex w-full flex-col gap-6 items-center">
          <DetailHeader
            label={locale === "vi" ? "Pháp thoại" : "Video"}
            title={data.title}
            meta={
              data.publishedAt ? (
                <div className="flex items-center gap-2 text-xs lg:text-sm font-sans text-muted-foreground">
                  <span>{formatShortDate(data.publishedAt, locale)}</span>
                </div>
              ) : null
            }
            imageUrl={getImageUrl(data.coverImage) || "/placeholder.png"}
            imageAlt={data.title || "Video cover image"}
          />
          {data.description ? (
            <section className="mx-auto mt-2 w-full max-w-4xl">
              <p className="text-left leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            </section>
          ) : null}

          {data.videos.length > 0 ? (
            <section className="mt-6 w-full space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
                  <PlayCircle size={20} className="text-primary" />
                  {locale === "vi" ? "pháp thoại" : "videos"}
                </span>
                <span className="text-xs font-medium font-mono uppercase tracking-widest text-muted-foreground">
                  {data.videos.length} {locale === "vi" ? "bài" : "videos"}
                </span>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {data.videos.map((video, index) => {
                  const videoId = getVideoId(video.videoLink);
                  const displayNumber = index + 1;
                  const formattedNumber =
                    displayNumber < 10 ? `0${displayNumber}` : displayNumber;

                  return (
                    <AccordionItem
                      key={video.id}
                      value={video.title || `video-${displayNumber}`}
                      className="overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-all duration-300"
                    >
                      <AccordionTrigger className="group items-center border-none py-4 hover:no-underline">
                        <div className="flex w-full items-center gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            {formattedNumber}
                          </div>

                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-primary">
                              Pháp thoại {formattedNumber}
                            </span>
                            <span className="line-clamp-1 text-left text-sm font-bold">
                              {video.title}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-2 pt-0 pb-4">
                        {videoId ? (
                          <div className="group/video relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                              className="absolute inset-0 h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-10">
                            <PlayCircle
                              className="mb-2 text-muted-foreground"
                              size={32}
                            />
                            <p className="text-sm italic text-muted-foreground">
                              Video đang được cập nhật...
                            </p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>
          ) : null}
        </div>
      }
      sidebar={<RelatedVideosSection videos={relatedVideos} locale={locale} />}
    />
  );
}
