import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

interface CourseYearTimelineProps {
  years: number[];
  currentYear?: number;
  locale: Locale;
  onSelect: (year?: number) => void;
}

export default function CourseYearTimeline({
  years,
  currentYear,
  locale,
  onSelect,
}: CourseYearTimelineProps) {
  const sortedYears = [...new Set(years)].sort((a, b) => b - a);
  const recentYears = sortedYears.slice(0, 5);
  const olderYears = sortedYears.slice(5);
  const selectedOlderYear =
    currentYear && olderYears.includes(currentYear) ? currentYear : undefined;

  const yearButtonClass = (active: boolean) =>
    cn(
      "relative min-w-16 cursor-pointer border-b-2 px-3 py-3 font-serif text-sm transition-colors",
      active
        ? "border-primary bg-primary/5 font-semibold text-primary"
        : "border-transparent text-foreground/70 hover:border-primary/30 hover:text-foreground",
    );

  return (
    <div className="border-y border-border/80">
      <div className="flex min-w-0 items-stretch">
        <div className="hidden shrink-0 items-center gap-2 border-r border-border/80 pr-4 text-xs tracking-wide text-muted-foreground xl:flex">
          {locale === "vi" ? "Năm tổ chức" : "Year"}
        </div>

        <div className="font-serif flex min-w-0 flex-1 items-stretch overflow-x-auto">
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className={yearButtonClass(!currentYear)}
          >
            {locale === "vi" ? "Tất cả" : "All"}
          </button>

          {recentYears.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onSelect(year)}
              className={yearButtonClass(currentYear === year)}
            >
              {year}
            </button>
          ))}
        </div>

        {olderYears.length > 0 ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto shrink-0 rounded-none border-l border-border/80 px-4 font-serif",
                  selectedOlderYear ? "bg-primary/5 text-primary" : "",
                )}
              >
                {selectedOlderYear ??
                  (locale === "vi" ? "Năm cũ" : "Earlier")}
                <ChevronDown data-icon="inline-end" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 rounded-lg p-2">
              <p className="px-2 pb-2 pt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {locale === "vi" ? "Chọn năm" : "Select year"}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {olderYears.map((year) => (
                  <Button
                    key={year}
                    type="button"
                    variant={currentYear === year ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onSelect(year)}
                    className="font-serif"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </div>
  );
}
