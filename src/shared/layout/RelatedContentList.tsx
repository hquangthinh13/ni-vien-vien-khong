import Link from "next/link";
import { ScrollText } from "lucide-react";
import type { Locale } from "@/types/locale";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

export interface RelatedContentItem {
  key: string | number;
  href: string;
  title: string;
  date?: string | null;
}

interface RelatedContentListProps {
  title: string;
  items: RelatedContentItem[];
  locale: Locale;
}

export default function RelatedContentList({
  title,
  items,
  locale,
}: RelatedContentListProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2 border-b border-border/80 pb-2 text-lg font-bold uppercase tracking-wider">
        <ScrollText className="size-5 text-primary" />
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-5">
        {items.map((item) => (
          <Link key={item.key} href={item.href} className="group block">
            <div className="flex flex-col gap-1">
              <DateTimeDisplay
                dateString={item.date}
                locale={locale}
                includeTime={false}
              />
              <h3 className="line-clamp-3 text-sm font-bold leading-tight transition-colors group-hover:text-primary md:text-base">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
