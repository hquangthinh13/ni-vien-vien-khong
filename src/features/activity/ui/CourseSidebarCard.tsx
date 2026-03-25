import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/features/activity/model/activity.types";
import { getImageUrl } from "@/shared/lib/api";
import { formatFriendlyDate } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
interface CourseSidebarCardProps {
  course: Activity;
  locale?: Locale;
}

const CourseSidebarCard = async ({
  course,
  locale,
}: CourseSidebarCardProps) => {
  const coverImageUrl = course.coverImage
    ? getImageUrl(course.coverImage, "thumbnail")
    : null;

  const startDate = course.activityStartDate
    ? formatFriendlyDate(course.activityStartDate, locale as string, false)
    : locale === "vi"
      ? "Ngày chưa xác định"
      : "Date not specified";

  return (
    <Link
      href={`/activity/${course.slug}-${course.documentId}`}
      className="flex gap-2 group w-full border-b border-border not-last:pb-2 last:border-0 transition-all"
    >
      <div className="group relative w-24 sm:w-32 aspect-video shrink-0 overflow-hidden rounded-md bg-muted">
        {" "}
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
        <span className="text-xs uppercase font-mono text-muted-foreground tracking-tight">
          {startDate}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-left text-sm font-bold text-foreground line-clamp-3 leading-snug group-hover:text-primary transition-colors">
              {course.activityName || "Untitled Course"}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-64">
            {course.activityName || "Untitled Course"}
          </TooltipContent>
        </Tooltip>
      </div>
    </Link>
  );
};

export default CourseSidebarCard;
