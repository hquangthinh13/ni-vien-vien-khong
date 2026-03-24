import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { VideoPlaylist } from "../model/video.types";
import { getYouTubeThumbnail } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { formatFriendlyDate } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";
interface VideoProps {
  video: VideoPlaylist;
  locale?: Locale;
}

const VideoCard = ({ video, locale }: VideoProps) => {
  const { title, documentId, description, coverImage, videos, publishedAt } =
    video;

  const numberOfVideos = video.videos.length;

  let thumbnailUrl;
  if (numberOfVideos > 0 && videos[0].videoLink) {
    const firstVideoUrl = videos[0].videoLink;
    thumbnailUrl = getYouTubeThumbnail(firstVideoUrl);
  }
  return (
    <Link href={`/library/video/${documentId}`}>
      <div className="group flex flex-col h-full gap-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
          <Image
            src={
              getImageUrl(coverImage, "large") ||
              thumbnailUrl ||
              "/placeholder.png"
            }
            alt={title || "Blog image"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
          />
        </div>

        <div className="flex flex-col h-full gap-2">
          <span
            className={`text-md font-bold leading-snug group-hover:text-primary cursor-pointer mb-2`}
          >
            {title}
          </span>
          <p
            className={`line-clamp-3 text-sm text-secondary-foreground/80 font-mono`}
          >
            {description}
          </p>{" "}
          <span className="mt-auto text-xs text-muted-foreground font-mono uppercase">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
