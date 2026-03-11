import Image from "next/image";
import Link from "next/link";
import { extractFirstParagraph, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import type { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";
interface MobileCardProps {
  activity: Activity;
  locale: Locale;
}
export default async function MobileActivitiesCard({
  activity,
  locale,
}: MobileCardProps) {
  const { slug, documentId, activityName, coverImage, content, publishedAt } =
    activity;
  const imageUrl = getImageUrl(coverImage);

  return (
    <Link
      href={`/activity/${slug}-${documentId}`}
      className="flex gap-4 not-first:pt-2 not-last:pb-2 border-b last:border-0 items-start"
    >
      <div className="group relative h-24 w-auto aspect-video shrink-0 overflow-hidden rounded-md bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={activityName || "Activity image"}
            fill
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-mono">
          {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
        </span>
        <h3 className="text-sm font-bold leading-tight hover:text-primary line-clamp-1">
          {activityName || "Untitled Activity"}
        </h3>
        <p className="line-clamp-2 font-mono text-xs text-secondary-foreground opacity-80">
          {extractFirstParagraph(content)}
        </p>
      </div>
    </Link>
  );
}
