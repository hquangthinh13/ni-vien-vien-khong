import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { Locale } from "@/types/locale";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  locale: Locale;
  className?: string;
}

export default function Pagination({
  currentPage,
  pageCount,
  locale,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className={["mt-6 flex justify-center gap-4", className].join(" ")}>
      {currentPage > 1 ? (
        <Link href={`?page=${currentPage - 1}`}>
          <Button size="icon" variant="outline" className="cursor-pointer">
            <ChevronLeft />
          </Button>
        </Link>
      ) : (
        <Button size="icon" variant="outline" disabled>
          <ChevronLeft />
        </Button>
      )}

      <span className="flex items-center text-sm text-muted-foreground">
        {locale === "vi"
          ? `Trang ${currentPage} trên ${pageCount}`
          : `Page ${currentPage} of ${pageCount}`}
      </span>

      {currentPage < pageCount ? (
        <Link href={`?page=${currentPage + 1}`}>
          <Button size="icon" variant="outline" className="cursor-pointer">
            <ChevronRight />
          </Button>
        </Link>
      ) : (
        <Button size="icon" variant="outline" disabled>
          <ChevronRight />
        </Button>
      )}
    </div>
  );
}
