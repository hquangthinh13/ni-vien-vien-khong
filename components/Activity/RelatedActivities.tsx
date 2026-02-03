"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ScrollText } from "lucide-react";
import { useLocale } from "next-intl";
import { formatFriendlyDate } from "@/lib/utils";

interface RelatedActivity {
  id: number;
  title: string;
  coverImage: string;
  date: string;
}

interface RelatedActivitiesProps {
  activities: RelatedActivity[];
}

const RelatedActivities = ({ activities }: RelatedActivitiesProps) => {
  const locale = useLocale();

  if (!activities || activities.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
        <ScrollText size={20} className="text-primary" /> Tin liên quan
      </h3>
      <div className="space-y-4">
        {activities.map((item) => (
          <Link
            key={item.id}
            href={`/activity/${item.id}`}
            className="group block"
          >
            <div className="flex gap-2 ">
              <div className="relative h-24 w-32 md:w-24 shrink-0 overflow-hidden rounded-md shadow-sm">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col justify-start flex-1 gap-1">
                <span className="flex text-[10px] md:text-xs text-muted-foreground items-center">
                  {formatFriendlyDate(item.date, locale)}
                </span>
                <h5 className="flex text-sm md:text-md font-bold line-clamp-3 group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedActivities;
