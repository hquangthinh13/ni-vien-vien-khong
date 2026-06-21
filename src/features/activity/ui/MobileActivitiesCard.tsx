import Image from "next/image";
import Link from "next/link";
import { extractPreviewContent } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import type { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface MobileCardProps {
  activity: Activity;
  locale: Locale;
  isCourse?: boolean;
  variant?: "hero" | "compact";
}

export default async function MobileActivitiesCard({
  activity,
  locale,
  isCourse = false,
  variant = "compact",
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
  const cardClassName =
    variant === "hero"
      ? "group block border-b pb-4"
      : "group flex items-start gap-2 border-b not-first:pt-2 not-last:pb-2 last:border-0";

  return (
    <>
      <Link href={`/activity/${slug}-${documentId}`} className={cardClassName}>
        {variant === "hero" ? (
          <>
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md bg-muted">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={activityName || "Activity image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={DEFAULT_BLUR_DATA_URL}
                />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <DateTimeDisplay
                dateString={
                  publishedAt && !isCourse ? publishedAt : activityStartDate
                }
                locale={locale}
                includeTime={Boolean(publishedAt && !isCourse)}
              />
              <span className="line-clamp-3 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {activityName || "Untitled Activity"}
              </span>
              <p className="line-clamp-3 font-mono text-sm leading-relaxed text-secondary-foreground">
                {extractPreviewContent(content)}
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-w-0 flex-col gap-1">
            <span className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
              {activityName || "Untitled Activity"}
            </span>

            <div className="flex items-center gap-2">
              <div className="relative h-[63px] w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:h-[81px] sm:w-36">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={activityName || "Activity image"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="mb-1 line-clamp-3 font-mono text-xs leading-relaxed text-secondary-foreground">
                  {extractPreviewContent(content)}
                </p>{" "}
                <DateTimeDisplay
                  dateString={
                    publishedAt && !isCourse ? publishedAt : activityStartDate
                  }
                  locale={locale}
                  includeTime={Boolean(publishedAt && !isCourse)}
                />
              </div>
            </div>
          </div>
        )}
      </Link>
    </>
  );
}
