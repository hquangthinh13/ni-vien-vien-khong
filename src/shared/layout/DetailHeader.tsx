import type { ReactNode } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

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
      <div
        className={`page-label ${centered ? "items-center" : "items-start"}`}
      >
        <span>{label}</span>
      </div>
      <h1
        className={`max-w-4xl text-xl font-bold leading-tight md:text-4xl ${centered ? "text-center" : "text-left"}`}
      >
        {title}
      </h1>
      {meta}

      {imageUrl ? (
        <div className="relative mt-4 w-full overflow-hidden rounded-md shadow-md aspect-video">
          <Zoom zoomMargin={0}>
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
            />
          </Zoom>
        </div>
      ) : null}
    </header>
  );
}
