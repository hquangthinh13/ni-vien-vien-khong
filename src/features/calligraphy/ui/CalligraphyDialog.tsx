"use client";

import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/shared/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { getImageUrl } from "@/shared/lib/api";
import type { Calligraphy } from "../model/calligraphy.types";
import { Button } from "@/shared/ui/button";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface CalligraphyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calligraphy: Calligraphy | null;
  loading: boolean;
  onSelectRelated: (documentId: string) => void;
}

export default function CalligraphyDialog({
  open,
  onOpenChange,
  calligraphy,
  loading,
  onSelectRelated,
}: CalligraphyDialogProps) {
  const imageUrl = getImageUrl(calligraphy?.coverImage, "medium");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={calligraphy?.documentId}
        className="max-w-[95vw] lg:max-w-5xl h-[90vh] p-0 overflow-hidden border-none flex flex-col"
      >
        <VisuallyHidden.Root>
          <DialogTitle>{calligraphy?.title ?? "Calligraphy"}</DialogTitle>
          <DialogDescription>{calligraphy?.category ?? ""}</DialogDescription>
        </VisuallyHidden.Root>

        {loading && !calligraphy ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : calligraphy ? (
          <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
            <div className="relative w-full lg:w-[60%] h-75 lg:h-full bg-zinc-100 flex items-center justify-center border-r">
              {imageUrl && (
                <Zoom zoomMargin={80}>
                  <Image
                    src={imageUrl}
                    alt={calligraphy.title || "Calligraphy Image"}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </Zoom>
              )}
            </div>

            <div className="flex flex-1 flex-col h-full min-h-0 overflow-hidden bg-white">
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-mono uppercase text-primary font-bold tracking-widest mb-2">
                      {calligraphy.category}
                    </p>
                    <h2 className="text-2xl md:text-3xl text-secondary-foreground font-bold leading-tight">
                      {calligraphy.title || "Chưa có tiêu đề"}
                    </h2>
                  </div>

                  <div className="h-px w-12 bg-primary/30" />

                  <p className="text-base text-secondary-foreground/80 leading-relaxed whitespace-pre-wrap italic py-4">
                    {calligraphy.description}
                  </p>

                  <div className="pt-8 border-t">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider text-muted-foreground block mb-4">
                      Tác phẩm liên quan
                    </span>
                    <div className="flex flex-wrap gap-2 pb-6">
                      {calligraphy.relatedCalligraphies &&
                      calligraphy.relatedCalligraphies.length > 0 ? (
                        calligraphy.relatedCalligraphies.map((item) => (
                          <Button
                            key={item.documentId}
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => onSelectRelated(item.documentId)}
                            disabled={loading}
                          >
                            {item.title}
                          </Button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Không có bài liên quan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Không có dữ liệu.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
