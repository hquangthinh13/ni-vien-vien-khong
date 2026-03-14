"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Blog } from "../model/blog.types";
import type { Locale } from "@/types/locale";
import { extractFirstParagraph, formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
interface BlogCardProps {
  blog: Blog;
  locale: Locale;
}
const BlogCard = ({ blog, locale }: BlogCardProps) => {
  const { slug, documentId, title, coverImage, blogContent, publishedAt } =
    blog;

  return (
    <Link href={`/library/blog/${slug}-${documentId}`}>
      <div className="flex flex-col gap-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden self-start rounded-lg">
          {(() => {
            const imageUrl = getImageUrl(coverImage, "medium");
            return imageUrl ? (
              <Image
                src={imageUrl}
                alt={title || "Blog image"}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />
            ) : null;
          })()}
        </div>

        <div className="flex flex-col gap-2">
          <h3
            className={`text-md font-bold leading-snug hover:text-primary cursor-pointer mb-2`}
          >
            {title}
          </h3>
          <p
            className={`line-clamp-2 text-sm text-secondary-foreground/80 font-mono`}
          >
            {extractFirstParagraph(blogContent)}
          </p>{" "}
          <span className="text-xs text-muted-foreground font-mono">
            {publishedAt ? formatFriendlyDate(publishedAt, locale, true) : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
