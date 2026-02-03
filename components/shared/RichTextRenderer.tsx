// components/Course/RichTextRenderer.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface RichTextRendererProps {
  content: BlocksContent;
}

const RichTextRenderer = ({ content }: RichTextRendererProps) => {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => (
          <figure className="my-8 space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm">
              <Image
                src={image.url}
                alt={image.alternativeText || ""}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {image.caption && (
              <figcaption className="text-center">
                <span className="text-xs md:text-sm text-muted-foreground italic flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-border" />
                  {image.caption}
                  <div className="h-px w-8 bg-border" />
                </span>
              </figcaption>
            )}
          </figure>
        ),
        paragraph: ({ children }) => (
          <p className="mb-6 text-foreground/90 leading-7 text-justify">
            {children}
          </p>
        ),
      }}
    />
  );
};

export default RichTextRenderer;
