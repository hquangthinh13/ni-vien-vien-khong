import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/features/activity/model/activity.types";
import { getImageUrl } from "@/shared/lib/api";
import { formatFriendlyDate } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

interface CourseSidebarCardProps {
  course: Activity;
}

const CourseSidebarCard = async ({
  course,
  locale,
}: CourseSidebarCardProps & { locale: Locale }) => {
  const coverImageUrl = course.coverImage
    ? getImageUrl(course.coverImage, "thumbnail")
    : null;

  const startDate = course.activityStartDate
    ? formatFriendlyDate(course.activityStartDate, locale, false)
    : "Chưa cập nhật";

  const endDate = course.activityEndDate
    ? formatFriendlyDate(course.activityEndDate, locale, false)
    : "Chưa cập nhật";

  return (
    <Link
      href={`/activity/${course.slug}-${course.documentId}`}
      className="group block w-full border-b border-border not-last:pb-2 last:border-0 transition-all"
    >
      <div className="flex gap-2">
        <div className="group relative h-18 w-auto aspect-video shrink-0 overflow-hidden rounded-md bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={course.activityName || "Course cover image"}
              fill
              className="group-hover:scale-105 transition-transform duration-300 object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
            />
          )}
        </div>
        <div className="flex flex-col justify-start space-y-1 min-w-0">
          <div className="flex items-center">
            <span className="text-xs font-mono text-muted-foreground tracking-tight">
              {startDate} {endDate ? `- ${endDate}` : ""}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground line-clamp-3 leading-snug group-hover:text-primary transition-colors">
            {course.activityName || "Untitled Course"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseSidebarCard;
