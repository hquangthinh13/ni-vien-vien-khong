"use client";

import { cn } from "@/shared/lib/utils";

export interface ArchiveCategoryItem<T extends string = string> {
  value: T;
  label: string;
}

interface ArchiveCategoryRailProps<T extends string> {
  label: string;
  items: ArchiveCategoryItem<T>[];
  activeValue: T;
  activeTotal?: number;
  onSelect: (value: T) => void;
  compact?: boolean;
}

export default function ArchiveCategoryRail<T extends string>({
  label,
  items,
  activeValue,
  activeTotal,
  onSelect,
  compact = false,
}: ArchiveCategoryRailProps<T>) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "flex flex-col",
        compact ? "gap-1" : "sticky top-24 gap-2",
      )}
    >
      {!compact ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      ) : null}
      {items.map((item) => {
        const active = item.value === activeValue;

        return (
          <button
            key={item.value}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(item.value)}
            className={cn(
              "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 border-l-2 px-4 py-2.5 text-left text-sm font-semibold transition-colors",
              active
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent text-foreground/75 hover:border-primary/40 hover:bg-primary/3 hover:text-foreground",
            )}
          >
            <span>{item.label}</span>
            {active && typeof activeTotal === "number" ? (
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {activeTotal}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
