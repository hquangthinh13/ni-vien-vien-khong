import Image, { type StaticImageData } from "next/image";
import ornamentDefault from "@/public/ornament-01.svg";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  className?: string;
  ornament?: StaticImageData;
}

export default function PageHeader({
  title,
  className,
  ornament = ornamentDefault,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col items-center gap-6", className)}>
      <h1 className="page-header text-center">{title}</h1>
      <div className="opacity-80">
        <Image src={ornament} alt="Ornament" className="h-6 w-auto" />
      </div>
    </div>
  );
}
