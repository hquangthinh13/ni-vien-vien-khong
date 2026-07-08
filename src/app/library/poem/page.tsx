import { fetchPoems } from "@/features/poem/api/poem.api";
import { getAppLocale } from "@/shared/lib/i18n";
import PoemCard from "@/features/poem/ui/PoemCard";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import ContentGrid from "@/shared/layout/ContentGrid";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

export const metadata: Metadata = {
  title: "Thơ thiền",
};

export default async function PoemListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;

  const response = await fetchPoems({
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: ["title:asc"],
    populate: "*",
  });

  const poems = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <PageHeader title={locale === "vi" ? "Thơ thiền" : "Poems"} />

      {poems.length === 0 ? (
        <EmptyState
          message={
            locale === "vi"
              ? "Hiện chưa có bài thơ nào."
              : "No poems available yet."
          }
        />
      ) : (
        <ContentGrid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {poems.map((poem) => (
            <PoemCard key={poem.documentId} poem={poem} />
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