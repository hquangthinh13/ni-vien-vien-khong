import React from "react";
import Image from "next/image";
import Link from "next/link";
interface NewsCardProps {
  slug: string;
  title: string;
  imageUrl: string | null;
  text: string;
  isFirst?: boolean;
  variant: "top" | "bottom";
}
const SimplifiedNewsCard = ({
  slug,
  title,
  imageUrl,
  text,
  isFirst = false,
  variant,
}: NewsCardProps) => {
  if (variant === "bottom") {
    return (
      <Link href={`/news/${slug}`}>
        <div className="flex gap-4 items-baseline group">
          <p className="text-muted-foreground select-none" aria-hidden="true">
            •
          </p>

          <h3 className="text-md line-clamp-4 font-bold leading-snug group-hover:text-primary cursor-pointer">
            {title}
          </h3>
        </div>{" "}
      </Link>
    );
  }
  // TOP ROW:
  return (
    <Link href={`/news/${slug}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {isFirst && imageUrl && (
          <div className="relative aspect-video w-[260px] shrink-0 overflow-hidden self-start">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <h3
            className={`text-md font-bold leading-snug hover:text-primary cursor-pointer`}
          >
            {title}
          </h3>
          <p
            className={` ${!isFirst ? "line-clamp-5" : " line-clamp-3"} text-sm text-muted-foreground`}
          >
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SimplifiedNewsCard;
