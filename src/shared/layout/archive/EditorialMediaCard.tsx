import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/types/locale";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import { cn } from "@/shared/lib/utils";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

export interface EditorialMediaItem {
  key: string;
  href: string;
  title: string;
  imageUrl?: string | null;
  imageAlt?: string;
  excerpt?: string;
  category?: string;
  date?: string | null;
  secondaryMeta?: ReactNode;
}

interface EditorialMediaCardProps {
  item: EditorialMediaItem;
  locale: Locale;
  variant?: "featured" | "standard" | "compact";
}

export default function EditorialMediaCard({
  item,
  locale,
  variant = "standard",
}: EditorialMediaCardProps) {
  const featured = variant === "featured";
  const compact = variant === "compact";

  return (
    <Link
      href={item.href}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
    >
      <article
        className={cn(
          "h-full",
          featured &&
            "overflow-hidden rounded-lg border border-border/80 bg-background md:grid md:min-h-72 md:grid-cols-[1.15fr_1fr]",
          compact &&
            "grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-border/75 py-4",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-lg bg-[#eee5d8]",
            featured
              ? "aspect-video rounded-none md:aspect-auto md:min-h-full"
              : compact
                ? "aspect-video"
                : "aspect-video",
          )}
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.imageAlt || item.title}
              fill
              sizes={
                featured
                  ? "(min-width: 1024px) 45vw, 100vw"
                  : compact
                    ? "112px"
                    : "(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
              }
              className="scale-[1.01] object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          ) : null}
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-col",
            featured ? "justify-center p-5 md:p-7" : compact ? "" : "pt-4",
          )}
        >
         
          <div className="flex gap-2 items-center mb-2">
            {item.category && (
              <DateTimeDisplay
                dateString={item.category}
                locale={locale}
                className="text-primary font-semibold md:text-xs"
              />
            )}
            {item.category && item.date && (
              <DateTimeDisplay
                dateString="|"
                locale={locale}
                className="md:text-xs"
              />
            )}
            {item.date ? (
              <DateTimeDisplay
                dateString={item.date}
                locale={locale}
                includeTime={false}
                className="md:text-xs"
              />
            ) : null}
          </div>

          <h3
            className={cn(
              "line-clamp-2 font-bold leading-snug text-foreground transition-colors group-hover:text-primary",
              featured
                ? "text-xl md:text-2xl"
                : compact
                  ? "text-base"
                  : "text-lg",
            )}
          >
            {item.title}
          </h3>
     {item.excerpt && !compact ? (
  <p
    className={cn(
      "mt-3 whitespace-pre-line text-sm leading-7 text-secondary-foreground/65",
      featured ? "line-clamp-4" : "line-clamp-4",
    )}
  >
    {item.excerpt}
  </p>
) : null}
        </div>
      </article>
    </Link>
  );
}
