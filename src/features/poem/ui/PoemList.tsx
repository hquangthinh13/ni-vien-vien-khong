import type { Poem } from "@/features/poem/model/poem.types";
import type { Locale } from "@/types/locale";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";
import ArchiveIntroRail from "@/shared/layout/archive/ArchiveIntroRail";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import PoemEditorialGrid from "./poem-list/PoemEditorialGrid";

interface PoemListProps {
  poems: Poem[];
  locale: Locale;
  currentPage: number;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export default function PoemList({
  poems,
  locale,
  currentPage,
  paginationMeta,
}: PoemListProps) {
  const total = paginationMeta?.total ?? poems.length;

  return (
    <ArchivePageLayout
      rail={
        <ArchiveIntroRail
          eyebrow={locale === "vi" ? "Tuyển tập" : "Collection"}
          title={locale === "vi" ? "Thơ thiền" : "Zen poetry"}
          description={
            locale === "vi"
              ? "Những vần thơ nuôi dưỡng sự tĩnh lặng, chánh niệm và lòng từ."
              : "Verses that nurture stillness, mindfulness, and compassion."
          }
          total={total}
          totalLabel={locale === "vi" ? "Tất cả tác phẩm" : "All works"}
        />
      }
    >
      <ArchiveResultsHeader
        title={locale === "vi" ? "Các bài thơ" : "Poem collection"}
        total={total}
        countLabel={
          locale === "vi" ? "bài thơ" : total === 1 ? "poem" : "poems"
        }
      />

        <div className="mt-6">
          {poems.length > 0 ? (
            <PoemEditorialGrid poems={poems} locale={locale} />
          ) : (
            <EmptyState
              message={
                locale === "vi"
                  ? "Hiện chưa có bài thơ nào."
                  : "No poems available yet."
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
