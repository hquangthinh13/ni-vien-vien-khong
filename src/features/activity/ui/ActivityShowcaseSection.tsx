import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/locale";
import type { Activity } from "../model/activity.types";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import { cn, extractPreviewContent } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { Badge } from "@/shared/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { getActivityStatus, getStatusLabel } from "../api/activity.api";
import { getActivityStatusConfig } from "@/shared/lib/activity-status.config";
import { categoryMap } from "@/types/categories";
import ActivityVibrantBadge from "./ActivityVibrantBadge";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface ActivityShowcaseSectionProps {
  locale: Locale;
  activities: Activity[];
}

function getDisplayCategory(activity: Activity, locale: Locale) {
  const rawCategoryKey =
    activity.activityCategory === "Khóa Tu"
      ? activity.courseContent?.courseCategory || "Khóa Tu"
      : activity.activityCategory;

  return rawCategoryKey
    ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
    : "";
}

function ActivityShowcaseHero({
  activity,
  locale,
}: {
  activity: Activity;
  locale: Locale;
}) {
  const imageUrl = getImageUrl(activity.coverImage, "large");
  const displayCategory = getDisplayCategory(activity, locale);
  const status = getStatusLabel(activity, locale);
  const statusKey = getActivityStatus(activity);
  const statusConfig = getActivityStatusConfig(statusKey);
  const preview = extractPreviewContent(activity.content, 140);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className="group block h-full"
    >
      <article className="relative h-full overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
        <div className="relative aspect-video w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.activityName || "Activity image"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {displayCategory ? (
                <ActivityVibrantBadge
                  displayCategory={displayCategory}
                  imageUrl={imageUrl}
                  className="rounded-none px-2 py-1 text-[10px] uppercase"
                />
              ) : null}
              {statusKey !== "completed" ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-none border-0 px-2 py-1 text-[10px] uppercase text-white shadow-none",
                    statusConfig.className,
                  )}
                >
                  {status}
                </Badge>
              ) : null}
            </div>

            <DateTimeDisplay
              dateString={activity.publishedAt}
              locale={locale}
              className="mt-3 text-[11px] text-white/80"
            />

            <h3 className="mt-2 line-clamp-3 text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary-foreground sm:text-2xl">
              {activity.activityName}
            </h3>

            {preview ? (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-[15px]">
                {preview}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

function ActivityShowcaseItem({
  activity,
  locale,
  isLast,
}: {
  activity: Activity;
  locale: Locale;
  isLast?: boolean;
}) {
  const imageUrl = getImageUrl(activity.coverImage, "thumbnail");
  const displayCategory = getDisplayCategory(activity, locale);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className={cn(
        "group block border-b border-border pb-3 transition-colors last:border-b-0 last:pb-0",
        !isLast && "pb-3",
      )}
    >
      <article className="flex items-start gap-3">
        <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-md bg-muted sm:h-[78px] sm:w-[104px]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.activityName || "Activity image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {displayCategory ? (
              <ActivityVibrantBadge
                displayCategory={displayCategory}
                imageUrl={imageUrl}
                className="rounded-none px-2 py-1 text-[9px] uppercase"
              />
            ) : null}
            <DateTimeDisplay
              dateString={activity.publishedAt}
              locale={locale}
              className="text-[10px]"
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
                {activity.activityName}
              </h4>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-72">
              {activity.activityName}
            </TooltipContent>
          </Tooltip>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-secondary-foreground sm:text-sm">
            {extractPreviewContent(activity.content, 90)}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function ActivityShowcaseSection({
  locale,
  activities,
}: ActivityShowcaseSectionProps) {
  if (!activities?.length) return null;

  const [featured, ...rest] = activities;
  const sideItems = rest.slice(0, 4);

  return (
    <section className="mt-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <ActivityShowcaseHero activity={featured} locale={locale} />

        <div className="rounded-lg border border-border bg-card px-4 py-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {locale === "vi" ? "Hoạt động gần đây" : "Recent Activities"}
            </span>
            <span className="text-xs text-muted-foreground">
              {sideItems.length}
            </span>
          </div>

          <div className="space-y-3">
            {sideItems.map((activity, index) => (
              <ActivityShowcaseItem
                key={activity.documentId}
                activity={activity}
                locale={locale}
                isLast={index === sideItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
