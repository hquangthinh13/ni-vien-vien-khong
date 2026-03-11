"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { Calligraphy } from "../model/calligraphy.types";
import type { CalligraphyCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import CalligraphyCard from "./CalligraphyCard";
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {initialCalligraphies.map((item) => (
              <CalligraphyCard key={item.documentId} calligraphy={item} />
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
    </div>
  );
}
