"use client";

import * as React from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  addMonths,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/types/locale";
import type { Activity } from "@/features/activity/model/activity.types";
import { fetchActivitiesByMonth } from "@/features/activity/api/activity.api";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import ActivityCalendarDetailPanel from "./ActivityCalendarDetailPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type MonthKey = `${number}-${string}`;

export function toMonthKey(d: Date): MonthKey {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}` as MonthKey;
}

export function normalizeMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getActivityKey(a: Activity): string {
  const anyA = a as unknown as { documentId?: string; id?: string | number };
  return String(anyA.documentId ?? anyA.id ?? a.slug);
}

export function activityIntersectsDay(a: Activity, day: Date): boolean {
  if (!a.activityStartDate) return false;

  const start = parseISO(a.activityStartDate);
  if (Number.isNaN(start.getTime())) return false;

  const dayStart = startOfDay(day);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  if (!a.activityEndDate) {
    return isWithinInterval(start, { start: dayStart, end: dayEnd });
  }

  const end = parseISO(a.activityEndDate);
  if (Number.isNaN(end.getTime()) || end < start) {
    return isWithinInterval(start, { start: dayStart, end: dayEnd });
  }

  return start <= dayEnd && end >= dayStart;
}

export function getActivitiesForDay(
  activities: Activity[],
  day: Date,
): Activity[] {
  return activities.filter((a) => activityIntersectsDay(a, day));
}

interface ActivityCalendarDashboardProps {
  locale: Locale;
}

function getInitialSelectedDate(month: Date) {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === month.getFullYear() &&
    today.getMonth() === month.getMonth();
  return isCurrentMonth ? today : month;
}

function getCalendarDays(month: Date): Date[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

function getWeekdayLabels(locale: Locale) {
  const base = startOfWeek(new Date(), { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(base, i);
    return format(day, "EEE", { locale: locale === "vi" ? vi : enUS });
  });
}

export default function ActivityCalendarDashboard({
  locale,
}: ActivityCalendarDashboardProps) {
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(() =>
    normalizeMonth(new Date()),
  );
  const [selectedDate, setSelectedDate] = React.useState<Date>(() =>
    getInitialSelectedDate(normalizeMonth(new Date())),
  );
  const [overlayOpen, setOverlayOpen] = React.useState(false);
  const [overlayDate, setOverlayDate] = React.useState<Date | null>(null);
  const [isDesktop, setIsDesktop] = React.useState(false);

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

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const monthKey = React.useMemo(
    () => toMonthKey(visibleMonth),
    [visibleMonth],
  );

  const activities = React.useMemo<Activity[]>(
    () => activitiesByMonth[monthKey] ?? [],
    [activitiesByMonth, monthKey],
  );
  const isLoading = Boolean(loadingByMonth[monthKey]);
  const error = errorByMonth[monthKey] ?? null;

  React.useEffect(() => {
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    setLoadingByMonth((prev) => ({ ...prev, [monthKey]: true }));
    setErrorByMonth((prev) => ({ ...prev, [monthKey]: null }));

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth() + 1;

    fetchActivitiesByMonth({ year, month, locale, signal: controller.signal })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data
            ? [res.data]
            : [];
        setActivitiesByMonth((prev) => ({ ...prev, [monthKey]: data }));
      })
      .catch((e: unknown) => {
        if ((e as { name?: string }).name === "AbortError") return;
        const message =
          e instanceof Error
            ? e.message
            : locale === "vi"
              ? "Không thể tải lịch tháng"
              : "Failed to load month schedule";
        setErrorByMonth((prev) => ({ ...prev, [monthKey]: message }));
      })
      .finally(() => {
        setLoadingByMonth((prev) => ({ ...prev, [monthKey]: false }));
      });

    return () => {
      controller.abort();
    };
  }, [monthKey, visibleMonth, locale]);

  const calendarDays = React.useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const weekdayLabels = React.useMemo(() => getWeekdayLabels(locale), [locale]);

  const dayActivityMap = React.useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const day of calendarDays) {
      map.set(format(day, "yyyy-MM-dd"), getActivitiesForDay(activities, day));
    }
    return map;
  }, [calendarDays, activities]);

  const selectedDayActivities = React.useMemo(() => {
    if (!overlayDate) return [];
    return getActivitiesForDay(activities, overlayDate);
  }, [activities, overlayDate]);

  const monthLabel = React.useMemo(
    () =>
      format(visibleMonth, "MMMM yyyy", {
        locale: locale === "vi" ? vi : enUS,
      }),
    [visibleMonth, locale],
  );

  const goToMonth = React.useCallback((nextMonth: Date) => {
    const normalized = normalizeMonth(nextMonth);
    setVisibleMonth(normalized);
    setSelectedDate(getInitialSelectedDate(normalized));
    setOverlayDate(null);
    setOverlayOpen(false);
  }, []);

  const handleDaySelect = React.useCallback(
    (day: Date, dayActivities: Activity[]) => {
      setSelectedDate(day);
      if (dayActivities.length > 0) {
        setOverlayDate(day);
        setOverlayOpen(true);
      } else {
        setOverlayDate(null);
        setOverlayOpen(false);
      }
    },
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
      <div className="lg:col-span-12 lg:pr-2">
        <div className="flex items-center justify-between border-b pb-2 border-primary/10">
          <div className="flex flex-col">
            <p className="font-sans font-bold text-lg capitalize text-primary">
              {monthLabel}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {locale === "vi"
                ? "Chọn vào ngày có hoạt động để xem lịch chi tiết"
                : "Select a date to view details"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-md border-primary/20"
              onClick={() => goToMonth(subMonths(visibleMonth, 1))}
              aria-label={locale === "vi" ? "Tháng trước" : "Previous month"}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-md border-primary/20"
              onClick={() => goToMonth(addMonths(visibleMonth, 1))}
              aria-label={locale === "vi" ? "Tháng sau" : "Next month"}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="pb-2 pt-3 md:pb-3">
          <div className="mb-2 grid grid-cols-7 gap-1 md:gap-2">
            {weekdayLabels.map((weekday) => (
              <p
                key={weekday}
                className="text-start text-[11px] font-mono font-semibold uppercase tracking-wide text-foreground md:text-xs"
              >
                {weekday}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarDays.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayActivities = dayActivityMap.get(dayKey) ?? [];
              const inMonth = isSameMonth(day, visibleMonth);
              const selected = isSameDay(day, selectedDate);
              const visibleItems = dayActivities.slice(0, 3);
              const remaining = dayActivities.length - visibleItems.length;

              const buttonNode = (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => handleDaySelect(day, dayActivities)}
                  className={cn(
                    "group min-h-20 rounded-lg border p-1.5 text-left transition-colors md:min-h-30 md:p-2",
                    inMonth
                      ? "border-primary/10 bg-[#fffdf9] hover:border-primary/30"
                      : "border-primary/5 bg-muted/30 text-muted-foreground",
                    selected && "border-primary/50 ring-1 ring-primary/20",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[11px] font-mono md:text-xs",
                        selected
                          ? "text-primary font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        dayActivities.length > 0
                          ? "bg-primary/70"
                          : "bg-transparent",
                      )}
                    />
                  </div>

                  <div className="lg:hidden">
                    {dayActivities.length > 0 ? (
                      <span className="inline-flex rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-primary">
                        {dayActivities.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="hidden gap-1 lg:flex lg:flex-col">
                    {visibleItems.map((activity) => {
                      const start = activity.activityStartDate
                        ? parseISO(activity.activityStartDate)
                        : null;

                      return (
                        <div
                          key={`${dayKey}-${getActivityKey(activity)}`}
                          className="rounded-md border border-primary/10 bg-primary/5 px-1.5 py-1"
                        >
                          <p className="line-clamp-2 text-[10px] font-medium leading-tight text-foreground">
                            {activity.activityName}
                          </p>
                          {start && !Number.isNaN(start.getTime()) ? (
                            <p className="mt-0.5 text-[10px] font-mono text-primary/80">
                              {format(start, "HH:mm")}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}

                    {remaining > 0 ? (
                      <p className="text-[10px] font-mono text-primary">
                        +{remaining}
                      </p>
                    ) : null}
                  </div>
                </button>
              );

              if (!isDesktop) {
                return buttonNode;
              }

              return (
                <Popover
                  key={dayKey}
                  open={
                    overlayOpen &&
                    Boolean(overlayDate) &&
                    isSameDay(day, overlayDate as Date) &&
                    dayActivities.length > 0
                  }
                  onOpenChange={(open) => {
                    if (!open) setOverlayOpen(false);
                  }}
                >
                  <PopoverTrigger asChild>{buttonNode}</PopoverTrigger>
                  <PopoverContent
                    align="center"
                    side="right"
                    className="w-85 p-0 border-primary/15 bg-background"
                  >
                    <ActivityCalendarDetailPanel
                      locale={locale}
                      selectedDate={day}
                      activities={dayActivities}
                      compact
                      className="border-0 shadow-none"
                    />
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>

          {isLoading ? (
            <p className="mt-3 text-xs italic text-muted-foreground">
              {locale === "vi"
                ? "Đang tải lịch tháng..."
                : "Loading month schedule..."}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 text-xs text-destructive">{error}</p>
          ) : null}
        </div>
      </div>
      <Dialog
        open={!isDesktop && overlayOpen && Boolean(overlayDate)}
        onOpenChange={(open) => setOverlayOpen(open)}
      >
        <DialogContent className="max-w-[calc(100%-1.5rem)] p-0 sm:max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {locale === "vi" ? "Lịch trong ngày" : "Details Schedule"}
            </DialogTitle>
          </DialogHeader>
          {overlayDate ? (
            <ActivityCalendarDetailPanel
              locale={locale}
              selectedDate={overlayDate}
              activities={selectedDayActivities}
              compact
              className="border-0 shadow-none"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
