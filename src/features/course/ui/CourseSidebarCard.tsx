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
    ? getImageUrl(course.coverImage)
    : null;

  const startDate = course.activityStartDate
    ? formatFriendlyDate(course.activityStartDate, locale, false)
    : "Chưa cập nhật";

  const endDate = course.activityEndDate
    ? formatFriendlyDate(course.activityEndDate, locale, false)
    : "Chưa cập nhật";

  return (
    <Link
      href={`/course/${course.documentId}`}
      className="group block w-full border-b border-border/50 pb-2 last:border-0 last:pb-0 transition-all"
    >
      <div className="flex gap-3">
        <div className="flex relative aspect-video md:aspect-4/3 w-36 sm:w-32 shrink-0 overflow-hidden rounded-md bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={course.activityName || "Course cover image"}
              fill
              sizes="(max-width: 768px) 160px, 128px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-col justify-start space-y-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground line-clamp-4 leading-snug group-hover:text-primary transition-colors">
            {course.activityName || "Untitled Course"}
          </h4>

          <div className="flex items-center">
            <span className="text-xs font-medium text-muted-foreground tracking-tight">
              {startDate} - {endDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseSidebarCard;
