import Image from "next/image";
import Link from "next/link";
import { extractPreviewContent, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import type { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";
import { categoryMap } from "@/types/categories";
import ActivityVibrantBadge from "./ActivityVibrantBadge";

interface MobileCardProps {
  activity: Activity;
  locale: Locale;
  isCourse?: boolean;
}
export default async function MobileActivitiesCard({
  activity,
  locale,
  isCourse = false,
}: MobileCardProps) {
  const {
    slug,
    documentId,
    activityName,
    coverImage,
    content,
    publishedAt,
    activityStartDate,
  } = activity;
  const imageUrl = getImageUrl(coverImage, "medium");
  const rawCategoryKey =
    activity.activityCategory === "Khóa Tu"
      ? activity.courseContent?.courseCategory || "Khóa Tu"
      : activity.activityCategory;

  const displayCategory = rawCategoryKey
    ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
    : "";

  return (
    <Link
      href={`/activity/${slug}-${documentId}`}
      className="flex gap-2 not-first:pt-2 not-last:pb-2 border-b last:border-0 items-start"
    >
      <div className="group relative h-24 w-auto aspect-video shrink-0 overflow-hidden rounded-md bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={activityName || "Activity image"}
            fill
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="uppercase text-xs text-muted-foreground font-mono">
          {publishedAt && !isCourse
            ? formatFriendlyDate(publishedAt, locale, true)
            : formatFriendlyDate(activityStartDate, locale, false)}
        </span>
        <span className="text-sm font-bold leading-tight hover:text-primary line-clamp-2">
          {activityName || "Untitled Activity"}
        </span>
        <p className="line-clamp-3 font-mono text-xs text-secondary-foreground mb-2">
          {extractPreviewContent(content)}
        </p>
        {/* <ActivityVibrantBadge
          displayCategory={displayCategory}
          imageUrl={imageUrl}
        /> */}
      </div>
    </Link>
  );
}
