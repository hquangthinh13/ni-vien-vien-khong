import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface DetailPageShellProps {
  main: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export default function DetailPageShell({
  main,
  sidebar,
  className,
}: DetailPageShellProps) {
  return (
    <div className={cn("page-container", className)}>
      <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-10">
        <div className={sidebar ? "lg:col-span-7" : "lg:col-span-10"}>{main}</div>
        {sidebar ? (
          <aside className="w-full space-y-6 lg:col-span-3 lg:sticky lg:top-24 lg:h-fit">
            {sidebar}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
