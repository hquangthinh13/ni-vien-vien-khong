import type { VideoPlaylist } from "@/features/video/model/video.types";
import type { Locale } from "@/types/locale";
import RelatedContentList from "@/shared/layout/RelatedContentList";

interface RelatedVideosSectionProps {
  videos: VideoPlaylist[];
  locale: Locale;
}

export default function RelatedVideosSection({
  videos,
  locale,
}: RelatedVideosSectionProps) {
  return (
    <RelatedContentList
      title={
        locale === "vi" ? "Pháp thoại liên quan" : "Related Dharma Talks"
      }
      locale={locale}
      items={videos.map((item) => ({
        key: item.documentId,
        href: `/library/video/${item.documentId}`,
        title: item.title,
        date: item.publishedAt || item.createdAt,
      }))}
    />
  );
}
