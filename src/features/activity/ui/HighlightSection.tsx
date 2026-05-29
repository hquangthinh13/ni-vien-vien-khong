"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { LayoutGrid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StrapiImageEntity } from "@/types/strapi";
import { getImageUrl } from "@/shared/lib/api";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import { Button } from "@/shared/ui/button";
import type { Locale } from "@/types/locale";

const HighlightSection = ({
  images = [],
  locale,
}: {
  images: StrapiImageEntity[];
  locale: Locale;
}) => {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (index !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [index]);
  const displayImages = images.slice(0, 6);
  const hasMore = images.length > 6;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    if (index !== null) setIndex((index + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    if (index !== null) setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-bold text-lg uppercase tracking-wider flex items-center gap-2">
          <LayoutGrid size={20} className="text-primary" />{" "}
          {locale === "vi" ? "Ảnh nổi bật" : "Highlights"}
        </span>
        {images.length > 0 && (
          <span className="text-xs text-muted-foreground font-medium font-mono uppercase tracking-widest">
            {images.length} {locale === "vi" ? "ảnh" : "photos"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {displayImages.map((img, idx) => {
          const isLastVisible = idx === 5 && hasMore;

          return (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-lg border border-border group cursor-pointer"
              onClick={() => setIndex(idx)}
            >
              <Image
                src={getImageUrl(img, "medium") || "/placeholder.png"}
                alt={`Highlight ${idx}`}
                fill
                className="object-cover grayscale-100 hover:grayscale-0 transition-all duration-500"
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
              />

              {isLastVisible && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-primary-foreground transition-colors group-hover:bg-black/40">
                  <span className="text-md font-sans">
                    +{images.length - 6}
                  </span>
                  <span className="text-xs font-sans font-light">
                    {locale === "vi" ? "Xem tất cả" : "View all"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {index !== null &&
        typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {index !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-500 bg-black/55 backdrop-blur flex items-center justify-center p-4 md:p-10"
                onClick={() => setIndex(null)}
              >
                <Button
                  size="icon-lg"
                  variant="ghost"
                  className="absolute rounded-full top-6 right-6 z-110 hover:cursor-pointer"
                  onClick={() => setIndex(null)}
                >
                  <X />
                </Button>

                <Button
                  size="icon-lg"
                  className="absolute left-4 md:left-16 p-3 rounded-full z-110 hover:cursor-pointer"
                  onClick={prevImage}
                >
                  <ChevronLeft />
                </Button>

                <Button
                  size="icon-lg"
                  className="absolute right-4 md:right-16 rounded-full z-110 hover:cursor-pointer"
                  onClick={nextImage}
                >
                  <ChevronRight />
                </Button>

                <motion.div
                  key={index}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-full h-full max-w-5xl max-h-[80vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={
                      getImageUrl(images[index], "large") || "/placeholder.png"
                    }
                    alt="Fullscreen view"
                    fill
                    className="object-contain"
                    priority
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                  />

                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground text-sm font-sans font-light tracking-wide ">
                    {index + 1} / {images.length}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
};

export default HighlightSection;
