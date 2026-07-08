import { getAppLocale } from "@/shared/lib/i18n";
import LinkedDocumentCard from "@/features/linkedDocument/ui/LinkedDocumentCard";
import { fetchLinkedDocumentsByCategory } from "@/features/linkedDocument/api/linkedDocument.api";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import ContentGrid from "@/shared/layout/ContentGrid";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

export const metadata: Metadata = {
  title: "Tạng Luật",
};

export default async function VinayaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 12;

  const response = await fetchLinkedDocumentsByCategory({
    category: "Tạng Luật",
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: ["title:asc"],
    populate: "*",
  });

  const docs = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <PageHeader title={locale === "vi" ? "Tạng Luật" : "Vinaya Texts"} />

      {docs.length === 0 ? (
        <EmptyState
          message={
            locale === "vi" ? "Hiện chưa có tài liệu." : "No documents available yet."
          }
        />
      ) : (
        <ContentGrid className="grid-cols-1 sm:grid-cols-2">
          {docs.map((doc) => (
            <LinkedDocumentCard key={doc.documentId} doc={doc} />
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