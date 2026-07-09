import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoPlaylist } from "@/features/video/model/video.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
import HomeSectionHeader from "./HomeSectionHeader";

interface HomeVideoEditorialSectionProps {
  videos: VideoPlaylist[];
  locale: Locale;
}

export default function HomeVideoEditorialSection({
  videos,
  locale,
}: HomeVideoEditorialSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section>
      <HomeSectionHeader
        title={locale === "vi" ? "Pháp thoại" : "Dharma Talks"}
        href="/library/video"
        locale={locale}
      />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {videos.slice(0, 4).map((video) => {
          const imageUrl =
            getImageUrl(video.coverImage, "medium") ||
            "/placeholder.png";

          return (
            <Link
              key={video.documentId}
              href={`/library/video/${video.documentId}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              <article>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={imageUrl}
                    alt={video.title || "Video cover image"}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="scale-[1.01] object-cover transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-hover:bg-black/10">
                    <span className="flex size-11 items-center justify-center rounded-full border border-white/80 bg-black/20 text-white backdrop-blur-[2px] transition-transform group-hover:scale-105">
                      <Play className="ml-0.5 size-4 fill-current" />
                    </span>
                  </span>
                </div>

                <div className="pt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {locale === "vi" ? "Pháp thoại" : "Dharma Talks"}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      |
                    </span>
                    <DateTimeDisplay
                      dateString={video.publishedAt}
                      locale={locale}
                      includeTime={false}
                      className="md:text-xs"
                    />
                  </div>

                  <h3
                    className="line-clamp-3 break-words text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:line-clamp-2"
                  >
                    {video.title}
                  </h3>

                  {video.description ? (
                    <p
                      className="mt-2 line-clamp-2 font-sans text-xs leading-6 text-secondary-foreground/60"
                    >
                      {video.description}
                    </p>
                  ) : null}
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
