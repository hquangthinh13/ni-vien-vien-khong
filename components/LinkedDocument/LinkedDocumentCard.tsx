import React from "react";
import Link from "next/link";
import { ScrollText, ChevronRight } from "lucide-react"; // Thêm icon để tăng tính thẩm mỹ
import { LinkedDocument } from "./LinkedDocument.type";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface LinkedDocumentProps {
  doc: LinkedDocument;
}

const LinkedDocumentCard = ({ doc }: LinkedDocumentProps) => {
  const { title, link } = doc;

  return (
    <Link href={link} className="block group">
      <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg hover:border-primary/50 hover:bg-orange-50/30 transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <ScrollText size={16} />
        </div>

        <div className="flex-1 min-w-0">
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
    </Link>
  );
};

export default LinkedDocumentCard;
