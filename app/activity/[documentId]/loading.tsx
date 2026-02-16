import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
export default function Loading() {
  return (
    <div className="flex w-full px-4 py-10 mx-auto max-w-10xl">
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
}
