import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { VideoPlaylist } from "../model/video.types";
import { getImageUrl } from "@/shared/lib/api";
import type { Locale } from "@/types/locale";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface VideoProps {
  video: VideoPlaylist;
  locale?: Locale;
  isLastMobile?: boolean;
}

const VideoCard = ({ video, locale, isLastMobile = false }: VideoProps) => {
  const { title, documentId, description, coverImage, publishedAt } = video;
  const imageSrc = getImageUrl(coverImage, "thumbnail") || "/placeholder.png";

  return (
    <Link href={`/library/video/${documentId}`} className="group block">
      <div
        className={`flex min-w-0 flex-col gap-1 pb-3 lg:hidden ${isLastMobile ? "" : "border-b"}`}
      >
        <span className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </span>

        <div className="flex items-center gap-2">
          <div className="relative h-[63px] w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:h-[81px] sm:w-36">
            <Image
              src={imageSrc}
              alt={title || "Video cover image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="mb-1 line-clamp-3 font-mono text-xs leading-relaxed text-secondary-foreground">
              {description}
            </p>
            <DateTimeDisplay
              dateString={publishedAt}
              locale={locale as string}
            />
          </div>
        </div>
      </div>

      <div className="hidden h-full flex-col gap-4 lg:flex">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
          <Image
            src={imageSrc}
            alt={title || "Video cover image"}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR_DATA_URL}
          />
        </div>

        <div className="flex h-full flex-col gap-2">
          <span className="mb-2 line-clamp-2 text-md font-bold leading-snug transition-colors group-hover:text-primary">
            {title}
          </span>
          <p className="line-clamp-3 text-sm font-mono text-secondary-foreground/80">
            {description}
          </p>
          <DateTimeDisplay
            dateString={publishedAt}
            locale={locale as string}
            className="mt-auto"
          />
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
