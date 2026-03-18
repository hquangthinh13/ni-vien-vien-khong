"use client";

import * as React from "react";
import { Calendar } from "@/shared/ui/calendar-modified";
import { Card, CardContent } from "@/shared/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { Locale } from "@/types/locale";
import type { Activity } from "@/features/activity/model/activity.types";
import { fetchActivitiesByMonth } from "@/features/activity/api/activity.api";
import Link from "next/link";
type MonthKey = `${number}-${string}`;

function toMonthKey(d: Date): MonthKey {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}` as MonthKey;
}

function normalizeMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getActivityKey(a: Activity): string {
  const anyA = a as unknown as { documentId?: string; id?: string | number };
  return String(anyA.documentId ?? anyA.id ?? a.slug);
}

function activityIntersectsDay(a: Activity, day: Date): boolean {
  if (!a.activityStartDate) return false;

  const start = parseISO(a.activityStartDate);
  if (Number.isNaN(start.getTime())) return false;

  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  // Single-day event
  if (!a.activityEndDate) {
    return isWithinInterval(start, { start: dayStart, end: dayEnd });
  }

  const end = parseISO(a.activityEndDate);

  if (Number.isNaN(end.getTime()) || end < start) {
    return isWithinInterval(start, { start: dayStart, end: dayEnd });
  }

  // overlap check
  return start <= dayEnd && end >= dayStart;
}
export default function EventCalendar({ locale }: { locale: Locale }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  const [visibleMonth, setVisibleMonth] = React.useState<Date>(() =>
    normalizeMonth(new Date()),
  );

  const [activitiesByMonth, setActivitiesByMonth] = React.useState<
    Partial<Record<MonthKey, Activity[]>>
  >({});
  const [loadingByMonth, setLoadingByMonth] = React.useState<
    Partial<Record<MonthKey, boolean>>
  >({});
  const [errorByMonth, setErrorByMonth] = React.useState<
    Partial<Record<MonthKey, string | null>>
  >({});

  const inflightRef = React.useRef<AbortController | null>(null);

  // Detect screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const monthKey = React.useMemo(
    () => toMonthKey(visibleMonth),
    [visibleMonth],
  );

  const activities = React.useMemo<Activity[]>(() => {
    return activitiesByMonth[monthKey] ?? [];
  }, [activitiesByMonth, monthKey]);
  const isLoading = Boolean(loadingByMonth[monthKey]);
  const error = errorByMonth[monthKey] ?? null;

  React.useEffect(() => {
    // Fetch only when we don't already have this month cached.
    if (activitiesByMonth[monthKey]) return;

    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    setLoadingByMonth((prev) => ({ ...prev, [monthKey]: true }));
    setErrorByMonth((prev) => ({ ...prev, [monthKey]: null }));

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth() + 1; // 1-12

    fetchActivitiesByMonth({ year, month, locale })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data
            ? [res.data]
            : [];
        setActivitiesByMonth((prev) => ({ ...prev, [monthKey]: data }));
      })
      .catch((e: unknown) => {
        // Ignore abort errors
        if ((e as { name?: string }).name === "AbortError") return;
        const message =
          e instanceof Error ? e.message : "Failed to load activities";
        setErrorByMonth((prev) => ({ ...prev, [monthKey]: message }));
      })
      .finally(() => {
        setLoadingByMonth((prev) => ({ ...prev, [monthKey]: false }));
      });
    // console.log("Fetching activities for", year, month);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey, visibleMonth, locale]);

  const handleMonthChange = (newMonth: Date) => {
    const normalized = normalizeMonth(newMonth);
    setVisibleMonth(normalized);
    // Reset selected date to the first day of the viewed month for consistency
    setSelectedDate(normalized);
    setPopoverOpen(false);
  };

  const selectedDayActivities = React.useMemo(() => {
    if (!selectedDate) return [];
    return activities.filter((a) => activityIntersectsDay(a, selectedDate));
  }, [activities, selectedDate]);

  const handleDayClick = (d: Date | undefined) => {
    setSelectedDate(d);
    if (!d) return;
    const hasEvents = activities.some((a) => activityIntersectsDay(a, d));
    setPopoverOpen(hasEvents);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-start">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDayClick}
              locale={vi}
              month={visibleMonth}
              onMonthChange={handleMonthChange}
              showOutsideDays={false}
              className="rounded-none bg-none"
              classNames={{
                day: "p-0",
                table:
                  "w-full border-separate border-spacing-x-2 border-spacing-y-2 table-fixed",
                caption_label: "text-lg font-bold font-serif",
                weekday:
                  "text-foreground rounded-md flex-1 font-normal text-sm select-none",
              }}
              modifiers={{
                hasEventCurrentMonth: (day) =>
                  day.getMonth() === visibleMonth.getMonth() &&
                  day.getFullYear() === visibleMonth.getFullYear() &&
                  activities.some((a) => activityIntersectsDay(a, day)),

                hasEventOutsideMonth: (day) =>
                  (day.getMonth() !== visibleMonth.getMonth() ||
                    day.getFullYear() !== visibleMonth.getFullYear()) &&
                  activities.some((a) => activityIntersectsDay(a, day)),
              }}
              modifiersClassNames={{
                hasEventCurrentMonth:
                  "[&_button]:border [&_button]:border-2 [&_button]:border-primary [&_button]:rounded-full",

                hasEventOutsideMonth:
                  "[&_button]:border [&_button]:border-2 [&_button]:border-muted-foreground [&_button]:rounded-full [&_button]:opacity-60",
              }}
            />
          </div>
        </PopoverTrigger>
        {selectedDayActivities.length > 0 ? (
          <PopoverContent
            className="w-80 p-4 rounded-xl max-h-96 overflow-auto"
            align="center"
            side={isLargeScreen ? "left" : "bottom"}
          >
            <div className="space-y-3">
              {(isLoading || error) && (
                <div className="text-xs">
                  {isLoading ? (
                    <p className="text-muted-foreground italic">
                      Đang tải lịch tháng…
                    </p>
                  ) : null}
                  {error ? <p className="text-destructive">{error}</p> : null}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {
                  selectedDayActivities.length > 0 &&
                    selectedDayActivities.map((activity) => (
                      <ActivityItem
                        key={getActivityKey(activity)}
                        activity={activity}
                      />
                    ))
                  //  : (
                  //   <p className="text-sm text-muted-foreground italic">
                  //     Không có sự kiện nào cho ngày này.
                  //   </p>
                  // )
                }
              </div>
            </div>
          </PopoverContent>
        ) : null}
      </Popover>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const start = activity.activityStartDate
    ? parseISO(activity.activityStartDate)
    : null;

  const end = activity.activityEndDate
    ? parseISO(activity.activityEndDate)
    : null;

  return (
    <Link href={`/activity/${activity.slug}-${activity.documentId}`}>
      <Card className="flex flex-1 p-0 border-l-4 border-l-primary">
        <CardContent className="p-3 w-full">
          <p className="font-semibold text-sm text-foreground hover:text-accent-foreground transition-colors duration-200 ease-in-out">
            {activity.activityName}
          </p>

          <p className="text-xs text-muted-foreground mt-1 font-mono ">
            {start && !Number.isNaN(start.getTime())
              ? format(start, "dd/MM/yyyy HH:mm")
              : activity.activityStartDate}

            {end && start && !Number.isNaN(end.getTime()) && end >= start
              ? ` - ${format(end, "dd/MM/yyyy HH:mm")}`
              : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
