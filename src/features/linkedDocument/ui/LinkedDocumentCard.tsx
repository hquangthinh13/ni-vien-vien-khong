import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollText, ChevronRight, ExternalLink } from "lucide-react";
import { LinkedDocument } from "../model/linkedDocument.types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { getImageUrl } from "@/shared/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button"; // Giả sử bạn có component Button

interface LinkedDocumentProps {
  doc: LinkedDocument;
}

const LinkedDocumentCard = ({ doc }: LinkedDocumentProps) => {
  const { title, link, mindMap } = doc;

  const CardContent = (
    <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg hover:border-primary/50 hover:bg-orange-50/30 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
      <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <ScrollText size={16} />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-sm font-medium text-foreground leading-snug truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <span>{title}</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <ChevronRight
        size={14}
        className="text-muted-foreground group-hover:translate-x-1 transition-transform"
      />
    </div>
  );

  if (mindMap) {
    const imageUrl = getImageUrl(mindMap, "large") as string;

    return (
      <Dialog>
        <DialogTrigger asChild className="group w-full">
          {CardContent}
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl">
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
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Link href={link} passHref>
              <Button className="hover:cursor-pointer" variant="outline">
                Xem chi tiết tài liệu <ExternalLink size={16} />
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
