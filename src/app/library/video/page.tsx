import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import VideoCard from "@/features/video/ui/VideoCard";
import { fetchVideo } from "@/features/video/api/video.api";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import ContentGrid from "@/shared/layout/ContentGrid";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

export const metadata: Metadata = {
  title: "Pháp thoại",
};

export default async function VideoListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;

  const response = await fetchVideo({
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: ["createdAt:desc"],
    populate: "*",
  });

  const docs = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <PageHeader title={locale === "vi" ? "Pháp thoại" : "Dharma Talks"} />

      {docs.length === 0 ? (
        <EmptyState
          message={
            locale === "vi"
              ? "Hiện chưa có pháp thoại nào."
              : "No dharma talks available yet."
          }
        />
      ) : (
        <ContentGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <VideoCard key={doc.documentId} video={doc} locale={locale} />
          ))}
        </ContentGrid>
      )}

      {meta ? (
        <Pagination
          currentPage={currentPage}
          pageCount={meta.pageCount}
          locale={locale}
        />
      ) : null}
    </PageShell>
  );
}