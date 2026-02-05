import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatFriendlyDate } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";

import {
  CalendarDays,
  PlayCircle,
  LayoutGrid,
  Clock,
  ChevronRight,
  ExternalLink,
  Tag,
} from "lucide-react";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import { Skeleton } from "@/components/ui/skeleton";
import lineOrnament from "@/public/ornament-01.svg";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import RelatedActivities from "@/components/Activity/RelatedActivities";
import { Activity } from "@/components/Activity/Activity.type";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import { fetchActivityByDocumentId } from "@/components/Activity/Activity.service";
import { getStrapiURL } from "@/lib/api";
export default async function ActivityPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { documentId } = await params;
  const response = await fetchActivityByDocumentId({
    locale,
    documentId: documentId,
    populate: "*",
  });

  if (!response || !response.data) return null;

  const data = response.data as Activity;

  const imageUrl = getImageUrl(data.coverImage);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-7 prose prose-orange max-w-none text-justify leading-relaxed">
          <header className="flex flex-col items-start mb-6 space-y-3">
            <h1 className="text-2xl md:text-4xl text-left font-bold leading-tight mb-2!">
              {data.title}
            </h1>
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                <Tag size={14} />
                <span>{data.category}</span>
              </div>{" "}
              {/* {data.isEvent && data.activityDate && (
                <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                  <CalendarDays size={18} className="text-primary" />
                  <span>
                    {data?.activityDate
                      ? formatFriendlyDate(data.activityDate, locale)
                      : ""}
                  </span>
                </div>
              )} */}
              {data.publishedAt && (
                <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                  {/* <CalendarDays size={18} className="text-primary" /> */}
                  <span>
                    {data?.publishedAt
                      ? formatFriendlyDate(data.publishedAt, locale)
                      : ""}
                  </span>
                </div>
              )}
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Image
                src={imageUrl || "/placeholder.jpg"}
                alt={data.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>
          <div className="opacity-80 flex w-full justify-center my-10">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
          {data.content && <RichTextRenderer content={data.content} />}{" "}
        </div>

        <aside className="lg:col-span-3 space-y-8">
          <RelatedActivities activities={data.relatedActivities || []} />
        </aside>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex w-full px-4 py-10 mx-auto max-w-6xl">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* LEFT COLUMN — 7/10 */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Header block */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-between w-full">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Banner */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Content block */}
          <div className="space-y-6 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />

            {/* Mid image */}
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>

        {/* RIGHT COLUMN — 3/10 */}
        <aside className="lg:col-span-3 flex flex-col gap-8">
          {/* Gallery block */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />

            <div className="grid grid-cols-1 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
