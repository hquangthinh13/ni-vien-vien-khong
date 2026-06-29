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
  locale: Locale;
  isLastMobile?: boolean;
}

const VideoCard = ({ video, locale, isLastMobile = false }: VideoProps) => {
  const { title, documentId, description, coverImage, publishedAt } = video;
  const imageSrc = getImageUrl(coverImage, "thumbnail") || "/placeholder.png";

  return (
    <Link href={`/library/video/${documentId}`} className="group block">
      <div
        className={`flex min-w-0 flex-col gap-2 lg:hidden ${isLastMobile ? "" : ""}`}
      >
        <span className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </span>

        <div className="flex items-center gap-2">
          <div className="relative h-20 w-auto aspect-video shrink-0 overflow-hidden rounded-md bg-muted sm:h-24">
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
            <p className="line-clamp-2 text-sm text-secondary-foreground/60 font-sans leading-loose mb-1">
              {description}
            </p>
            <div className="flex gap-2 items-center">
              <DateTimeDisplay
                dateString={locale === "vi" ? "Pháp thoại" : "Dharma Talks"}
                locale={locale}
                className="text-primary font-semibold"
              />
              <DateTimeDisplay dateString="|" locale={locale} />
              <DateTimeDisplay
                dateString={publishedAt}
                locale={locale}
                className=""
              />
            </div>
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
          <span className="mb-2 line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
            {title}
          </span>
          <p className="line-clamp-2 text-sm text-secondary-foreground/60 font-sans leading-loose my-2">
            {description}
          </p>

          <div className="flex gap-2 items-center">
            <DateTimeDisplay
              dateString={locale === "vi" ? "Pháp thoại" : "Dharma Talks"}
              locale={locale}
              className="text-primary font-semibold"
            />
            <DateTimeDisplay dateString="|" locale={locale} />
            <DateTimeDisplay
              dateString={publishedAt}
              locale={locale}
              className=""
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
