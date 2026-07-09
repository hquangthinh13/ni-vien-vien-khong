import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { extractPreviewContent } from "@/shared/lib/utils";
import { getCategoryLabel } from "@/types/categories";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface HomeFeaturedActivityCardProps {
  activity: Activity;
  locale: Locale;
}

export default function HomeFeaturedActivityCard({
  activity,
  locale,
}: HomeFeaturedActivityCardProps) {
  const imageUrl = getImageUrl(activity.coverImage, "large");
  const excerpt = extractPreviewContent(activity.content);
  const category = getCategoryLabel(activity.activityCategory, locale);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
    >
      <article>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted md:aspect-video">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.activityName || "Activity image"}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="scale-[1.01] object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#eee5d8]" />
          )}
        </div>

        <div className="pt-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {category ? (
              <span className="font-mono text-xs font-semibold text-primary">
                {category}
              </span>
            ) : null}
            {category ? (
              <span className="font-mono text-xs text-muted-foreground">|</span>
            ) : null}
            <DateTimeDisplay
              dateString={activity.publishedAt}
              locale={locale}
              includeTime={false}
              className="md:text-xs"
            />
          </div>

          <h3 className="line-clamp-3 break-words text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:line-clamp-2 md:text-3xl">
            {activity.activityName}
          </h3>

          {excerpt ? (
            <p className="mt-3 line-clamp-4 max-w-3xl font-sans text-sm leading-7 text-secondary-foreground/65 md:line-clamp-3">
              {excerpt}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
