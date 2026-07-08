import React from "react";
import { PlayCircle } from "lucide-react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { getDocumentIdFromSlug, getVideoId } from "@/shared/lib/utils";
import {
  Activity,
  CourseContent,
} from "@/features/activity/model/activity.types";
import { getAppLocale } from "@/shared/lib/i18n";
import {
  fetchActivityByDocumentIdWithCourseContent,
  fetchLatestActivities,
  isActive,
} from "@/features/activity/api/activity.api";
import { getImageUrl } from "@/shared/lib/api";
import RelatedActivitiesSection from "@/features/activity/ui/RelatedActivitiesSection";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import ActivityRegistrationDialog from "@/features/courseRegistration/ui/CourseregistrationDialog";
import HighlightSection from "@/features/activity/ui/HighlightSection";
import DetailPageShell from "@/shared/layout/DetailPageShell";
import DetailHeader from "@/shared/layout/DetailHeader";
import DetailDivider from "@/shared/layout/DetailDivider";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { categoryMap } from "@/types/categories";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
import ActivityShareActions from "@/features/activity/ui/ActivityShareActions";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import { getActivityBreadcrumbItems } from "@/features/activity/lib/activity-breadcrumb";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const locale = await getAppLocale();

  try {
    const response = await fetchActivityByDocumentIdWithCourseContent({
      locale,
      documentId,
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
  const locale = await getAppLocale();
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  let response;
  try {
    response =
      await fetchActivityByDocumentIdWithCourseContent({
        locale,
        documentId,
        populate: [
          "coverImage",
          "relatedActivities",
          "relatedActivities.coverImage",
        ],
        // Keep the registration button's open/close state near-real-time.
        revalidate: 60,
      });
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }

  const data = response?.data as Activity;
  if (!data) notFound();

  const latestResponse = await fetchLatestActivities(locale, 5);
  const latestActivities = Array.isArray(latestResponse.data)
    ? latestResponse.data
    : latestResponse.data
      ? [latestResponse.data]
      : [];
  const mergedRelatedActivities = mergeRelatedItems<Activity>({
    manualItems: data.relatedActivities || [],
    latestItems: latestActivities,
    currentDocumentId: data.documentId,
    limit: 5,
  });

  const active = isActive(data);

  const courseContent = data?.courseContent as CourseContent;
  const videoList = courseContent?.videoSection || [];
  const sortedVideos = [...videoList].sort(
    (a, b) => (a.day ?? 0) - (b.day ?? 0),
  );

  const rawCategoryKey =
    data.activityCategory === "Khóa Tu"
      ? courseContent?.courseCategory || "Khóa Tu"
      : data.activityCategory;

  const displayCategory = rawCategoryKey
    ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
    : "";
  const activityUrl = `/activity/${data.slug}-${data.documentId}`;

  return (
    <DetailPageShell
      main={
        <div className="w-full max-w-none text-justify leading-relaxed">
          <AppBreadcrumb
            locale={locale}
            items={getActivityBreadcrumbItems({
              activity: data,
              locale,
            })}
            className="mb-6"
          />
          <MotionWrapper>
            <DetailHeader
              label={displayCategory}
              title={data.activityName}
              meta={
                data.activityStartDate && data.activityEndDate ? (
                  <DateTimeDisplay
                    dateString={data.activityStartDate}
                    locale={locale}
                  />
                ) : null
              }
              imageUrl={
                getImageUrl(data.coverImage, "original") || "/placeholder.png"
              }
              imageAlt={data.activityName || "Course cover image"}
            />

            <DetailDivider />
          </MotionWrapper>

          {/* <MotionWrapper> */}
          <div className="w-full space-y-6">
            {data.content ? (
              <RichTextRenderer content={data.content || []} />
            ) : null}
              <ActivityShareActions
            title={data.activityName}
            url={activityUrl}
            locale={locale}
          />
          </div>
         
          {/* </MotionWrapper> */}

          {/* <MotionWrapper> */}
          {courseContent?.videoSection &&
          courseContent.videoSection.length > 0 ? (
            <section className="mt-6 w-full space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
                  <PlayCircle size={20} className="text-primary" />
                  Video
                </span>
                <span className="text-xs font-medium font-mono uppercase tracking-widest text-muted-foreground">
                  {courseContent.videoSection.length} video
                </span>
              </div>

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
                      className="overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-all duration-300"
                    >
                      <AccordionTrigger className="group items-center border-none py-4 hover:no-underline">
                        <div className="flex w-full items-center gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            {formattedDay}
                          </div>

                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-primary">
                              {locale === "vi"
                                ? "Video Khóa Tu"
                                : "Video of the Course"}
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
          ) : null}
          {/* </MotionWrapper> */}
        </div>
      }
      sidebar={
        <>
          <ActivityRegistrationDialog
            slug={slug}
            locale={locale}
            active={active}
            registrationLimit={data.registrationLimit}
            formOpened={data.formOpened}
          />

          {courseContent?.highlightedImages ? (
            <HighlightSection
              locale={locale}
              images={courseContent.highlightedImages || []}
            />
          ) : null}

          <RelatedActivitiesSection
            locale={locale}
            activities={mergedRelatedActivities}
          />
        </>
      }
    />
  );
}
