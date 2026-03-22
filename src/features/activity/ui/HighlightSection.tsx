"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LayoutGrid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StrapiImageEntity } from "@/types/strapi";
import { getImageUrl } from "@/shared/lib/api";
const HighlightSection = ({ images = [] }: { images: StrapiImageEntity[] }) => {
  const [index, setIndex] = useState<number | null>(null);

  const displayImages = images.slice(0, 4);
  const hasMore = images.length > 4;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) setIndex((index + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-bold text-lg uppercase tracking-wider flex items-center gap-2">
          <LayoutGrid size={20} className="text-primary" /> Ảnh nổi bật
        </span>
        {images.length > 0 && (
          <span className="text-xs text-muted-foreground font-medium font-mono uppercase tracking-widest">
            {images.length} hình ảnh
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {displayImages.map((img, idx) => {
          const isLastVisible = idx === 3 && hasMore;

          return (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-lg border group cursor-pointer"
              onClick={() => setIndex(idx)}
            >
              <Image
                src={getImageUrl(img, "medium") || "/placeholder.png"}
                alt={`Highlight ${idx}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />

              {isLastVisible && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/40">
                  <span className="text-md font-mono font-bold">
                    +{images.length - 3}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest font-normal">
                    Xem tất cả
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-110 hover:cursor-pointer"
              onClick={() => setIndex(null)}
            >
              <X size={32} />
            </button>

            <button
              className="absolute left-4 md:left-16 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-110 hover:cursor-pointer"
              onClick={prevImage}
            >
              <ChevronLeft size={30} />
            </button>

            <button
              className="absolute right-4 md:right-16 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-110 hover:cursor-pointer"
              onClick={nextImage}
            >
              <ChevronRight size={30} />
            </button>

            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImageUrl(images[index], "large") || "/placeholder.png"}
                alt="Fullscreen view"
                fill
                className="object-contain"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-normal font-mono">
                {index + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HighlightSection;
