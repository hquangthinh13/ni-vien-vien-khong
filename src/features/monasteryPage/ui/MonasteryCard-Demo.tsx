"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as motion from "framer-motion/client";
import { Vibrant } from "node-vibrant/browser";
import { Clock, MapPin, Info } from "lucide-react";
import { getImageUrl } from "@/shared/lib/api";
import { MonasteryAttributes } from "@/features/monasteryPage/model/monasteryPage.types";
import { Variants } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/shared/ui/dialog";

interface MonasteryCardProps {
  item: MonasteryAttributes;
  variants?: Variants;
}

const MonasteryCard = ({ item, variants }: MonasteryCardProps) => {
  const [colors, setColors] = useState({
    bgGradient: "#1a1a1a",
    accent: "#ffffff",
  });

  const imageUrl = getImageUrl(item.coverImage, "medium");

  useEffect(() => {
    if (!imageUrl) return;

    const extractColor = async () => {
      try {
        const v = new Vibrant(imageUrl);
        const palette = await v.getPalette();

        setColors({
          bgGradient: palette.DarkVibrant?.hex || "#1a1a1a",
          accent: palette.Vibrant?.hex || "#ffffff",
        });
      } catch (e) {
        console.warn("Vibrant error:", e);
      }
    };
    extractColor();
  }, [imageUrl]);

  return (
    <Dialog key={item.id || `${item.id}`}>
      <DialogTrigger asChild>
        <motion.div
          variants={variants}
          whileHover={{ y: -1 }}
          className="group relative aspect-video w-full max-w-xl odd:mr-auto even:ml-auto overflow-hidden rounded-xl shadow-lg border border-white/10 cursor-pointer"
        >
          <Image
            src={imageUrl || "/placeholder-monastery.jpg"}
            alt={item.monasteryName}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div
            className="absolute inset-0 transition-opacity duration-500 opacity-80 group-hover:opacity-100"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${colors.bgGradient}e6 60%, ${colors.bgGradient} 100%)`,
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2 text-white">
            {/* {item.openingHour && (
              <div className=" text-sm font-mono mb-auto inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-md border border-white/20">
                <Clock className="w-4 h-4" />
                <span>
                  {item.openingHour.slice(0, 5)} -{" "}
                  {item.closingHour?.slice(0, 5)}
                </span>
              </div>
            )} */}
            <h3 className="text-xl font-bold leading-tight drop-shadow-lg transition-colors">
              {item.monasteryName}
            </h3>
            <div className="flex flex-col gap-2 text-sm font-mono uppercase tracking-wider">
              <div className="inline-flex w-fit items-center gap-1.5 ">
                <MapPin className="w-4 h-4" />
                <span>{item.monasteryAddress}</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-all duration-500" />
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="">{item.monasteryName}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết và thời gian hoạt động
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={getImageUrl(item.coverImage) || "/placeholder-monastery.jpg"}
              alt={item.monasteryName}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {/* <h4 className="font-semibold flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                <Info className="w-4 h-4 text-primary" />
                Giới thiệu
              </h4> */}
              <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                {item.monasteryDescription}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t">
              <div className="inline-flex w-fit text-muted-foreground items-center gap-1.5 text-sm font-mono ">
                <MapPin className="w-4 h-4" />
                <span>{item.monasteryAddress}</span>
              </div>

              {item.openingHour && (
                <div className="inline-flex w-fit text-muted-foreground items-center gap-1.5 text-sm font-mono">
                  <Clock className="w-4 h-4" />
                  {item.openingHour.slice(0, 5)} -{" "}
                  {item.closingHour?.slice(0, 5)}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MonasteryCard;
