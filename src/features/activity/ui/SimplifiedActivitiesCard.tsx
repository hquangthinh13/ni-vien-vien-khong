import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { extractFirstParagraph, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { getStatusLabel } from "../api/activity.api";
import { Badge } from "@/shared/ui/badge";
interface NewsCardProps {
  activity: Activity;
  isFirst?: boolean;
  variant?: "top" | "bottom";
  locale: Locale;
}
const SimplifiedNewsCard = async ({
  activity,
  isFirst = false,
  variant = "bottom",
  locale,
}: NewsCardProps) => {
  const status = getStatusLabel(activity, locale);
  const {
    slug,
    documentId,
    activityName,
    coverImage,
    content,
    publishedAt,
    activityCategory,
  } = activity;
  if (isFirst === false && variant === "bottom") {
    return (
      <Link
        href={`/activity/${slug}-${documentId}`}
        className="flex flex-col gap-2"
      >
        <h3
          className={`text-md font-bold leading-snug hover:text-primary cursor-pointer`}
        >
          {activityName}
        </h3>
        <div className="flex gap-2 items-center mb-4">
          <Badge variant="outline" className="font-mono">
            {activityCategory !== "Khóa Tu"
              ? activityCategory
              : activity.courseContent?.courseCategory}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {status}
          </Badge>
        </div>
        <p
          className={`line-clamp-3 text-sm text-secondary-foreground/80 font-mono mt-2`}
        >
          {extractFirstParagraph(content)}
        </p>
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
          {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
        </span>
      </Link>
    );
  }
  // TOP ROW:
  return (
    <Link href={`/activity/${slug}-${documentId}`}>
      <div className="flex flex-col gap-4">
        {coverImage && variant === "top" && (
          <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
            {(() => {
              const imageUrl = getImageUrl(coverImage, "large");
              return imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={activityName || "Activity image"}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
                />
              ) : null;
            })()}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <h3
            className={`text-md font-bold leading-snug hover:text-primary cursor-pointer`}
          >
            {activityName}
          </h3>
          <div className="flex gap-2 items-center mb-4">
            <Badge variant="outline" className="font-mono">
              {activityCategory !== "Khóa Tu"
                ? activityCategory
                : activity.courseContent?.courseCategory}
            </Badge>
            <Badge variant="outline" className="font-mono">
              {status}
            </Badge>
          </div>
          <p
            className={`line-clamp-3 text-sm text-secondary-foreground/80 font-mono`}
          >
            {extractFirstParagraph(content)}
          </p>{" "}
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SimplifiedNewsCard;
