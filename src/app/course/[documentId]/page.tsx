import React from "react";
import Image from "next/image";
import HighlightSection from "@/features/course/ui/HighlightSection";
import {
  CalendarDays,
  CirclePlus,
  MessageCircleQuestionMark,
  PlayCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import lineOrnament from "@/public/ornament-01.svg";
import { getVideoId, formatShortDate } from "@/shared/lib/utils";
import {
  Activity,
  CourseContent,
} from "@/features/activity/model/activity.types";
import { getLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import { fetchActivityByDocumentIdWithRegistrationFormAndCourseContent } from "@/features/activity/api/activity.api";
import { getImageUrl } from "@/shared/lib/api";
import DynamicActivityRegistrationForm from "@/features/courseRegistration/ui/DynamicActivityRegistrationForm";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { documentId } = await params;
  const response =
    await fetchActivityByDocumentIdWithRegistrationFormAndCourseContent({
      locale,
      documentId: documentId,
      populate: "coverImage",
    });
  console.log("Fetched activity for documentId:", documentId, response);
  if (!response || !response.data) return null;

  const data = response.data as Activity;
  const courseContent = data.courseContent as CourseContent;
  const sortedVideos = courseContent.videoSection?.length
    ? [...courseContent.videoSection].sort(
        (a, b) => (a.day || 0) - (b.day || 0),
      )
    : [];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {" "}
        <div className="lg:col-span-7 w-full max-w-none text-justify leading-relaxed">
          <header className="flex flex-col w-full items-start mb-6 space-y-2">
            <div className="flex items-start gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>{courseContent.courseCategory}</span>
            </div>
            <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
              {data.activityName}
            </h1>
            {data.activityStartDate && data.activityEndDate && (
              <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                <CalendarDays size={18} className="text-primary" />
                <span>
                  {formatShortDate(data.activityStartDate, locale)} —{" "}
                  {formatShortDate(data.activityEndDate, locale)}
                </span>
              </div>
            )}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Image
                src={getImageUrl(data.coverImage) || "/placeholder.jpg"}
                alt={data.activityName || "Course cover image"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </header>
          <div className="opacity-80 flex w-full justify-center my-12">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
          <div className="w-full">
            {data.content && <RichTextRenderer content={data.content || []} />}
          </div>{" "}
          {courseContent.videoSection?.length && (
            <section className="w-full mt-6 space-y-4">
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
                      className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm transition-all duration-300"
                    >
                      <AccordionTrigger className="hover:no-underline py-4 group border-none items-center">
                        <div className="flex items-center gap-4 w-full">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            {formattedDay}
                          </div>

                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                              Video Khóa Tu
                            </span>
                            <span className="text-sm  font-bold text-left line-clamp-1">
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
        <aside className="lg:col-span-3 w-full space-y-6">
          {courseContent.highlightedImages && (
            <HighlightSection images={courseContent.highlightedImages || []} />
          )}
          {/* <CourseRegistrationSection /> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="default"
                className="cursor-pointer w-full uppercase tracking-wider"
              >
                {" "}
                <CirclePlus />
                Đăng ký tham gia
              </Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby="Registration form"
              className="max-h-[90vh] md:min-w-2xl lg:min-w-3xl overflow-y-auto"
            >
              <DialogTitle>Đăng ký tham gia</DialogTitle>
              <DynamicActivityRegistrationForm
                locale={locale}
                documentId={documentId}
              />
            </DialogContent>
          </Dialog>
        </aside>
      </div>
    </div>
  );
}
