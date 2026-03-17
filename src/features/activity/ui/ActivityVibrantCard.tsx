"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Vibrant } from "node-vibrant/browser";
import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import DateCard from "@/shared/layout/DateCard";

interface ActivityVibrantCardProps {
  activity: Activity;
  locale: Locale;
}

const ActivityVibrantCard = ({
  activity,
  locale,
}: ActivityVibrantCardProps) => {
  const [colors, setColors] = useState({
    bgGradient: "#1a1a1a",
    calendarHeader: "#1a1a1a",
  });

  const imageUrl = getImageUrl(activity?.coverImage, "medium");

  useEffect(() => {
    if (!imageUrl) return;

    const extractColor = async () => {
      try {
        const v = new Vibrant(imageUrl);
        const palette = await v.getPalette();

        setColors({
          bgGradient: palette.DarkVibrant?.hex || "#1a1a1a",
          calendarHeader:
            palette.Vibrant?.hex || palette.Muted?.hex || "#1a1a1a",
        });
      } catch (e) {
        console.warn("Vibrant error:", e);
      }
    };
    extractColor();
  }, [imageUrl]);

  return (
    <Link
      href={`/activity/${activity.slug}-${activity.documentId}`}
      className="group block"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:scale-[1.01]">
        {imageUrl && (
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={activity.activityName}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
          />
        )}

        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${colors.bgGradient}99 50%, ${colors.bgGradient} 95%)`,
          }}
        />

        <div className="absolute h-fit mt-auto inset-0 flex flex-row gap-4 justify-start p-4 text-white">
          <div className="flex items-start">
            <DateCard
              dateISO={activity.activityStartDate}
              locale={locale}
              headerColor={colors.calendarHeader}
            />
          </div>{" "}
          <div className="flex flex-col items-start justify-end">
            {activity.activityCategory != "Khóa Tu" ? (
              <span className="font-mono font-normal text-xs uppercase tracking-widest opacity-100 ">
                {activity.activityCategory}
              </span>
            ) : (
              <span className="font-mono font-normal text-xs uppercase tracking-widest opacity-100 ">
                {activity.courseContent?.courseCategory}
              </span>
            )}
            <h3 className="pr-0 text-md font-bold drop-shadow-2xl line-clamp-2 ">
              {activity.activityName}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityVibrantCard;
