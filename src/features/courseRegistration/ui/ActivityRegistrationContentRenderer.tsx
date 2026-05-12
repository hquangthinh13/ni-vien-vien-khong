"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import { Link as LinkIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface ActivityRegistrationContentRendererProps {
  content: BlocksContent;
}

const ActivityRegistrationContentRenderer = ({
  content,
}: ActivityRegistrationContentRendererProps) => {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => (
          <figure className="lg:px-48 my-4 space-y-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm">
              <Zoom zoomMargin={0}>
                <Image
                  src={image.url}
                  alt={image.alternativeText || ""}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
                />
              </Zoom>
            </div>
            {image.caption && (
              <figcaption className="text-center">
                <span className="text-xs text-muted-foreground italic flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-border" />
                  {image.caption}
                  <div className="h-px w-8 bg-border" />
                </span>
              </figcaption>
            )}
          </figure>
        ),
        paragraph: ({ children }) => (
          <p className="not-last:mb-4 text-sm text-foreground/90 text-justify">
            {children}
          </p>
        ),
        link: ({ children, url }) => {
          const isExternal = url.startsWith("http");

          return (
            <Link
              href={url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="flex text-sm items-center gap-1 text-primary font-normal tracking-wide italic hover:text-primary/80 transition-all hover:underline ease-in-out duration-150"
            >
              <LinkIcon className="flex w-4 h-4" /> {children}
            </Link>
          );
        },
      }}
    />
  );
};

export default ActivityRegistrationContentRenderer;
