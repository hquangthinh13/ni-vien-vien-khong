import { getAppLocale } from "@/shared/lib/i18n";
import RitualCard from "@/features/ritual/ui/RitualCard";
import { fetchRituals } from "@/features/ritual/api/ritual.api";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import ContentGrid from "@/shared/layout/ContentGrid";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

export const metadata: Metadata = {
  title: "Nghi thức nghi lễ",
};

export default async function RitualListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 12;

  const response = await fetchRituals({
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: "createdAt:desc",
    populate: "*",
  });

  const docs = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <PageHeader
        title={locale === "vi" ? "Nghi thức nghi lễ" : "Rituals and Ceremonies"}
      />

      {docs.length === 0 ? (
        <EmptyState
          message={
            locale === "vi"
              ? "Hiện chưa có nghi thức nào."
              : "No ritual documents available yet."
          }
        />
      ) : (
        <ContentGrid className="grid-cols-1 sm:grid-cols-2">
          {docs.map((doc) => (
            <RitualCard key={doc.documentId} doc={doc} />
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
