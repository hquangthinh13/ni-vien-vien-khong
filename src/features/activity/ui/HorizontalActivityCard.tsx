import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { extractFirstParagraph, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { getStatusLabel } from "../api/activity.api";
import { Badge } from "@/shared/ui/badge";

interface HorizontalActivityCardProps {
  activity: Activity;
  locale: Locale;
}

export const HorizontalActivityCard = ({
  activity,
  locale,
}: HorizontalActivityCardProps) => {
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

  const imageUrl = coverImage ? getImageUrl(coverImage, "large") : null;

  return (
    <Link
      href={`/activity/${slug}-${documentId}`}
      className="group block not-last:border-b not-last:pb-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none w-full h-55 sm:h-auto sm:w-55 sm:min-w-55">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={activityName || "Activity image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-md font-bold leading-snug cursor-pointer group-hover:text-primary line-clamp-2">
              {activityName}
            </span>

            <div className="flex flex-wrap gap-2 items-center mb-1">
              <Badge variant="outline" className="font-mono">
                {activityCategory !== "Khóa Tu"
                  ? activityCategory
                  : activity.courseContent?.courseCategory}
              </Badge>
              <Badge variant="outline" className="font-mono">
                {status}
              </Badge>
            </div>

            <p className="line-clamp-3 text-sm text-secondary-foreground/80 font-mono">
              {extractFirstParagraph(content)}
            </p>
          </div>

          <span className="mt-3 text-xs text-muted-foreground font-mono uppercase tracking-wide">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};
