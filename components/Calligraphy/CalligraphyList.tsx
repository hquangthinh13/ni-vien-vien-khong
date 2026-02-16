"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { X, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { fetchCalligraphiesByCategory } from "./Calligraphy.service";
import { getImageUrl } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Calligraphy } from "./Calligraphy.type";
import type { CalligraphyCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";

interface CalligraphyListProps {
  initialCalligraphies: Calligraphy[];
  initialCategory: CalligraphyCategory;
  locale: Locale;
}

export default function CalligraphyList({
  initialCalligraphies,
  initialCategory,
  locale,
}: CalligraphyListProps) {
  // --- State ---
  const [items, setItems] = useState<Calligraphy[]>(initialCalligraphies);
  const [category, setCategory] =
    useState<CalligraphyCategory>(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Calligraphy | null>(null);

  const { ref, inView } = useInView();

  // --- Fetching Logic ---
  const handleTabChange = async (value: string) => {
    const newCategory = value as CalligraphyCategory;
    setCategory(newCategory);
    setLoading(true);
    try {
      const res = await fetchCalligraphiesByCategory({
        locale,
        category: newCategory,
        pagination: { page: 1, pageSize: 12 },
        populate: "*",
      });

      const newData = Array.isArray(res.data) ? res.data : [];
      setItems(newData);
      setPage(1);
      setHasMore(newData.length >= 12);
    } catch (error) {
      console.error("Failed to change category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const loadMore = async () => {
        setLoading(true);
        const nextPage = page + 1;
        try {
          const res = await fetchCalligraphiesByCategory({
            locale,
            category,
            pagination: { page: nextPage, pageSize: 12 },
            populate: "*",
          });

          const newData = Array.isArray(res.data) ? res.data : [];
          if (newData.length === 0) {
            setHasMore(false);
          } else {
            setItems((prev) => [...prev, ...newData]);
            setPage(nextPage);
            setHasMore(newData.length === 12);
          }
        } catch (error) {
          console.error("Failed to load more:", error);
        } finally {
          setLoading(false);
        }
      };
      loadMore();
    }
  }, [inView, hasMore, loading, category, page, locale]);
  const currentIndex = items.findIndex(
    (i) => i.documentId === selectedItem?.documentId,
  );

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== -1 && items.length > 1) {
      const nextIndex = (currentIndex + 1) % items.length;
      setSelectedItem(items[nextIndex]);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== -1 && items.length > 1) {
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      setSelectedItem(items[prevIndex]);
    }
  };
  return (
    <div className="w-full flex flex-col items-center">
      {/* Category Tabs */}
      <div className="flex w-full justify-center mb-10">
        <Tabs
          defaultValue={initialCategory}
          onValueChange={handleTabChange}
          className="w-full flex flex-col items-center"
        >
          <TabsList variant="line" className="flex-wrap justify-center h-auto">
            <TabsTrigger value="Kinh Pháp Cú">Kinh Pháp Cú</TabsTrigger>
            <TabsTrigger value="Kinh Tụng">Kinh Tụng</TabsTrigger>
            <TabsTrigger value="Chủ Đề Khác">Chủ Đề Khác</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full max-w-10xl">
        {" "}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div
                layoutId={item.documentId}
                key={item.documentId}
                className="relative aspect-3/4 min-w-64 overflow-hidden rounded-xl border group cursor-pointer bg-muted shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setSelectedItem(item)}
              >
                <Image
                  src={
                    getImageUrl(item.coverImage, "medium") || "/placeholder.jpg"
                  }
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium truncate w-full">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="w-full py-20 text-center text-muted-foreground">
              Không tìm thấy tác phẩm nào.
            </div>
          )
        )}
        {/* Loading state indicator */}
        {loading && (
          <div className="w-full py-10 flex justify-center">
            <div className="animate-pulse text-sm text-muted-foreground">
              Đang tải...
            </div>
          </div>
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-20 w-full" />
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-accent transition-colors z-70"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 text-foreground hover:bg-primary/20 transition-all z-[70]"
              onClick={handlePrev}
            >
              <ChevronLeft size={30} />
            </button>

            <button
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 text-foreground hover:bg-primary/20 transition-all z-[70]"
              onClick={handleNext}
            >
              <ChevronRight size={30} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card border shadow-2xl rounded-2xl w-full max-w-10xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 aspect-square relative bg-black/5 flex items-center justify-center min-h-[300px] md:min-h-0 overflow-hidden">
                <Image
                  src={
                    getImageUrl(selectedItem.coverImage, "large") ||
                    "/placeholder.jpg"
                  }
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Content Side */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col">
                <div className="mb-6">
                  <div className="inline-block text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    {selectedItem.category}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedItem.title}
                  </h2>

                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                    {selectedItem.description ||
                      "Chưa có mô tả cho tác phẩm này."}
                  </div>
                </div>

                {selectedItem.relatedCalligraphies &&
                  selectedItem.relatedCalligraphies.length > 0 && (
                    <div className="mt-auto pt-6 border-t">
                      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3 text-primary">
                        <LayoutGrid size={14} /> Tác phẩm liên quan
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.relatedCalligraphies.map((related) => (
                          <button
                            key={related.documentId}
                            onClick={() => setSelectedItem(related)}
                            className="px-3 py-1.5 text-xs cursor-pointer font-medium border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors truncate max-w-[200px]"
                          >
                            {related.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
