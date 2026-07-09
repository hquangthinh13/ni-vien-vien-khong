"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

interface ArchiveFilterSheetProps {
  triggerLabel: string;
  title: string;
  description: string;
  summary?: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right";
}

export default function ArchiveFilterSheet({
  triggerLabel,
  title,
  description,
  summary,
  children,
  open,
  onOpenChange,
  side = "left",
}: ArchiveFilterSheetProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
      <div className="min-w-0">{summary}</div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="shrink-0">
            <SlidersHorizontal className="size-4" />
            {triggerLabel}
          </Button>
        </SheetTrigger>
        <SheetContent side={side} className="overflow-y-auto" data-lenis-prevent>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
