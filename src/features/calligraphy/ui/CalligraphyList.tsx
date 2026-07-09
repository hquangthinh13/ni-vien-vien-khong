"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Calligraphy } from "../model/calligraphy.types";
import type { CalligraphyCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import CalligraphyCard from "./CalligraphyCard";
import CalligraphyDialog from "./CalligraphyDialog";
import { fetchCalligraphyByDocumentId } from "../api/calligraphy.api";
import ArchiveCategoryRail from "@/shared/layout/archive/ArchiveCategoryRail";
import ArchiveFilterSheet from "@/shared/layout/archive/ArchiveFilterSheet";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import EmptyState from "@/shared/layout/EmptyState";
import PaginationControls from "@/shared/layout/PaginationControls";

interface CalligraphyListProps {
  initialCalligraphies: Calligraphy[];
  initialCategory: CalligraphyCategory;
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
}

const CATEGORIES: CalligraphyCategory[] = [
  "Tất cả",
  "Kinh Pháp Cú",
  "Kinh Tụng",
  "Chủ Đề Khác",
];

const CATEGORY_SLUGS: Record<CalligraphyCategory, string> = {
  "Tất cả": "all",
  "Kinh Pháp Cú": "kinh-phap-cu",
  "Kinh Tụng": "kinh-tung",
  "Chủ Đề Khác": "chu-de-khac",
};

function getCategoryLabel(category: CalligraphyCategory, locale: Locale) {
  if (locale === "vi") return category;
  const labels: Record<CalligraphyCategory, string> = {
    "Tất cả": "All works",
    "Kinh Pháp Cú": "Dhammapada",
    "Kinh Tụng": "Chanting",
    "Chủ Đề Khác": "Other themes",
  };
  return labels[category];
}

export default function CalligraphyList({
  initialCalligraphies,
  initialCategory,
  locale,
  paginationMeta,
  currentPage,
}: CalligraphyListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCalligraphy, setSelectedCalligraphy] =
    useState<Calligraphy | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, Calligraphy>>(
    {},
  );
  const total = paginationMeta?.total ?? initialCalligraphies.length;
  const categoryItems = CATEGORIES.map((category) => ({
    value: category,
    label: getCategoryLabel(category, locale),
  }));

  const updateQuery = (category?: CalligraphyCategory, page?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", CATEGORY_SLUGS[category]);
      params.set("page", "1");
    }
    if (page) params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const initialMap = useMemo(
    () =>
      initialCalligraphies.reduce<Record<string, Calligraphy>>((map, item) => {
        map[item.documentId] = item;
        return map;
      }, {}),
    [initialCalligraphies],
  );

  const handleOpenCalligraphy = useCallback(
    async (documentId: string) => {
      setDialogOpen(true);
      const cached =
        detailCache[documentId] ||
        initialMap[documentId] ||
        selectedCalligraphy;
      if (cached) setSelectedCalligraphy(cached);
      if (detailCache[documentId]?.relatedCalligraphies?.length) return;

      try {
        setLoading(true);
        const response = await fetchCalligraphyByDocumentId({
          locale,
          documentId,
          fields: ["title", "description", "category", "documentId"],
          populate: ["coverImage", "relatedCalligraphies"],
        });
        const data = response?.data;
        if (data && !Array.isArray(data)) {
          setSelectedCalligraphy(data);
          setDetailCache((previous) => ({ ...previous, [documentId]: data }));
        }
      } catch (error) {
        console.error("Failed to fetch calligraphy detail:", error);
      } finally {
        setLoading(false);
      }
    },
    [detailCache, initialMap, locale, selectedCalligraphy],
  );

  const selectCategory = (category: CalligraphyCategory) => {
    updateQuery(category);
    setFilterOpen(false);
  };

  return (
    <div className="w-full">
      <ArchiveFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        side="right"
        triggerLabel={locale === "vi" ? "Bộ lọc" : "Filters"}
        title={locale === "vi" ? "Lọc tác phẩm" : "Filter works"}
        description={
          locale === "vi"
            ? "Chọn chủ đề thư pháp muốn xem."
            : "Choose a calligraphy theme."
        }
        summary={
          <p className="text-sm font-semibold text-primary">
            {getCategoryLabel(initialCategory, locale)}{" "}
            <span className="font-mono text-xs font-normal text-muted-foreground">
              ({total})
            </span>
          </p>
        }
      >
        <ArchiveCategoryRail
          label={locale === "vi" ? "Chủ đề" : "Themes"}
          items={categoryItems}
          activeValue={initialCategory}
          activeTotal={total}
          onSelect={selectCategory}
          compact
        />
      </ArchiveFilterSheet>

      <ArchivePageLayout
        railClassName="hidden lg:block"
        rail={
          <ArchiveCategoryRail
            label={locale === "vi" ? "Chủ đề" : "Themes"}
            items={categoryItems}
            activeValue={initialCategory}
            activeTotal={total}
            onSelect={updateQuery}
          />
        }
      >
        <div className="hidden lg:block">
          <ArchiveResultsHeader
            title={getCategoryLabel(initialCategory, locale)}
            total={total}
            countLabel={
              locale === "vi" ? "tác phẩm" : total === 1 ? "work" : "works"
            }
          />
        </div>

        <div className="mt-6">
          {initialCalligraphies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {initialCalligraphies.map((item) => (
                <div key={item.documentId} className="group">
                  <CalligraphyCard
                    calligraphy={item}
                    onClick={() => handleOpenCalligraphy(item.documentId)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message={
                locale === "vi"
                  ? "Không tìm thấy tác phẩm nào."
                  : "No calligraphy found."
              }
            />
          )}
        </div>

        {paginationMeta ? (
          <PaginationControls
            currentPage={currentPage}
            pageCount={paginationMeta.pageCount}
            locale={locale}
            onPageChange={(page) => updateQuery(undefined, page)}
            className="mt-10 border-t border-border/80 pt-6"
          />
        ) : null}
      </ArchivePageLayout>

      <CalligraphyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        calligraphy={selectedCalligraphy}
        loading={loading}
        onSelectRelated={handleOpenCalligraphy}
      />
    </div>
  );
}
