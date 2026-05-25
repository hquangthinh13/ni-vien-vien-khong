import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface ContentGridProps {
  children: ReactNode;
  className?: string;
}

export default function ContentGrid({ children, className }: ContentGridProps) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}
