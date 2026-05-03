import React from "react";
import Image from "next/image";
import HighlightSection from "@/features/activity/ui/HighlightSection";
import { CalendarDays, PlayCircle } from "lucide-react";
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
import {
  fetchActivityByDocumentIdWithRegistrationFormAndCourseContent,
  isActive,
} from "@/features/activity/api/activity.api";
import { getImageUrl } from "@/shared/lib/api";
import RelatedActivitiesSection from "@/features/activity/ui/RelatedActivitiesSection";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import ActivityRegistrationDialog from "@/features/courseRegistration/ui/CourseregistrationDialog";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
type Props = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const locale = (await getLocale()) as Locale;

  try {
    const response =
      await fetchActivityByDocumentIdWithRegistrationFormAndCourseContent({
        locale,
        documentId: documentId,
        populate: [
          "coverImage",
          "relatedActivities",
          "relatedActivities.coverImage",
        ],
      });

    const data = response?.data as Activity;

    if (!data) {
      return { title: "Không tìm thấy hoạt động" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");
    // console.log("ogImage", ogImage);
    return {
      title: data.activityName,
      description:
        data.activityCategory || "Thông tin hoạt động tại Ni Viện Viên Không",
      keywords: [
        "Sự kiện",
        "Tin tức",
        "Khóa tu",
        "Ni Viện Viên Không",
        `${data.activityCategory}`,
        `${data.activityName}`,
      ],
      openGraph: {
        title: data.activityName,
        description: data.activityCategory,
        url: `/activity/${data.slug}-${data.documentId}`,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: data.activityName,
              },
            ]
          : ["/open-graph.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: data.activityName,
        description:
          data.activityCategory || "Thông tin hoạt động tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : ["/open-graph.png"],
      },
      alternates: {
        canonical: `/activity/${data.slug}-${data.documentId}`,
      },
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function ActivityPage({ params }: Props) {
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  let response;
  try {
    response =
      await fetchActivityByDocumentIdWithRegistrationFormAndCourseContent({
        locale,
        documentId: documentId,
        populate: [
          "coverImage",
          "relatedActivities",
          "relatedActivities.coverImage",
        ],
      });
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }

  const data = response?.data as Activity;

  if (!data) notFound();

  const active = isActive(data);

  const courseContent = data?.courseContent as CourseContent;
  const videoList = courseContent?.videoSection || [];
  const sortedVideos = [...videoList].sort(
    (a, b) => (a.day ?? 0) - (b.day ?? 0),
  );

  return (
    <div className="page-container">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {" "}
        <div className="lg:col-span-7 w-full max-w-none text-justify leading-relaxed">
          <header className="flex flex-col w-full items-start mb-6 space-y-2">
            {courseContent?.courseCategory ? (
              <div className="page-label items-start">
                <span>{courseContent.courseCategory}</span>
              </div>
            ) : (
              <div className="page-label items-start">
                <span>{data.activityCategory}</span>
              </div>
            )}
            <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
              {data.activityName}
            </h1>
            {data.activityStartDate && data.activityEndDate && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                <CalendarDays size={18} className="" />
                <span>
                  {formatShortDate(data.activityStartDate, locale)} —{" "}
                  {formatShortDate(data.activityEndDate, locale)}
                </span>
              </div>
            )}{" "}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              {" "}
              <Zoom zoomMargin={80}>
                <Image
                  src={
                    getImageUrl(data.coverImage, "original") ||
                    "/placeholder.png"
                  }
                  alt={data.activityName || "Course cover image"}
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
          <div className="w-full">
            {data.content && <RichTextRenderer content={data.content || []} />}
          </div>{" "}
          {courseContent?.videoSection &&
            courseContent.videoSection.length > 0 && (
              <section className="w-full mt-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                    <PlayCircle size={20} className="text-primary" />
                    Video
                  </span>
                  {courseContent?.videoSection?.length > 0 && (
                    <span className="text-xs text-muted-foreground font-medium font-mono uppercase tracking-widest">
                      {courseContent.videoSection.length} video
                    </span>
                  )}
                </div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-3"
                >
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
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                                {locale === "vi"
                                  ? "Video Khóa Tu"
                                  : "Video of the Course"}
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
                                {locale === "vi"
                                  ? "Vui lòng quay lại sau"
                                  : "Please check back later"}
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
          <RelatedActivitiesSection
            locale={locale}
            activities={data.relatedActivities || []}
          />
          {courseContent?.highlightedImages && (
            <HighlightSection images={courseContent.highlightedImages || []} />
          )}

          {data.registrationForm && (
            <ActivityRegistrationDialog
              documentId={documentId}
              locale={locale}
              active={active}
              registrationLimit={data.registrationLimit}
              formOpened={data.formOpened}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
