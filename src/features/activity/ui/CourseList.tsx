"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Activity } from "../model/activity.types";
import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import ActivityVibrantCard from "./ActivityVibrantCard";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityListProps {
  initialCourses: Activity[];
  initialCategory: CourseCategory | "Tất cả";
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
}

export default function CourseList({
  initialCourses,
  initialCategory,
  locale,
  paginationMeta,
  currentPage,
}: ActivityListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reverseMapping: Record<string, string> = {
    "Khóa Tu Mùa Hè": "mua-he",
    "Khóa Tu Xuất Gia Gieo Duyên": "xuat-gia-gieo-duyen",
    "Khóa Thiền": "thien",
    "Tất cả": "all",
  };

  const handleUpdateQuery = (newCategory?: string, newPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory) {
      params.set("category", reverseMapping[newCategory] || "all");
      params.set("page", "1");
    }
    if (newPage) {
      params.set("page", newPage.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex w-full justify-center items-center h-auto mb-6">
        <Tabs
          value={initialCategory}
          onValueChange={(val) => handleUpdateQuery(val)}
          className=" flex flex-col h-auto items-center"
        >
          <TabsList
            variant="line"
            className="flex flex-wrap h-auto! justify-center gap-y-3 gap-x-2 p-1"
          >
            <TabsTrigger
              className="cursor-pointer shrink-0 w-fit"
              value="Tất cả"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer shrink-0 w-fit "
              value="Khóa Tu Mùa Hè"
            >
              Khóa Tu Mùa Hè
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer shrink-0 w-fit"
              value="Khóa Tu Xuất Gia Gieo Duyên"
            >
              Khóa Tu Xuất Gia Gieo Duyên
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer shrink-0 w-fit"
              value="Khóa Thiền"
            >
              Khóa Thiền
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={initialCategory + currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full col-span-full"
          >
            {initialCourses.map((activity: Activity) => (
              <ActivityVibrantCard
                key={activity.documentId}
                activity={activity}
                locale={locale}
              />
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
