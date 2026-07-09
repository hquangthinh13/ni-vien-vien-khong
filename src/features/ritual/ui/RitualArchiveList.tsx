import type { Ritual } from "../model/ritual.types";
import type { Locale } from "@/types/locale";
import ArchiveIntroRail from "@/shared/layout/archive/ArchiveIntroRail";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import DocumentArchiveList from "@/shared/layout/archive/DocumentArchiveList";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

interface RitualArchiveListProps {
  rituals: Ritual[];
  locale: Locale;
  currentPage: number;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export default function RitualArchiveList({
  rituals,
  locale,
  currentPage,
  paginationMeta,
}: RitualArchiveListProps) {
  const total = paginationMeta?.total ?? rituals.length;

  return (
    <ArchivePageLayout
      rail={
        <ArchiveIntroRail
          eyebrow={locale === "vi" ? "Nghi lễ" : "Ritual practice"}
          title={locale === "vi" ? "Nghi thức nghi lễ" : "Rituals and ceremonies"}
          description={
            locale === "vi"
              ? "Các nghi thức và hướng dẫn thực hành được lưu giữ để thuận tiện tra cứu."
              : "Ritual texts and practice guidance preserved for easy reference."
          }
          total={total}
          totalLabel={locale === "vi" ? "Tất cả nghi thức" : "All rituals"}
        />
      }
    >
      <ArchiveResultsHeader
        title={locale === "vi" ? "Danh mục nghi thức" : "Ritual collection"}
        total={total}
        countLabel={
          locale === "vi" ? "nghi thức" : total === 1 ? "ritual" : "rituals"
        }
      />

      <div className="mt-4">
        {rituals.length > 0 ? (
          <DocumentArchiveList
            locale={locale}
            items={rituals.map((ritual) => ({
              key: ritual.documentId,
              href: `/library/ritual/${ritual.documentId}`,
              title: ritual.title,
              date: ritual.publishedAt || ritual.createdAt,
              meta: locale === "vi" ? "Nghi thức" : "Ritual",
            }))}
          />
        ) : (
          <EmptyState
            message={
              locale === "vi"
                ? "Hiện chưa có nghi thức nào."
                : "No ritual documents available yet."
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
