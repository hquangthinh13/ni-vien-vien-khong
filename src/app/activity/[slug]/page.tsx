import React from "react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
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
import { Metadata } from "next";
import ActivityRegistrationDialog from "@/features/courseRegistration/ui/CourseregistrationDialog";
import HighlightSection from "@/features/activity/ui/HighlightSection";
import DetailArticleLayout from "@/shared/layout/DetailArticleLayout";
import DetailVideoAccordion from "@/shared/layout/DetailVideoAccordion";
import { mergeRelatedItems } from "@/shared/lib/related-content";
import { categoryMap } from "@/types/categories";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
import { getActivityBreadcrumbItems } from "@/features/activity/lib/activity-breadcrumb";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
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
    <DetailArticleLayout
      locale={locale}
      breadcrumbItems={getActivityBreadcrumbItems({
        activity: data,
        locale,
      })}
      header={{
        label: displayCategory,
        title: data.activityName,
        meta: data.activityStartDate ? (
          <DateTimeDisplay
            dateString={data.activityStartDate}
            locale={locale}
            includeTime={false}
          />
        ) : null,
        imageUrl:
          getImageUrl(data.coverImage, "original") || "/placeholder.png",
        imageAlt: data.activityName || "Activity cover image",
      }}
      content={
        data.content ? <RichTextRenderer content={data.content} /> : null
      }
      share={{ title: data.activityName, url: activityUrl }}
      supplementary={
        sortedVideos.length > 0 ? (
          <DetailVideoAccordion
            locale={locale}
            title="Video"
            emptyMessage={
              locale === "vi"
                ? "Vui lòng quay lại sau."
                : "Please check back later."
            }
            items={sortedVideos.map((video, index) => {
              const displayDay = video.haveOrdinalDate
                ? (video.day ?? index + 1)
                : index + 1;

              return {
                id: video.id,
                title: video.title,
                videoLink: video.videoLink,
                indexLabel: String(displayDay).padStart(2, "0"),
                eyebrow:
                  locale === "vi"
                    ? "Video khóa tu"
                    : "Video of the retreat",
              };
            })}
          />
        ) : null
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
