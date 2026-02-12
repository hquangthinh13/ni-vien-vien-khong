import React from "react";
import { Clock, CalendarDays, Info } from "lucide-react";
import { IntroductionPageAttributes } from "../model/introductionPage.types";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { formatTimeShort, parseTimeToDecimal } from "@/shared/lib/utils";
import { getImageUrl } from "@/lib/api";
import Image from "next/image";
const HOUR_WIDTH = 64;

const IntroTimelineView = ({ data }: { data: IntroductionPageAttributes }) => {
  const { title, content, useTemplate, activities, coverImage } = data;

  return (
    <div className="mx-auto max-w-10xl px-4 py-0">
      {/* <h1 className="mb-6 text-2xl font-bold">{title}</h1> */}
      {useTemplate && activities && activities.length > 0 && (
        <div className="space-y-4">
          {/* <div className="flex items-center gap-2">
         
            <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <CalendarDays size={20} className="text-primary" /> {title}
            </h3>
          </div> */}

          <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20">
              <div className="w-max p-0 pt-0">
                <div className="mb-6 flex overflow-hidden rounded-t-lg border-b border-border/90 bg-card ">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      style={{ width: `${HOUR_WIDTH}px` }}
                      className="shrink-0 border-r border-border/90 py-2 text-center text-sm text-secondary-foreground last:border-none hover:bg-secondary/50 transition-colors duration-150 ease-in-out"
                    >
                      {i < 10 ? `0${i}` : i}:00
                    </div>
                  ))}
                </div>

                <div className=" relative min-h-[400px] space-y-3 border-t border-border-30">
                  <div className="pointer-events-none absolute inset-0 flex h-full">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        style={{ width: `${HOUR_WIDTH}px` }}
                        className="h-full border-r border-border/30 last:border-none "
                      />
                    ))}
                  </div>

                  {activities.map((item, index) => {
                    const start = parseTimeToDecimal(item.startTime);
                    const end = parseTimeToDecimal(item.endTime);
                    const duration = end - start;

                    return (
                      <div
                        key={item.id}
                        className="relative flex h-10 items-center"
                      >
                        <div
                          style={{
                            left: `${start * HOUR_WIDTH}px`,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            zIndex: 10,
                          }}
                          className="group"
                        >
                          <div
                            style={{
                              width: `${duration * HOUR_WIDTH}px`,
                              minWidth: "30px",
                            }}
                            className="flex h-8 shrink-0 items-center justify-center rounded-r-md border-l-4 border-secondary bg-card shadow-sm transition-all group-hover:border-l-16"
                          >
                            <span className="text-[10px] text-foreground font-semibold">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex flex-row items-center gap-1">
                            <span className="text-xs font-semibold text-foreground leading-tight">
                              {item.itemName}
                            </span>

                            <div className="hidden animate-in fade-in slide-in-from-left-1 flex-row items-center gap-1 duration-200 group-hover:flex">
                              <span className="h-fit rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border w-fit">
                                {formatTimeShort(item.startTime)} -{" "}
                                {formatTimeShort(item.endTime)}
                              </span>
                              {item.itemNote && (
                                <span className="flex items-start gap-1 text-[10px] italic text-muted-foreground/80 max-w-[300px] leading-relaxed wrap-break-word bg-card px-1.5 py-0.5 border border-border rounded">
                                  {/* <Info className="h-2.5 w-2.5 mt-0.5 shrink-0" /> */}
                                  {item.itemNote}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* {content && (
        <div className="flex justify-between gap-6 mt-6">
          {" "}
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl shadow-md">
            <Image
              src={getImageUrl(coverImage) || "/placeholder-image.png"}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col w-full ">
            <RichTextRenderer content={content as unknown as BlocksContent} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default IntroTimelineView;
