import type { LinkedDocumentCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { fetchLinkedDocumentsByCategory } from "../api/linkedDocument.api";
import LinkedDocumentCard from "./LinkedDocumentCard";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import EmptyState from "@/shared/layout/EmptyState";
import PageHeader from "@/shared/layout/PageHeader";
import PageShell from "@/shared/layout/PageShell";
import Pagination from "@/shared/layout/Pagination";
import ArchiveIntroRail from "@/shared/layout/archive/ArchiveIntroRail";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import DocumentArchiveList from "@/shared/layout/archive/DocumentArchiveList";

export interface LinkedDocumentArchiveConfig {
  category: LinkedDocumentCategory;
  title: Record<Locale, string>;
  eyebrow: Record<Locale, string>;
  description: Record<Locale, string>;
}

interface LinkedDocumentArchivePageProps {
  config: LinkedDocumentArchiveConfig;
  locale: Locale;
  currentPage: number;
}

export default async function LinkedDocumentArchivePage({
  config,
  locale,
  currentPage,
}: LinkedDocumentArchivePageProps) {
  const response = await fetchLinkedDocumentsByCategory({
    category: config.category,
    locale,
    pagination: { page: currentPage, pageSize: 12 },
    sort: ["title:asc"],
    populate: "*",
  });
  const documents = Array.isArray(response.data) ? response.data : [];
  const pagination = response.meta?.pagination;
  const total = pagination?.total ?? documents.length;
  const title = config.title[locale];

  return (
    <PageShell>
      <AppBreadcrumb
        locale={locale}
        items={[
          {
            label: locale === "vi" ? "Thư viện" : "Library",
            href: "/library",
          },
          { label: title },
        ]}
      />
      <PageHeader title={title} className="mb-10" />

      <ArchivePageLayout
        rail={
          <ArchiveIntroRail
            eyebrow={config.eyebrow[locale]}
            title={title}
            description={config.description[locale]}
            total={total}
            totalLabel={locale === "vi" ? "Tất cả tài liệu" : "All documents"}
          />
        }
      >
        <ArchiveResultsHeader
          title={title}
          total={total}
          countLabel={
            locale === "vi"
              ? "tài liệu"
              : total === 1
                ? "document"
                : "documents"
          }
        />

        <div className="mt-4">
          {documents.length > 0 ? (
            <DocumentArchiveList locale={locale}>
              {documents.map((document) => (
                <LinkedDocumentCard
                  key={document.documentId}
                  doc={document}
                  locale={locale}
                />
              ))}
            </DocumentArchiveList>
          ) : (
            <EmptyState
              message={
                locale === "vi"
                  ? "Hiện chưa có tài liệu."
                  : "No documents available yet."
              }
            />
          )}
        </div>

        {pagination ? (
          <Pagination
            currentPage={currentPage}
            pageCount={pagination.pageCount}
            locale={locale}
            className="mt-10 border-t border-border/80 pt-6"
          />
        ) : null}
      </ArchivePageLayout>
    </PageShell>
  );
}
