"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Vibrant } from "node-vibrant/browser";
import { getImageUrl } from "@/shared/lib/api";
import type { Calligraphy } from "../model/calligraphy.types";
import { motion } from "framer-motion";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";

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
      className="cursor-pointer relative aspect-3/4 w-full overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300 text-center"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={calligraphy.title || "Calligraphy Image"}
          fill
          className="object-contain transition-transform duration-300"
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR_DATA_URL}
        />
      )}

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-500 ease-in-out flex items-end p-4 text-white"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${colors.bgGradient}99 65%, ${colors.bgGradient} 80%)`,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center px-4 text-xl font-medium font-serif text-white"
        >
          {calligraphy.title}
        </motion.p>
      </div>
    </button>
  );
};

export default CalligraphyCard;
