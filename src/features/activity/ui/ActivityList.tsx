"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Activity } from "../model/activity.types";
import type { ActivityCategory as ActivityCategoryType } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import ActivityCard from "./ActivityCard";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityListProps {
  initialActivities: Activity[];
  initialCategory: ActivityCategoryType | "all";
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
}

export default function ActivityList({
  initialActivities,
  initialCategory,
  locale,
  paginationMeta,
  currentPage,
}: ActivityListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reverseMapping: Record<string, string> = {
    "Phật Sự Trong Nước": "domestic",
    "Phật Sự Nước Ngoài": "international",
    "Lớp Học Phật Pháp": "dharma-class",
    "Tin Tức Khác": "others",
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
          className="flex flex-col h-auto items-center w-full"
        >
          <TabsList
            variant="line"
            className="flex flex-wrap h-auto! justify-center gap-y-3 gap-x-2 p-1"
          >
            <TabsTrigger
              className="cursor-pointer flex-none w-fit"
              value="Tất cả"
            >
              {locale === "vi" ? "Tất cả" : "All"}
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer flex-none w-fit"
              value="Phật Sự Trong Nước"
            >
              {locale === "vi" ? "Phật Sự Trong Nước" : "Domestic Activities"}
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer flex-none w-fit"
              value="Phật Sự Nước Ngoài"
            >
              {locale === "vi"
                ? "Phật Sự Nước Ngoài"
                : "International Activities"}
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer flex-none w-fit"
              value="Lớp Học Phật Pháp"
            >
              {locale === "vi" ? "Lớp Học Phật Pháp" : "Dharma Classes"}
            </TabsTrigger>

            <TabsTrigger
              className="cursor-pointer flex-none w-fit"
              value="Tin Tức Khác"
            >
              {locale === "vi" ? "Tin Tức Khác" : "Others"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {initialActivities.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={initialCategory + currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full col-span-full"
          >
            {initialActivities.map((activity: Activity) => (
              <ActivityCard
                key={activity.documentId}
                activity={activity}
                locale={locale}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 w-full text-center text-muted-foreground text-sm"
          >
            {locale === "vi" ? "Chưa có hoạt động." : "No results."}
          </motion.div>
        </AnimatePresence>
      )}

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
