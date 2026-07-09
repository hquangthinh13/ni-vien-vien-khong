import { getAppLocale } from "@/shared/lib/i18n";
import VideoArchiveList from "@/features/video/ui/VideoArchiveList";
import { fetchVideo } from "@/features/video/api/video.api";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

export const metadata: Metadata = {
  title: "Pháp thoại",
};

export default async function VideoListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
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
      <AppBreadcrumb locale={locale} items={[{ label: locale === "vi" ? "Thư viện" : "Library" }, { label: locale === "vi" ? "Pháp thoại" : "Dharma Talks" }]} />
      <PageHeader
        title={locale === "vi" ? "Pháp thoại" : "Dharma Talks"}
        className="mb-10"
      />

      <VideoArchiveList
        videos={docs}
        locale={locale}
        currentPage={currentPage}
        paginationMeta={meta}
      />
    </PageShell>
  );
}
