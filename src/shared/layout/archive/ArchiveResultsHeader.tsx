import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

export interface ArchiveResultsHeaderProps {
  title: string;
  total: number;
  countLabel: string;
  meta?: ReactNode;
  clearLabel?: string;
  onClear?: () => void;
}

export default function ArchiveResultsHeader({
  title,
  total,
  countLabel,
  meta,
  clearLabel,
  onClear,
}: ArchiveResultsHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/80 pb-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {meta ? <div className="mt-1">{meta}</div> : null}
      </div>
      <div className="flex items-center gap-3">
        <p className="font-mono text-xs text-muted-foreground">
          {total} {countLabel}
        </p>
        {clearLabel && onClear ? (
          <Button type="button" variant="ghost" size="xs" onClick={onClear}>
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
