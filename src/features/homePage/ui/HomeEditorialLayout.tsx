import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface HomeEditorialLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function HomeEditorialLayout({
  children,
  className,
}: HomeEditorialLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-16 md:gap-24 md:py-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
