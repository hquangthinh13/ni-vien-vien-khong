import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, ScrollText } from "lucide-react";
import type { Locale } from "@/types/locale";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

export interface DocumentArchiveItem {
  key: string;
  title: string;
  href: string;
  date?: string | null;
  meta?: string;
}

interface DocumentArchiveListProps {
  items?: DocumentArchiveItem[];
  children?: ReactNode;
  locale: Locale;
}

export default function DocumentArchiveList({
  items,
  children,
  locale,
}: DocumentArchiveListProps) {
  if (children) {
    return <div className="divide-y divide-border/75">{children}</div>;
  }

  return (
    <div className="divide-y divide-border/75">
      {items?.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="group grid min-h-20 grid-cols-[2.5rem_minmax(0,1fr)_1rem] items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/8 text-primary">
            <ScrollText className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {item.title}
            </span>
            <span className="mt-1 flex items-center gap-2">
              {item.meta ? (
                <span className="text-xs text-muted-foreground">
                  {item.meta}
                </span>
              ) : null}
              {item.date ? (
                <DateTimeDisplay
                  dateString={item.date}
                  locale={locale}
                  includeTime={false}
                  className="text-xs"
                />
              ) : null}
            </span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      ))}
    </div>
  );
}
