import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/features/activity/model/activity.types";
import { getImageUrl } from "@/shared/lib/api";
import { extractPreviewContent, formatFriendlyDate } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";

interface CourseSidebarCardProps {
  course: Activity;
  locale: Locale;
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
      className="group flex flex-col w-full gap-2 border-b border-border not-last:pb-2 last:border-0 transition-all"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {course.activityName || "Untitled Course"}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-64">
          {course.activityName || "Untitled Course"}
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-2">
        <div className="group relative h-[63px] w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:h-[81px] sm:w-36">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={course.activityName || "Course cover image"}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-start space-y-1">
          <p className="mb-1 line-clamp-3 font-mono text-xs leading-relaxed text-secondary-foreground">
            {extractPreviewContent(course.content)}
          </p>{" "}
          <span className="text-xs font-mono tracking-tight text-muted-foreground">
            {startDate}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseSidebarCard;
