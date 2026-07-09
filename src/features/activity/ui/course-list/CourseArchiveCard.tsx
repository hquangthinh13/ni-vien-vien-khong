import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { cn, extractPreviewContent } from "@/shared/lib/utils";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import {
  getActivityStatus,
  getStatusLabel,
} from "@/features/activity/api/activity.api";
import { getCourseCategoryLabel } from "./CourseCategoryRail";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface CourseArchiveCardProps {
  activity: Activity;
  locale: Locale;
  variant?: "featured" | "standard";
}

export default function CourseArchiveCard({
  activity,
  locale,
  variant = "standard",
}: CourseArchiveCardProps) {
  const imageUrl = getImageUrl(activity.coverImage, "medium");
  const status = getActivityStatus(activity);
  const statusLabel = getStatusLabel(activity, locale);
  const category = activity.courseContent?.courseCategory;
  const categoryLabel = category
    ? getCourseCategoryLabel(category, locale)
    : locale === "vi"
      ? "Khóa tu"
      : "Retreat";
  const excerpt = extractPreviewContent(activity.content);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
    >
      <article
        className={cn(
          "h-full",
          variant === "featured" &&
            "overflow-hidden rounded-lg border border-border/80 bg-background md:grid md:min-h-72 md:grid-cols-[1.15fr_1fr]",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            variant === "featured"
              ? "aspect-video md:aspect-auto md:min-h-full"
              : "aspect-video",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.activityName || "Course image"}
              fill
              sizes={
                variant === "featured"
                  ? "(min-width: 1024px) 45vw, 100vw"
                  : "(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
              }
              className="scale-[1.01] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          ) : (
            <div className="absolute inset-0 bg-[#eee5d8]" />
          )}
        </div>

        <div
          className={cn(
            "flex h-full flex-col",
            variant === "featured" ? "p-5 md:p-7" : "pt-4",
          )}
        >
          <div className="flex gap-2 items-center mb-2">
            <DateTimeDisplay
              dateString={categoryLabel}
              locale={locale}
              className="text-primary font-semibold md:text-xs"
            />
            {status !== "completed" && (
              <>
                <DateTimeDisplay
                  dateString="|"
                  locale={locale}
                  className="md:text-xs"
                />
                <DateTimeDisplay
                  dateString={statusLabel}
                  locale={locale}
                  className="text-secondary-foreground font-semibold md:text-xs"
                />
              </>
            )}
            <DateTimeDisplay
              dateString="|"
              locale={locale}
              className="md:text-xs"
            />
            <DateTimeDisplay
              dateString={activity.activityStartDate}
              locale={locale}
              className="md:text-xs"
            />
          </div>
          <h3
            className={cn(
              "line-clamp-2 font-bold leading-snug text-foreground transition-colors group-hover:text-primary",
              variant === "featured" ? "text-xl md:text-2xl" : "text-lg",
            )}
          >
            {activity.activityName}
          </h3>

          {excerpt ? (
            <p
              className={cn(
                "mt-2 font-sans text-xs leading-loose text-secondary-foreground/60",
                variant === "featured" ? "line-clamp-4" : "line-clamp-3",
              )}
            >
              {excerpt}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
