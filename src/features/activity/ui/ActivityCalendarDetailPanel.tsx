"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import type { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { cn, extractPreviewContent } from "@/shared/lib/utils";

interface ActivityCalendarDetailPanelProps {
  locale: Locale;
  selectedDate: Date;
  activities: Activity[];
  className?: string;
  compact?: boolean;
}

function formatDateLabel(date: Date, locale: Locale) {
  return format(date, "dd/MM/yyyy", {
    locale: locale === "vi" ? vi : enUS,
  });
}

function formatRange(activity: Activity, locale: Locale) {
  const start = activity.activityStartDate
    ? parseISO(activity.activityStartDate)
    : null;
  const end = activity.activityEndDate
    ? parseISO(activity.activityEndDate)
    : null;

  if (!start || Number.isNaN(start.getTime())) return "";

  const startText = format(start, "dd/MM/yyyy", {
    locale: locale === "vi" ? vi : enUS,
  });

  if (!end || Number.isNaN(end.getTime()) || end < start) {
    return startText;
  }

  return `${startText} - ${format(end, "dd/MM/yyyy", {
    locale: locale === "vi" ? vi : enUS,
  })}`;
}

export default function ActivityCalendarDetailPanel({
  locale,
  selectedDate,
  activities,
  className,
  compact = false,
}: ActivityCalendarDetailPanelProps) {
  const title =
    locale === "vi"
      ? `Lịch ngày ${formatDateLabel(selectedDate, locale)}`
      : `Details Schedule for ${formatDateLabel(selectedDate, locale)}`;
  const emptyText =
    locale === "vi"
      ? "Chưa có hoạt động trong ngày này."
      : "No activities scheduled for this day.";

  return (
    <Card
      className={cn(
        "h-full gap-0 rounded-xl border-primary/10 bg-background/95 py-0 shadow-sm",
        compact && "rounded-lg shadow-none border-primary/15",
        className,
      )}
    >
      <CardHeader className="border-b border-primary/10 px-4 pt-4 pb-0! md:px-5">
        <CardTitle className="text-sm text-primary">
          {title}{" "}
          {/* <p className="font-normal ml-auto flex text-sm uppercase tracking-wide text-primary">
          {formatDateLabel(selectedDate, locale)}
          </p> */}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4 md:px-5">
        {activities.length === 0 ? (
          <p className="rounded-lg border border-dashed border-primary/20 bg-primary/5 px-4 py-6 text-center text-sm text-muted-foreground italic">
            {emptyText}
          </p>
        ) : (
          <div
            className={cn(
              "space-y-3 overflow-y-auto pr-1",
              compact ? "max-h-90" : "max-h-120",
            )}
          >
            {activities.map((activity) => {
              const preview = extractPreviewContent(activity.content, 110);

              return (
                <article
                  key={activity.documentId}
                  className="rounded-lg border border-primary/10 bg-[#fcfaf6] p-3 transition-colors hover:border-primary/30"
                >
                  <Link
                    href={`/activity/${activity.slug}-${activity.documentId}`}
                    className="text-sm font-bold leading-snug text-foreground transition-colors hover:text-primary"
                  >
                    {activity.activityName}
                  </Link>

                  <p className="mt-1 text-xs font-mono text-muted-foreground">
                    {formatRange(activity, locale)}
                  </p>

                  {preview ? (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {preview}
                    </p>
                  ) : null}

                  <div className="mt-3">
                    <Button
                      asChild
                      variant="outline"
                      size="xs"
                      className="h-6 rounded-md border-primary/20 px-2 text-[11px]"
                    >
                      <Link
                        href={`/activity/${activity.slug}-${activity.documentId}`}
                      >
                        {locale === "vi" ? "Xem chi tiết" : "View detail"}
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
