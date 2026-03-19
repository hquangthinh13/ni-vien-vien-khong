import React from "react";
import Image from "next/image";
import { CalendarDays, PlayCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

import lineOrnament from "@/public/ornament-01.svg";
import { getVideoId, formatShortDate } from "@/shared/lib/utils";
import { getLocale } from "next-intl/server";
import { Locale } from "@/types/locale";

import type { VideoPlaylist } from "@/features/video/model/video.types";
import { fetchVideoByDocumentId } from "@/features/video/api/video.api";

import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

import { getYouTubeThumbnail } from "@/shared/lib/utils";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
type Props = {
  params: Promise<{ documentId: string }>;
};
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { documentId } = await params;
  const locale = (await getLocale()) as Locale;

  try {
    const response = await fetchVideoByDocumentId({
      locale,
      documentId: documentId,
      populate: ["coverImage", "videos"],
    });

    const data = response?.data as VideoPlaylist;

    if (!data) {
      return { title: "Không tìm thấy pháp thoại" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");
    // console.log("ogImage", ogImage);
    return {
      title: data.title,
      description:
        data.description || "Danh sach pháp thoại tại Ni Viện Viên Không",
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
          data.description || "Danh sach pháp thoại tại Ni Viện Viên Không",
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

export default async function ActivityPage({ params }: Props) {
  const locale = (await getLocale()) as Locale;
  const { documentId } = await params;
  let response;
  try {
    response = await fetchVideoByDocumentId({
      locale,
      documentId: documentId,
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
  console.log("Video data:", data);
  const numberOfVideos = data.videos.length;

  let thumbnailUrl;
  if (numberOfVideos > 0 && data.videos[0].videoLink) {
    const firstVideoUrl = data.videos[0].videoLink;
    thumbnailUrl = getYouTubeThumbnail(firstVideoUrl);
  }

  return (
    <div className="page-container">
      <div className="w-full flex flex-col gap-6 items-center">
        {/* <div className="lg:col-span-7 w-full max-w-none text-justify leading-relaxed"> */}
        <header className="flex flex-col w-full items-center mb-6 space-y-2">
          <div className="page-label items-center">
            <span>Pháp thoại</span>
          </div>

          <h1 className="text-xl md:text-4xl text-center font-bold leading-tight max-w-4xl">
            {data.title}
          </h1>

          <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
            <CalendarDays size={18} className="" />
            <span>{formatShortDate(data.publishedAt as string, locale)}</span>
          </div>

          <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl shadow-md mt-4">
            <Zoom zoomMargin={80}>
              <Image
                src={
                  getImageUrl(data.coverImage) ||
                  thumbnailUrl ||
                  "/placeholder.png"
                }
                alt={data.title || "Video cover image"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />{" "}
            </Zoom>
          </div>
        </header>
        <div className="opacity-80 flex w-full justify-center my-12">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
        {data.description && (
          <section className="w-full mx-auto mb-6">
            <h2 className="font-bold text-lg text-center uppercase tracking-wider flex justify-center items-center gap-2 mb-4">
              Mô tả
            </h2>
            <p className="text-muted-foreground leading-relaxed text-center">
              {data.description}
            </p>
          </section>
        )}
        {data.videos.length > 0 && (
          <section className="w-full mt-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                <PlayCircle size={20} className="text-primary" />
                Video
              </h3>
              {data.videos.length > 0 && (
                <span className="text-xs text-muted-foreground font-medium font-mono uppercase tracking-widest">
                  {data.videos.length} video
                </span>
              )}
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
                    className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 group border-none items-center">
                      <div className="flex items-center gap-4 w-full">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {formattedNumber}
                        </div>

                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                            Pháp thoại {formattedNumber}
                          </span>
                          <span className="text-sm font-bold text-left line-clamp-1">
                            {video.title}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-0 pb-4 px-2">
                      {videoId ? (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl bg-black group/video">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 bg-muted/20 rounded-lg border border-dashed">
                          <PlayCircle
                            className="text-muted-foreground mb-2"
                            size={32}
                          />
                          <p className="text-sm text-muted-foreground italic">
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
        )}
      </div>
      {/* </div> */}
    </div>
  );
}
