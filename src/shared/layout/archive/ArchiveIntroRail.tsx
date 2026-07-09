import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface ArchiveRailItem {
  key: string;
  label: string;
  count?: number;
  active?: boolean;
  onSelect?: () => void;
}

interface ArchiveIntroRailProps {
  eyebrow: string;
  title: string;
  description?: string;
  total?: number;
  totalLabel?: string;
  children?: ReactNode;
  className?: string;
}

export default function ArchiveIntroRail({
  eyebrow,
  title,
  description,
  total,
  totalLabel,
  children,
  className,
}: ArchiveIntroRailProps) {
  return (
    <div className={cn("lg:sticky lg:top-24", className)}>
      {/* <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p> */}
      <h2 className="text-xl font-bold leading-snug text-foreground">
        {title}
      </h2>
      {/* {description ? (
        <p className="mt-3 max-w-sm text-sm leading-7 text-secondary-foreground/65">
          {description}
        </p>
      ) : null} */}
      {children}
      {typeof total === "number" && totalLabel ? (
        <div className="mt-6 flex items-center justify-between border-l-2 border-primary bg-primary/5 px-4 py-3">
          <span className="text-sm font-semibold text-primary">
            {totalLabel}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {total}
          </span>
        </div>
      ) : null}
    </div>
  );
}
