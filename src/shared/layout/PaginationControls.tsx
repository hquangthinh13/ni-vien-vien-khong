"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/types/locale";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  pageCount: number;
  locale: Locale;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function PaginationControls({
  currentPage,
  pageCount,
  locale,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={locale === "vi" ? "Phân trang" : "Pagination"}
      className={cn("flex items-center justify-center gap-4", className)}
    >
      <Button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        size="icon"
        variant="outline"
        aria-label={locale === "vi" ? "Trang trước" : "Previous page"}
      >
        <ChevronLeft />
      </Button>
      <span className="font-mono text-xs text-muted-foreground">
        {locale === "vi" ? "Trang" : "Page"} {currentPage}
        {locale === "vi" ? " trên" : " of"} {pageCount}
      </span>
      <Button
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        size="icon"
        variant="outline"
        aria-label={locale === "vi" ? "Trang sau" : "Next page"}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
