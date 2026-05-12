import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import {
  cn,
  extractPreviewContent,
  formatFriendlyDate,
} from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { Badge } from "@/shared/ui/badge";
import { getActivityStatus, getStatusLabel } from "../api/activity.api";
import { categoryMap } from "@/types/categories";
import { getActivityStatusConfig } from "@/shared/lib/activity-status.config";
import ActivityVibrantBadge from "./ActivityVibrantBadge";
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
  const imageUrl = getImageUrl(coverImage, "medium");
  const statusKey = getActivityStatus(activity);

  const statusConfig = getActivityStatusConfig(statusKey);

  return (
    <Link href={`/activity/${slug}-${documentId}`}>
      <div className="group flex flex-col h-full gap-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
          {(() => {
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
            <ActivityVibrantBadge
              displayCategory={displayCategory}
              imageUrl={imageUrl}
            />
            {status !== "Đã kết thúc" && status !== "Completed" && (
              <Badge
                variant="outline"
                className={cn(
                  "font-mono shadow-none text-white",
                  statusConfig.className,
                )}
              >
                {status}
              </Badge>
            )}
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
