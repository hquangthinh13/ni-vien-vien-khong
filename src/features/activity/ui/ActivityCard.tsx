import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { extractPreviewContent, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { Badge } from "@/shared/ui/badge";
import { getStatusLabel } from "../api/activity.api";
import { categoryMap } from "@/types/categories";

interface ActivityCardProps {
  activity: Activity;
  locale: Locale;
}
const ActivityCard = ({ activity, locale }: ActivityCardProps) => {
  const { slug, documentId, activityName, coverImage, content, publishedAt } =
    activity;
  const rawCategoryKey =
    activity.activityCategory === "Khóa Tu"
      ? activity.courseContent?.courseCategory || "Khóa Tu"
      : activity.activityCategory;

  const displayCategory = rawCategoryKey
    ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
    : "";
  const status = getStatusLabel(activity, locale);

  return (
    <Link href={`/activity/${slug}-${documentId}`}>
      <div className="group flex flex-col h-full gap-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
          {(() => {
            const imageUrl = getImageUrl(coverImage, "medium");
            return imageUrl ? (
              <Image
                src={imageUrl}
                alt={activityName || "Activity image"}
                fill
                className="object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-300 ease-in-out"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />
            ) : null;
          })()}
        </div>

        <div className="flex flex-col h-full gap-2">
          <span
            className={`text-md font-bold leading-snug group-hover:text-primary cursor-pointer`}
          >
            {activityName}
          </span>
          <div className="flex gap-2 items-center mb-4">
            <Badge variant="secondary" className="font-mono">
              {displayCategory}
            </Badge>

            <Badge variant="secondary" className="font-mono">
              {status}
            </Badge>
          </div>{" "}
          <p
            className={`line-clamp-2 text-sm text-secondary-foreground font-mono`}
          >
            {extractPreviewContent(content)}
          </p>{" "}
          <span className="mt-auto text-xs text-muted-foreground font-mono uppercase">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;
