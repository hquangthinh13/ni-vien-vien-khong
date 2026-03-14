"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { Calligraphy } from "../model/calligraphy.types";
import type { CalligraphyCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import CalligraphyCard from "./CalligraphyCard";
import CalligraphyDialog from "./CalligraphyDialog";
import { fetchCalligraphyByDocumentId } from "../api/calligraphy.api";

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

export default function CalligraphyList({
  initialCalligraphies,
  initialCategory,
  locale,
  paginationMeta,
  currentPage,
}: CalligraphyListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCalligraphy, setSelectedCalligraphy] =
    useState<Calligraphy | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, Calligraphy>>(
    {},
  );

  const reverseMapping: Record<string, string> = {
    "Kinh Pháp Cú": "kinh-phap-cu",
    "Kinh Tụng": "kinh-tung",
    "Chủ Đề Khác": "chu-de-khac",
    "Tất cả": "all",
  };

  const handleUpdateQuery = (
    newCategory?: string,
    newPage?: number,
    newYear?: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory) {
      params.set("category", reverseMapping[newCategory] || "all");
      params.set("page", "1");
    }
    if (newYear) {
      if (newYear === "all") params.delete("year");
      else params.set("year", newYear);
      params.set("page", "1");
    }
    if (newPage) {
      params.set("page", newPage.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const initialMap = useMemo(() => {
    return initialCalligraphies.reduce<Record<string, Calligraphy>>(
      (acc, item) => {
        acc[item.documentId] = item;
        return acc;
      },
      {},
    );
  }, [initialCalligraphies]);

  const handleOpenCalligraphy = useCallback(
    async (documentId: string) => {
      setOpen(true);

      const cached =
        detailCache[documentId] ||
        initialMap[documentId] ||
        selectedCalligraphy;

      if (cached) {
        setSelectedCalligraphy(cached);
      }

      if (detailCache[documentId]?.relatedCalligraphies?.length) {
        return;
      }

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
          setDetailCache((prev) => ({
            ...prev,
            [documentId]: data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch calligraphy detail:", error);
      } finally {
        setLoading(false);
      }
    },
    [detailCache, initialMap, locale, selectedCalligraphy],
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-full justify-center mb-10">
        <Tabs
          value={initialCategory}
          onValueChange={(val) => handleUpdateQuery(val)}
          className="w-full flex flex-col items-center"
        >
          <TabsList variant="line" className="flex-wrap justify-center h-auto">
            <TabsTrigger value="Tất cả">Tất cả</TabsTrigger>
            <TabsTrigger value="Kinh Pháp Cú">Kinh Pháp Cú</TabsTrigger>
            <TabsTrigger value="Kinh Tụng">Kinh Tụng</TabsTrigger>
            <TabsTrigger value="Chủ Đề Khác">Chủ Đề Khác</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full max-w-7xl">
        {initialCalligraphies && initialCalligraphies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="w-full py-20 text-center text-muted-foreground">
            Không tìm thấy tác phẩm nào.
          </div>
        )}
      </div>

      {paginationMeta && paginationMeta.pageCount > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            disabled={currentPage <= 1}
            onClick={() => handleUpdateQuery(undefined, currentPage - 1)}
            size="icon-lg"
            variant="outline"
            className="cursor-pointer"
          >
            <ChevronLeft />
          </Button>

          <span className="flex items-center text-muted-foreground text-sm">
            {locale === "vi" ? "Trang" : "Page"} {currentPage}{" "}
            {locale === "vi" ? "trên" : "of"} {paginationMeta.pageCount}
          </span>

          <Button
            disabled={currentPage >= paginationMeta.pageCount}
            onClick={() => handleUpdateQuery(undefined, currentPage + 1)}
            className="cursor-pointer"
            size="icon-lg"
            variant="outline"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <CalligraphyDialog
        open={open}
        onOpenChange={setOpen}
        calligraphy={selectedCalligraphy}
        loading={loading}
        onSelectRelated={handleOpenCalligraphy}
      />
    </div>
  );
}
