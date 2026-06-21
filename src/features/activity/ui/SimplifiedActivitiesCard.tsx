import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import { cn, extractPreviewContent } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { getActivityStatus, getStatusLabel } from "../api/activity.api";
import { Badge } from "@/shared/ui/badge";
import { categoryMap } from "@/types/categories";
import { getActivityStatusConfig } from "@/shared/lib/activity-status.config";
import ActivityVibrantBadge from "./ActivityVibrantBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
interface NewsCardProps {
  activity: Activity;
  isFirst?: boolean;
  variant?: "top" | "bottom";
  locale: Locale;
  background?: boolean;
}
const SimplifiedNewsCard = ({
  activity,
  isFirst = false,
  variant = "bottom",
  locale = "vi",
  background = false,
}: NewsCardProps) => {
  const status = getStatusLabel(activity, locale);
  const statusKey = getActivityStatus(activity);
  const statusConfig = getActivityStatusConfig(statusKey);
  const { slug, documentId, activityName, coverImage, content, publishedAt } =
    activity;
  const rawCategoryKey =
    activity.activityCategory === "Khóa Tu"
      ? activity.courseContent?.courseCategory || "Khóa Tu"
      : activity.activityCategory;

  const displayCategory = rawCategoryKey
    ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
    : "";

  const imageUrl = getImageUrl(activity?.coverImage, "medium");

  if (isFirst === false && variant === "bottom") {
    return (
      <Link
        href={`/activity/${slug}-${documentId}`}
        className="flex flex-col gap-2"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`text-md line-clamp-2 font-bold leading-snug hover:text-primary cursor-pointer`}
            >
              {activityName}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-64">
            {activityName}
          </TooltipContent>
        </Tooltip>
        {/* <div className="flex gap-2 items-center mb-2">
          <ActivityVibrantBadge
            displayCategory={displayCategory}
            imageUrl={imageUrl}
            className="rounded-none px-2 py-1 text-[10px] uppercase"
          />
          {status !== "Đã kết thúc" && status !== "Completed" && (
            <Badge
              variant="outline"
              className={cn(
                "font-mono shadow-none text-white rounded-none px-2 py-1 text-[10px] uppercase",
                statusConfig.className,
              )}
            >
              {status}
            </Badge>
          )}
        </div> */}{" "}
        <DateTimeDisplay dateString={publishedAt} locale={locale} />
        <p
          className={`line-clamp-3 text-sm text-secondary-foreground font-mono`}
        >
          {extractPreviewContent(content)}
        </p>{" "}
      </Link>
    );
  }
  // TOP ROW:
  return (
    <Link
      href={`/activity/${slug}-${documentId}`}
      className="flex flex-col h-full"
    >
      <div
        className={cn(
          "flex flex-col gap-2",
          background ? "bg-background p-4 rounded-b-lg" : "",
        )}
      >
        {coverImage && variant === "top" && (
          <div className=" relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg mb-2">
            {(() => {
              return imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={activityName || "Activity image"}
                  fill
                  className="object-cover bg-red-500"
                  placeholder="blur"
                  blurDataURL={DEFAULT_BLUR_DATA_URL}
                />
              ) : null;
            })()}
          </div>
        )}{" "}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`text-md line-clamp-2 font-bold leading-snug hover:text-primary cursor-pointer`}
            >
              {activityName}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-64">
            {activityName}
          </TooltipContent>
        </Tooltip>{" "}
        <DateTimeDisplay
          dateString={publishedAt}
          locale={locale}
          className=""
        />
        {/* <div className="flex gap-2 items-center mb-2">
            <ActivityVibrantBadge
              displayCategory={displayCategory}
              imageUrl={imageUrl}
              className="rounded-none px-2 py-1 text-[10px] uppercase"
            />
            {status !== "Đã kết thúc" && status !== "Completed" && (
              <Badge
                variant="outline"
                className={cn(
                  "font-mono shadow-none text-white rounded-none px-2 py-1 text-[10px] uppercase",
                  statusConfig.className,
                )}
              >
                {status}
              </Badge>
            )}
          </div> */}
        <p
          className={`line-clamp-3 text-sm text-secondary-foreground font-mono`}
        >
          {extractPreviewContent(content)}
        </p>{" "}
      </div>{" "}
    </Link>
  );
};

export default SimplifiedNewsCard;
