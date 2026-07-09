import { PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { getVideoId } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

export interface DetailVideoItem {
  id: string | number;
  title?: string;
  videoLink: string;
  indexLabel?: string;
  eyebrow?: string;
}

interface DetailVideoAccordionProps {
  items: DetailVideoItem[];
  locale: Locale;
  title?: string;
  emptyMessage?: string;
}

export default function DetailVideoAccordion({
  items,
  locale,
  title,
  emptyMessage,
}: DetailVideoAccordionProps) {
  if (items.length === 0) return null;

  const sectionTitle = title || (locale === "vi" ? "Pháp thoại" : "Videos");
  const fallbackMessage =
    emptyMessage ||
    (locale === "vi"
      ? "Video đang được cập nhật."
      : "The video is being updated.");

  return (
    <section className="w-full">
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
          <PlayCircle className="size-5 text-primary" />
          {sectionTitle}
        </h2>
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {items.length} {locale === "vi" ? "video" : "videos"}
        </span>
      </div>

      <Accordion type="single" collapsible className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => {
          const videoId = getVideoId(item.videoLink);
          const ordinal = item.indexLabel || String(index + 1).padStart(2, "0");

          return (
            <AccordionItem
              key={item.id}
              value={item.title || `video-${item.id}`}
              className="overflow-hidden rounded-lg border border-border bg-card px-4"
            >
              <AccordionTrigger className="group items-center border-none py-4 hover:no-underline">
                <div className="flex w-full items-center gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {ordinal}
                  </span>
                  <span className="flex min-w-0 flex-col items-start gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-primary">
                      {item.eyebrow ||
                        (locale === "vi" ? "Pháp thoại" : "Dharma Talk")}
                    </span>
                    <span className="line-clamp-1 text-left text-sm font-bold">
                      {item.title}
                    </span>
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-4 pt-0">
                {videoId ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                      title={item.title || sectionTitle}
                      className="absolute inset-0 size-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-10">
                    <PlayCircle className="mb-2 size-8 text-muted-foreground" />
                    <p className="text-sm italic text-muted-foreground">
                      {fallbackMessage}
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
