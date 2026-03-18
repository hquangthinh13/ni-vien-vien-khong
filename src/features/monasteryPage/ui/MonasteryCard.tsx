"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { getImageUrl } from "@/shared/lib/api";
import { MonasteryAttributes } from "@/features/monasteryPage/model/monasteryPage.types";
import { motion } from "framer-motion";
import { Vibrant } from "node-vibrant/browser";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface MonasteryCardProps {
  item: MonasteryAttributes;
  index: number;
}

const MonasteryCard = ({ item, index }: MonasteryCardProps) => {
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const imageUrl = getImageUrl(item.coverImage, "medium");

  const isEven = index % 2 !== 0;

  useEffect(() => {
    if (imageUrl) {
      Vibrant.from(imageUrl)
        .getPalette()
        .then((palette) => {
          setAccentColor(
            palette.Vibrant?.hex || palette.Muted?.hex || "#8b5cf6",
          );
        });
    }
  }, [imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.3,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group w-full"
    >
      <div
        className={`
        flex flex-col gap-8 items-center
        lg:flex-row ${isEven ? "lg:flex-row-reverse" : ""}
      `}
      >
        <div className="w-full lg:w-1/2">
          <div className="max-w-xl md:max-w-4xl relative aspect-video w-full overflow-hidden rounded-xl shadow-lg transition-shadow group-hover:shadow-xl ease-in-out duration-300 border border-white/10">
            <Zoom zoomMargin={80}>
              <Image
                src={imageUrl || "/placeholder.png"}
                alt={item.monasteryName}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />
            </Zoom>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </div>

        <div
          className={`
          flex flex-col w-full lg:w-1/2 gap-4
          text-center ${isEven ? "lg:text-right " : "lg:text-left"}
        `}
        >
          <div className="space-y-3">
            <h3
              className="text-2xl lg:text-3xl font-bold leading-tight font-serif"
              style={{ color: accentColor }}
            >
              {item.monasteryName}
            </h3>

            <p className="text-secondary-foreground text-md lg:text-lg leading-relaxed">
              {item.monasteryDescription}
            </p>
          </div>

          <div
            className={`
            flex flex-col gap-3 pt-6 border-t border-border/50
            items-center ${isEven ? "lg:items-end" : "lg:items-start"}
          `}
          >
            <div className="flex items-center font-mono gap-2 text-sm font-medium text-muted-foreground">
              <div
                className="p-1.5 rounded-full bg-secondary"
                style={{ color: accentColor }}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <span>{item.monasteryAddress}</span>
            </div>

            {item.openingHour && (
              <div className="flex items-center font-mono  gap-2 text-sm font-medium text-muted-foreground">
                <div
                  className="p-1.5 rounded-full bg-secondary"
                  style={{ color: accentColor }}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <span>
                  {item.openingHour.slice(0, 5)} —{" "}
                  {item.closingHour?.slice(0, 5)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonasteryCard;
