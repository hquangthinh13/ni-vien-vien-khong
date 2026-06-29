import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Blog } from "../model/blog.types";
import type { Locale } from "@/types/locale";
import { extractPreviewContent } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
interface BlogCardProps {
  blog: Blog;
  locale: Locale;
}
const BlogCard = ({ blog, locale }: BlogCardProps) => {
  const { slug, documentId, title, coverImage, blogContent, publishedAt } =
    blog;

  return (
    <Link href={`/library/blog/${slug}-${documentId}`}>
      <div className="group flex flex-col h-full gap-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
          {(() => {
            const imageUrl = getImageUrl(coverImage, "medium");
            return imageUrl ? (
              <Image
                src={imageUrl}
                alt={title || "Blog image"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
              />
            ) : null;
          })()}
        </div>

        <div className="flex flex-col h-full gap-2">
          <span
            className={`text-md font-bold leading-snug group-hover:text-primary cursor-pointer mb-2`}
          >
            {title}
          </span>
          <p
            className={`line-clamp-2 text-sm text-secondary-foreground/80 font-mono`}
          >
            {extractPreviewContent(blogContent)}
          </p>{" "}
          <DateTimeDisplay
            dateString={publishedAt}
            locale={locale}
            className="mt-auto"
          />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
