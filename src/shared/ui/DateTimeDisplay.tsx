import React from "react";
import { cn, formatFriendlyDate } from "@/shared/lib/utils";

interface DateTimeDisplayProps {
  dateString?: string | null;
  locale: string;
  includeTime?: boolean;
  className?: string;
  emptyFallback?: string;
}

export default function DateTimeDisplay({
  dateString,
  locale,
  includeTime = true,
  className,
  emptyFallback = "",
}: DateTimeDisplayProps) {
  if (!dateString) {
    return emptyFallback ? (
      <span
        className={cn(
          "font-mono text-xs tracking-wide text-muted-foreground",
          className,
        )}
      >
        {emptyFallback}
      </span>
    ) : null;
  }

  return (
    <span
      className={cn(
        "font-mono text-xs tracking-normal text-muted-foreground",
        className,
      )}
    >
      {formatFriendlyDate(dateString, locale, includeTime)}
    </span>
  );
}
