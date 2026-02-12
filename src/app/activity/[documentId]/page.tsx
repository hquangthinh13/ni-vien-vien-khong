import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatFriendlyDate } from "@/shared/lib/utils";
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

import { Skeleton } from "@/shared/ui/skeleton";
import lineOrnament from "@/public/ornament-01.svg";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import RelatedActivities from "@/features/activity/ui/RelatedActivities";
import { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import { fetchActivityByDocumentId } from "@/features/activity/api/activity.api";
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

  // console.log("imageUrl", imageUrl);
  return (
    <div className="mx-auto max-w-10xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-7 prose prose-orange max-w-none text-justify leading-relaxed">
          <header className="flex flex-col items-start mb-6 space-y-2">
            {/* <div className="flex flex-1 w-full items-center justify-between mb-2"> */}
            <div className="flex justify-center items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>{data.category}</span>
            </div>
            {/* </div> */}
            <h1 className="text-2xl md:text-4xl text-left font-bold leading-tight">
              {data.title}
            </h1>
            {data.publishedAt && (
              <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                <span>
                  {data?.publishedAt
                    ? formatFriendlyDate(data.publishedAt, locale)
                    : ""}
                </span>
              </div>
            )}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Image
                src={imageUrl || "/placeholder.jpg"}
                alt={data.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
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
