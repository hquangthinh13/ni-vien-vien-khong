import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface ArchivePageLayoutProps {
  rail: ReactNode;
  children: ReactNode;
  className?: string;
  railClassName?: string;
  contentClassName?: string;
}

export default function ArchivePageLayout({
  rail,
  children,
  className,
  railClassName,
  contentClassName,
}: ArchivePageLayoutProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10",
        className,
      )}
    >
      <aside
        className={cn(
          "border-b border-border/80 pb-6 lg:col-span-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0",
          railClassName,
        )}
      >
        {rail}
      </aside>
      <section className={cn("min-w-0 lg:col-span-9", contentClassName)}>
        {children}
      </section>
    </div>
  );
}
