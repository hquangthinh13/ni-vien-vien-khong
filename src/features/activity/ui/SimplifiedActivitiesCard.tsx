import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import { Locale } from "next-intl";
import { extractFirstParagraph, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
interface NewsCardProps {
  activity: Activity;
  isFirst?: boolean;
  variant?: "top" | "bottom";
}
import { getLocale } from "next-intl/server";
const SimplifiedNewsCard = async ({
  activity,
  isFirst = false,
  variant = "bottom",
}: NewsCardProps) => {
  const locale = (await getLocale()) as Locale;
  const { slug, documentId, activityName, coverImage, content, publishedAt } =
    activity;
  if (isFirst === false && variant === "bottom") {
    return (
      <Link
        href={`/activity/${slug}-${documentId}`}
        className="flex flex-col gap-1"
      >
        <span className="text-xs text-muted-foreground font-mono">
          {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
        </span>
        <div className="flex gap-4 items-baseline group">
          {/* <p className="text-muted-foreground select-none" aria-hidden="true">
            •
          </p> */}

          <h3 className="text-md line-clamp-4 font-bold leading-snug group-hover:text-primary cursor-pointer mb-2">
            {activityName || "Untitled Activity"}
          </h3>
        </div>
        <div className="flex gap-4 items-baseline group">
          {/* <p className="opacity-0 select-none" aria-hidden="true">
            •
          </p> */}

          <p
            className={`line-clamp-3 text-sm text-secondary-foreground/80 font-mono`}
          >
            {extractFirstParagraph(content)}
          </p>
        </div>
      </Link>
    );
  }
  // TOP ROW:
  return (
    <Link href={`/activity/${slug}-${documentId}`}>
      <div className="flex flex-col gap-4">
        {/* {isFirst &&  */}
        {coverImage && variant === "top" && (
          <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
            {(() => {
              const imageUrl = getImageUrl(coverImage);
              return imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={activityName || "Activity image"}
                  fill
                  className="object-cover"
                />
              ) : null;
            })()}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-mono">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
          <h3
            className={`text-md font-bold leading-snug hover:text-primary cursor-pointer mb-2`}
          >
            {activityName}
          </h3>
          <p
            className={`line-clamp-2 text-sm text-secondary-foreground/80 font-mono`}
          >
            {extractFirstParagraph(content)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SimplifiedNewsCard;
