"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Blog } from "../model/blog.types";
import type { Locale } from "@/types/locale";
import BlogCard from "./BlogCard";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogListProps {
  initialBlogs: Blog[];
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
}

export default function BlogList({
  initialBlogs,
  locale,
  paginationMeta,
  currentPage,
}: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUpdateQuery = (newCategory?: string, newPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage) {
      params.set("page", newPage.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full col-span-full"
          >
            {initialBlogs.map((blog: Blog) => (
              <BlogCard key={blog.documentId} blog={blog} locale={locale} />
            ))}
          </motion.div>
        </AnimatePresence>
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
