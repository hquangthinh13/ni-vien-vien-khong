"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Vibrant } from "node-vibrant/browser";
import { getImageUrl } from "@/shared/lib/api";
import type { Calligraphy } from "../model/calligraphy.types";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/shared/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
interface CalligraphyCardProps {
  calligraphy: Calligraphy;
}

const CalligraphyCard = ({ calligraphy }: CalligraphyCardProps) => {
  const [colors, setColors] = useState({
    bgGradient: "#1a1a1a80",
  });

  const imageUrl = getImageUrl(calligraphy?.coverImage, "medium");

  useEffect(() => {
    if (!imageUrl) return;

    const extractColor = async () => {
      try {
        const v = new Vibrant(imageUrl);
        const palette = await v.getPalette();

        setColors({
          bgGradient: palette.DarkVibrant?.hex || "#1a1a1aCC",
        });
      } catch (e) {
        console.warn("Vibrant error:", e);
      }
    };
    extractColor();
  }, [imageUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-[1.01]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={calligraphy.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
            />
          )}

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-end p-4 text-white"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${colors.bgGradient}99 65%, ${colors.bgGradient} 80%)`,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="pr-4 text-lg font-medium text-white"
            >
              {calligraphy.title}
            </motion.p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={calligraphy.documentId}
        className="border-none max-h-[90vh] min-h-[70vh] overflow-y-auto md:min-w-2xl lg:min-w-4xl max-w-7xl p-4 overflow-hidden"
      >
        <VisuallyHidden.Root>
          <DialogTitle> {calligraphy.title}</DialogTitle>
          <DialogDescription>{calligraphy.category}</DialogDescription>
        </VisuallyHidden.Root>

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="flex relative aspect-3/4 h-full overflow-hidden bg-muted shadow-sm">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={calligraphy.title}
                fill
                className="object-contain"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />
            )}{" "}
          </div>

          <div className="flex h-full flex-1 flex-col gap-2 py-4">
            <p className="text-sm font-mono uppercase text-primary  font-semibold tracking-wider">
              {calligraphy.category}
            </p>
            <h2 className="text-xl text-secondary-foreground font-bold ">
              {calligraphy.title}
            </h2>
            <p className="text-base  text-secondary-foreground/90 leading-relaxed whitespace-pre-wrap mt-4 italic">
              {calligraphy.description}
            </p>

            <span className="text-sm uppercase font-mono font-semibold tracking-wider text-secondary-foreground/80 mt-auto pt-4 border-t">
              Liên quan
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalligraphyCard;
