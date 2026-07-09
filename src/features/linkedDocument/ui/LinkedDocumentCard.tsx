import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollText, ChevronRight, ExternalLink } from "lucide-react";
import { LinkedDocument } from "../model/linkedDocument.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { getImageUrl } from "@/shared/lib/api";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button"; // Giả sử bạn có component Button
import type { Locale } from "@/types/locale";

interface LinkedDocumentProps {
  doc: LinkedDocument;
  locale?: Locale;
}

const LinkedDocumentCard = ({ doc, locale = "vi" }: LinkedDocumentProps) => {
  const { title, link, mindMap } = doc;

  const CardContent = (
    <div className="grid min-h-20 cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_1rem] items-center gap-4 py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary transition-colors group-hover:bg-primary/12">
        <ScrollText className="size-4" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="line-clamp-2 block text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {title}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <span>{title}</span>
          </TooltipContent>
        </Tooltip>
      </div>

        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </div>
  );

  if (mindMap) {
    const imageUrl = getImageUrl(mindMap, "large") as string;

    return (
      <Dialog>
        <DialogTrigger asChild className="group w-full">
          {CardContent}
        </DialogTrigger>
        <DialogContent
          data-lenis-prevent
          className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={imageUrl}
              alt={`Mindmap for ${title}`}
              fill
              className="object-contain"
              priority
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Link href={link} passHref>
              <Button className="hover:cursor-pointer" variant="outline">
                {locale === "vi" ? "Xem chi tiết tài liệu" : "Open document"}{" "}
                <ExternalLink size={16} />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Link href={link} className="block group">
      {CardContent}
    </Link>
  );
};

export default LinkedDocumentCard;
