import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export default function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("page-container", className)}>{children}</div>;
}
