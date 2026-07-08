import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/features/activity/model/activity.types";
import { getImageUrl } from "@/shared/lib/api";
import { extractPreviewContent } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import { cn } from "@/shared/lib/utils";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
interface CourseSidebarCardProps {
  course: Activity;
  locale: Locale;
  hasImage?: boolean;
  shortenContent?: boolean;
}

const CourseSidebarCard = async ({
  course,
  locale,
  hasImage = true,
  shortenContent = true,
}: CourseSidebarCardProps) => {
  const coverImageUrl = course.coverImage
    ? getImageUrl(course.coverImage, "thumbnail")
    : null;

  return (
    <Link
      href={`/activity/${course.slug}-${course.documentId}`}
      className="group flex flex-col w-full gap-2 border-b border-border not-last:pb-2 last:border-0 transition-all"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary",
              shortenContent && "line-clamp-1",
            )}
          >
            {course.activityName || "Untitled Course"}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-64">
          {course.activityName || "Untitled Course"}
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-2">
        {hasImage && (
          <div className="group relative h-15.75 w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:h-20.25 sm:w-36">
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
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-start space-y-1">
          {!shortenContent && (
            <p
              className={cn(
                "mb-1 line-clamp-3 font-mono text-xs leading-relaxed text-secondary-foreground",
              )}
            >
              {extractPreviewContent(course.content)}
            </p>
          )}
          <DateTimeDisplay
            dateString={course.activityStartDate}
            locale={locale}
            includeTime={false}
            emptyFallback={
              locale === "vi" ? "Ngày chưa xác định" : "Date not specified"
            }
          />
        </div>
      </div>
    </Link>
  );
};

export default CourseSidebarCard;
