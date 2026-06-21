import type { ReactNode } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";

interface DetailHeaderProps {
  label: string;
  title: string;
  meta?: ReactNode;
  imageUrl?: string | null;
  imageAlt?: string;
  centered?: boolean;
}

export default function DetailHeader({
  label,
  title,
  meta,
  imageUrl,
  imageAlt,
  centered = false,
}: DetailHeaderProps) {
  return (
    <header
      className={`mb-6 flex w-full flex-col space-y-2 ${centered ? "items-center" : "items-start"}`}
    >
      <h1
        className={`max-w-4xl text-xl font-bold leading-tight md:text-4xl ${centered ? "text-center" : "text-left"}`}
      >
        {title}
      </h1>
      <div className="flex items-center justify-between gap-4 w-full">
        <div
          className={`page-label ${centered ? "items-center" : "items-start"}`}
        >
          <span>{label}</span>
        </div>
        {meta}
      </div>

      {imageUrl ? (
        <div className="relative mt-4 w-full overflow-hidden rounded-lg shadow-md aspect-video">
          <Zoom zoomMargin={0}>
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
            />
          </Zoom>
        </div>
      ) : null}
    </header>
  );
}
