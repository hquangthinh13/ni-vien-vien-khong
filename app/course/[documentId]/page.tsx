import React from "react";
import Image from "next/image";
import HighlightSection from "@/components/Course/HighlightSection";
import {
  CalendarDays,
  PlayCircle,
  LayoutGrid,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import RichTextRenderer from "@/components/shared/RichTextRenderer";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import lineOrnament from "@/public/ornament-01.svg";
import { getVideoId, formatShortDate } from "@/lib/utils";
import { Course } from "@/components/Course/Course.type";
import { getLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import { fetchCourseByDocumentId } from "@/components/Course/Course.service";
import { getImageUrl } from "@/lib/api";
import CourseRegistrationSection from "@/components/CourseRegistration/CourseRegistrationSection";
import { Button } from "@/components/ui/button";
export default async function CoursePage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { documentId } = await params;
  const response = await fetchCourseByDocumentId({
    locale,
    documentId: documentId,
    populate: "*",
  });

  if (!response || !response.data) return null;

  const data = response.data as Course;

  const sortedVideos = data.videoSection?.length
    ? [...data.videoSection].sort((a, b) => (a.day || 0) - (b.day || 0))
    : [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7 max-w-none text-justify leading-relaxed">
          <header className="flex flex-col items-start mb-6 space-y-2">
            <div className="flex items-start gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>{data.category}</span>
            </div>
            <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
              {data.courseName}
            </h1>
            {data.courseStartDate && data.courseEndDate && (
              <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                <CalendarDays size={18} className="text-primary" />
                <span>
                  {formatShortDate(data.courseStartDate, locale)} —{" "}
                  {formatShortDate(data.courseEndDate, locale)}
                </span>
              </div>
            )}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Image
                src={getImageUrl(data.coverImage) || "/placeholder.jpg"}
                alt={data.courseName}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </header>
          <div className="opacity-80 flex w-full justify-center my-12">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
          {data.courseContent && (
            <RichTextRenderer content={data.courseContent || []} />
          )}{" "}
          <section className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <PlayCircle size={20} className="text-primary" /> Video
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {sortedVideos.map((video, index) => {
                const videoId = getVideoId(video.videoLink);
                const displayDay = video.haveOrdinalDate
                  ? (video.day ?? index + 1)
                  : index + 1;
                const formattedDay =
                  displayDay < 10 ? `0${displayDay}` : displayDay;
                return (
                  <AccordionItem
                    key={video.id}
                    value={video.title || `video-${video.id}`}
                    className="border rounded-xl px-2 bg-card overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <AccordionTrigger className="hover:no-underline py-5 group border-none items-center">
                      <div className="flex items-center gap-4 w-full">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {formattedDay}
                        </div>

                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                            Video Khóa Tu
                          </span>
                          <span className="text-sm md:text-base font-bold text-left line-clamp-1">
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
        </div>

        <aside className="lg:col-span-3 space-y-6">
          <HighlightSection images={data.highlightedImages || []} />
          <CourseRegistrationSection />
        </aside>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex w-full px-4 py-10 mx-auto max-w-6xl">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* LEFT COLUMN — 7/10 */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Header block */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-1/3" />

            {/* Banner */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Content block */}
          <div className="space-y-6 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />

            {/* Mid image */}
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>

        {/* RIGHT COLUMN — 3/10 */}
        <aside className="lg:col-span-3 flex flex-col gap-8">
          {/* Gallery block */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />

            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
