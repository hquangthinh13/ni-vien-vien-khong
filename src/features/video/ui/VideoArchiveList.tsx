import type { VideoPlaylist } from "../model/video.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import ArchiveIntroRail from "@/shared/layout/archive/ArchiveIntroRail";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import EditorialMediaCard from "@/shared/layout/archive/EditorialMediaCard";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

interface VideoArchiveListProps {
  videos: VideoPlaylist[];
  locale: Locale;
  currentPage: number;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export default function VideoArchiveList({
  videos,
  locale,
  currentPage,
  paginationMeta,
}: VideoArchiveListProps) {
  const total = paginationMeta?.total ?? videos.length;

  return (
    <ArchivePageLayout
      rail={
        <ArchiveIntroRail
          eyebrow={locale === "vi" ? "Lắng nghe" : "Listen"}
          title={locale === "vi" ? "Pháp thoại" : "Dharma talks"}
          description={
            locale === "vi"
              ? "Những bài giảng nuôi dưỡng hiểu biết, bình an và con đường thực tập."
              : "Teachings that nurture understanding, peace, and daily practice."
          }
          total={total}
          totalLabel={locale === "vi" ? "Tất cả pháp thoại" : "All talks"}
        />
      }
    >
      <ArchiveResultsHeader
        title={locale === "vi" ? "Các bài pháp thoại" : "Dharma talks"}
        total={total}
        countLabel={locale === "vi" ? "video" : total === 1 ? "video" : "videos"}
      />

      <div className="mt-6">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <EditorialMediaCard
                key={video.documentId}
                locale={locale}
                item={{
                  key: video.documentId,
                  href: `/library/video/${video.documentId}`,
                  title: video.title,
                  imageUrl: getImageUrl(video.coverImage, "medium"),
                  imageAlt: video.coverImage?.alternativeText || video.title,
                  excerpt: video.description,
                  category: locale === "vi" ? "Pháp thoại" : "Dharma talk",
                  date: video.publishedAt,
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              locale === "vi"
                ? "Hiện chưa có pháp thoại nào."
                : "No dharma talks available yet."
            }
          />
        )}
      </div>

      {paginationMeta ? (
        <Pagination
          currentPage={currentPage}
          pageCount={paginationMeta.pageCount}
          locale={locale}
          className="mt-10 border-t border-border/80 pt-6"
        />
      ) : null}
    </ArchivePageLayout>
  );
}
