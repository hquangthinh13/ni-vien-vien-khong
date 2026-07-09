import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import { cn, extractPreviewContent } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { getStatusLabel } from "../api/activity.api";
import { categoryMap } from "@/types/categories";
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
        <DateTimeDisplay dateString={publishedAt} locale={locale} />
        <p
          className={`line-clamp-2 text-sm text-secondary-foreground font-mono`}
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
              className={`text-lg line-clamp-2 font-bold leading-snug hover:text-primary cursor-pointer`}
            >
              {activityName}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-64">
            {activityName}
          </TooltipContent>
        </Tooltip>{" "}
        <p
          className={`line-clamp-2 text-sm text-secondary-foreground/60 font-sans leading-loose my-2`}
        >
          {extractPreviewContent(content)}
        </p>{" "}
        <div className="flex gap-2 items-center">
          <DateTimeDisplay
            dateString={displayCategory}
            locale={locale}
            className="text-primary font-semibold"
          />
          {status !== "Đã kết thúc" && status !== "Completed" && (
            <>
              <DateTimeDisplay dateString="|" locale={locale} className="" />
              <DateTimeDisplay
                dateString={status}
                locale={locale}
                className="text-secondary-foreground font-semibold"
              />
            </>
          )}
          <DateTimeDisplay dateString="|" locale={locale} className="" />
          <DateTimeDisplay
            dateString={publishedAt}
            locale={locale}
            className=""
          />
        </div>
      </div>{" "}
    </Link>
  );
};

export default SimplifiedNewsCard;
