import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { getCategoryLabel } from "@/types/categories";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface HomeCompactActivityCardProps {
  activity: Activity;
  locale: Locale;
  showDivider?: boolean;
}

export default function HomeCompactActivityCard({
  activity,
  locale,
  showDivider = false,
}: HomeCompactActivityCardProps) {
  const imageUrl = getImageUrl(activity.coverImage, "medium");
  const category = getCategoryLabel(activity.activityCategory, locale);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className={`group grid grid-cols-[6.5rem_1fr] gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:grid-cols-[8rem_1fr] lg:grid-cols-[6.75rem_1fr] ${
        showDivider ? "border-b border-border/70" : ""
      }`}
    >
      <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.activityName || "Activity image"}
            fill
            sizes="144px"
            className="scale-[1.01] object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR_DATA_URL}
          />
        ) : (
          <div className="absolute inset-0 bg-[#eee5d8]" />
        )}
      </div>

      <div className="min-w-0 self-center">
        <div className="mb-1 flex min-w-0 items-center gap-2">
          <DateTimeDisplay
            dateString={activity.publishedAt}
            locale={locale}
            includeTime={false}
            className="truncate md:text-[11px]"
          />
          {category ? (
            <>
              <span className="font-mono text-[11px] text-muted-foreground">
                |
              </span>
              <span className="truncate font-mono text-[11px] font-semibold text-primary">
                {category}
              </span>
            </>
          ) : null}
        </div>

        <h3 className="line-clamp-3 break-words text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:line-clamp-2 md:text-lg">
          {activity.activityName}
        </h3>
      </div>
    </Link>
  );
}
