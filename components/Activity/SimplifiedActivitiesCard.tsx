import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "./Activity.type";
import { Locale } from "next-intl";
import { extractFirstParagraph, formatFriendlyDate } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";
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
  const { documentId, title, coverImage, content, publishedAt } = activity;
  // console.log("Rendering SimplifiedNewsCard for activity:", activity);
  if (isFirst === false && variant === "bottom") {
    return (
      <Link href={`/activity/${documentId}`} className="flex flex-col">
        <div className="flex gap-4 items-baseline group">
          <p className="text-muted-foreground select-none" aria-hidden="true">
            •
          </p>

          <h3 className="text-md line-clamp-4 font-bold leading-snug group-hover:text-primary cursor-pointer">
            {title}
          </h3>
        </div>
        <div className="flex gap-4 items-baseline group">
          <p className="opacity-0 select-none" aria-hidden="true">
            •
          </p>

          <p className={`line-clamp-3 text-sm text-secondary-foreground`}>
            {extractFirstParagraph(content)}
          </p>
        </div>
      </Link>
    );
  }
  // TOP ROW:
  return (
    <Link href={`/activity/${documentId}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {isFirst && coverImage && variant === "top" && (
          <div className="relative aspect-video w-[260px] shrink-0 overflow-hidden self-start">
            {(() => {
              const imageUrl = getImageUrl(coverImage);
              return imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : null;
            })()}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
          <h3
            className={`text-md font-bold leading-snug hover:text-primary cursor-pointer mb-2`}
          >
            {title}
          </h3>
          <p
            className={` ${!isFirst ? "line-clamp-2" : " line-clamp-2"} text-sm text-secondary-foreground`}
          >
            {extractFirstParagraph(content)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SimplifiedNewsCard;
