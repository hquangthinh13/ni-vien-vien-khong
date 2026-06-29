import Image from "next/image";
import Link from "next/link";
import { extractPreviewContent } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import type { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
import { categoryMap } from "@/types/categories";
import { getStatusLabel } from "../api/activity.api";

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
  const status = getStatusLabel(activity, locale);

  const imageUrl = getImageUrl(coverImage, "medium");
  const cardClassName =
    variant === "hero" ? "group block" : "group flex items-start gap-2 ";
  const rawCategoryKey =
    activity.activityCategory === "Khóa Tu"
      ? activity.courseContent?.courseCategory || "Khóa Tu"
      : activity.activityCategory;

  const displayCategory = rawCategoryKey
    ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
    : "";
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
              <span className="line-clamp-3 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {activityName || "Untitled Activity"}
              </span>
              <p className="line-clamp-2 text-sm text-secondary-foreground/60 font-sans leading-loose my-2">
                {extractPreviewContent(content)}
              </p>

              <div className="flex gap-2 items-center">
                <DateTimeDisplay
                  dateString={displayCategory}
                  locale={locale}
                  className="text-primary font-semibold"
                />
                {status !== "Đã kết thúc" && status !== "Completed" && (
                  <>
                    <DateTimeDisplay
                      dateString="|"
                      locale={locale}
                      className=""
                    />
                    <DateTimeDisplay
                      dateString={status}
                      locale={locale}
                      className="text-secondary-foreground font-semibold"
                    />
                  </>
                )}
                <DateTimeDisplay dateString="|" locale={locale} className="" />
                <DateTimeDisplay
                  dateString={
                    publishedAt && !isCourse ? publishedAt : activityStartDate
                  }
                  locale={locale}
                  includeTime={Boolean(publishedAt && !isCourse)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-w-0 flex-col gap-1">
            <span className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
              {activityName || "Untitled Activity"}
            </span>

            <div className="flex items-center gap-2">
              <div className="relative h-20 w-auto aspect-video shrink-0 overflow-hidden rounded-md bg-muted sm:h-24">
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
                <p className="line-clamp-2 text-sm text-secondary-foreground/60 font-sans leading-loose my-2">
                  {extractPreviewContent(content)}
                </p>{" "}
                <div className="flex gap-2 items-center">
                  <DateTimeDisplay
                    dateString={displayCategory}
                    locale={locale}
                    className="text-primary font-semibold"
                  />

                  <DateTimeDisplay
                    dateString="|"
                    locale={locale}
                    className=""
                  />
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
          </div>
        )}
      </Link>
    </>
  );
}
