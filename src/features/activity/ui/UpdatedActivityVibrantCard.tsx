"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Vibrant } from "node-vibrant/browser";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import DateCard from "@/shared/layout/DateCard";
import { categoryMap } from "@/types/categories";
import {
  cn,
  extractPreviewContent,
  formatFriendlyDate,
} from "@/shared/lib/utils";
import ActivityVibrantBadge from "./ActivityVibrantBadge";
import { Badge } from "@/shared/ui/badge";
import { getActivityStatus, getStatusLabel } from "../api/activity.api";
import { getActivityStatusConfig } from "@/shared/lib/activity-status.config";

interface UpdatedActivityVibrantCardProps {
  activity: Activity;
  locale: Locale;
}

type VibrantTheme = {
  accent: string;
  panel: string;
  dateHeader: string;
};

const FALLBACK_THEME: VibrantTheme = {
  accent: "#7A4B2A",
  panel: "rgba(122, 75, 42, 0.12)",
  dateHeader: "#7A4B2A",
};

const UpdatedActivityVibrantCard = ({
  activity,
  locale,
}: UpdatedActivityVibrantCardProps) => {
  const [theme, setTheme] = useState<VibrantTheme>(FALLBACK_THEME);
  const imageUrl = getImageUrl(activity?.coverImage, "medium");

  useEffect(() => {
    let mounted = true;
    if (!imageUrl) return () => void (mounted = false);

    const extractTheme = async () => {
      try {
        const v = new Vibrant(imageUrl);
        const palette = await v.getPalette();
        if (!mounted) return;

        const vibrant = palette.Vibrant?.hex;
        const darkVibrant = palette.DarkVibrant?.hex;
        const muted = palette.Muted?.hex;
        const lightMuted = palette.LightMuted?.hex;

        setTheme({
          accent: vibrant || muted || FALLBACK_THEME.accent,
          panel: `${lightMuted || muted || FALLBACK_THEME.accent}26`,
          dateHeader: vibrant || darkVibrant || FALLBACK_THEME.dateHeader,
        });
      } catch (error) {
        if (!mounted) return;
        console.warn("Vibrant error:", error);
        setTheme(FALLBACK_THEME);
      }
    };

    extractTheme();

    return () => {
      mounted = false;
    };
  }, [imageUrl]);

  const displayCategory = useMemo(() => {
    const rawCategoryKey =
      activity.activityCategory === "Khóa Tu"
        ? activity.courseContent?.courseCategory || "Khóa Tu"
        : activity.activityCategory;

    return rawCategoryKey
      ? categoryMap[locale][rawCategoryKey as string] || rawCategoryKey
      : "";
  }, [
    activity.activityCategory,
    activity.courseContent?.courseCategory,
    locale,
  ]);

  const status = getStatusLabel(activity, locale);
  const statusKey = getActivityStatus(activity);
  const statusConfig = getActivityStatusConfig(statusKey);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className="group block"
    >
      <article className="relative overflow-hidden rounded-none border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        <div
          className="absolute left-0 top-0 h-full w-1.5 transition-all duration-300"
          style={{
            backgroundColor: imageUrl ? theme.accent : FALLBACK_THEME.accent,
          }}
        />

        <div className="relative aspect-video w-full overflow-hidden rounded-none">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.activityName || "Activity image"}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}

          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" /> */}

          <div className="absolute left-3 top-3">
            <DateCard
              dateISO={activity.activityStartDate}
              locale={locale}
              headerColor={
                imageUrl ? theme.dateHeader : FALLBACK_THEME.dateHeader
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4 pl-5">
          <h3 className="line-clamp-2 text-md font-bold leading-snug transition-colors group-hover:text-primary">
            {activity.activityName}
          </h3>

          <div className="mb-1 flex flex-wrap items-center gap-2">
            <ActivityVibrantBadge
              displayCategory={displayCategory}
              imageUrl={imageUrl}
              className="rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.08em]"
            />
            {statusKey !== "completed" ? (
              <Badge
                variant="outline"
                className={cn(
                  "rounded-none border-0 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white shadow-none",
                  statusConfig.className,
                )}
              >
                {status}
              </Badge>
            ) : null}
          </div>
          {/* 
          <div
            className="text-sm text-secondary-foreground"
            style={{
              borderColor: imageUrl ? theme.accent : FALLBACK_THEME.accent,
              // backgroundColor: imageUrl ? theme.panel : FALLBACK_THEME.panel,
            }}
          >
            <p className="line-clamp-2 font-mono">
              {extractPreviewContent(activity.content)}
            </p>
          </div>

          <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            {activity.publishedAt
              ? formatFriendlyDate(activity.publishedAt, locale, true)
              : ""}
          </span> */}
        </div>
      </article>
    </Link>
  );
};

export default UpdatedActivityVibrantCard;
