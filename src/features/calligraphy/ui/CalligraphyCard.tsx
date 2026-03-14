"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Vibrant } from "node-vibrant/browser";
import { getImageUrl } from "@/shared/lib/api";
import type { Calligraphy } from "../model/calligraphy.types";
import { motion } from "framer-motion";

interface CalligraphyCardProps {
  calligraphy: Calligraphy;
  onClick: () => void;
}

const CalligraphyCard = ({ calligraphy, onClick }: CalligraphyCardProps) => {
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
    <button
      onClick={onClick}
      className="cursor-pointer relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-[1.01] text-left"
    >
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
    </button>
  );
};

export default CalligraphyCard;
