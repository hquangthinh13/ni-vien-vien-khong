"use client";
import { Vibrant } from "node-vibrant/browser";
import React, { useEffect, useState } from "react";
import { Badge } from "@/shared/ui/badge";
interface ActivityVibrantBadgeProps {
  displayCategory: string;
  imageUrl: string | null;
}

const ActivityVibrantBadge = ({
  displayCategory,
  imageUrl,
}: ActivityVibrantBadgeProps) => {
  const [colors, setColors] = useState({
    dark: "#1a1a1a",
    vibrant: "#1a1a1a",
  });

  useEffect(() => {
    if (!imageUrl) return;

    const extractColor = async () => {
      try {
        const v = new Vibrant(imageUrl);
        const palette = await v.getPalette();

        setColors({
          dark: palette.DarkVibrant?.hex || "#1a1a1a",
          vibrant: palette.Vibrant?.hex || palette.Muted?.hex || "#1a1a1a",
        });
      } catch (e) {
        console.warn("Vibrant error:", e);
      }
    };
    extractColor();
  }, [imageUrl]);

  return (
    <Badge
      variant="default"
      className="font-mono"
      style={{ backgroundColor: colors.vibrant }}
    >
      <span className="bg-white w-1.5 aspect-square rounded-full mr-0.5" />{" "}
      {displayCategory}
    </Badge>
  );
};

export default ActivityVibrantBadge;
