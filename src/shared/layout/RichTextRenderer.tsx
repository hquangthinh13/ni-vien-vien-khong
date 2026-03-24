"use client";

import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import { Link as LinkIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface RichTextRendererProps {
  content: BlocksContent;
  isPoem?: boolean;
}
const headingStyles: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-3xl md:text-4xl font-bold tracking-tight mt-10 mb-6 text-foreground font-serif",
  2: "text-2xl md:text-3xl font-bold tracking-tight mt-9 mb-5 text-foreground font-serif",
  3: "text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground font-serif",
  4: "text-lg md:text-xl font-semibold mt-7 mb-3 text-foreground font-serif",
  5: "text-base md:text-lg font-semibold mt-6 mb-3 text-foreground font-serif",
  6: "text-sm md:text-base font-semibold uppercase tracking-wide mt-6 mb-3 text-foreground/80 font-serif",
};

const RichTextRenderer = ({
  content,
  isPoem = false,
}: RichTextRendererProps) => {
  // console.log("Rendering RichTextRenderer with content:", content);
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        heading: ({ children, level }) => {
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;

          return <Tag className={headingStyles[level]}>{children}</Tag>;
        },
        list: ({ children, format }) => {
          if (format === "ordered") {
            return (
              <ol className="mb-6 ml-6 list-decimal space-y-2 text-foreground/90 marker:font-medium">
                {children}
              </ol>
            );
          }

          return (
            <ul className="mb-6 ml-6 list-disc space-y-2 text-foreground/90 marker:text-primary">
              {children}
            </ul>
          );
        },

        "list-item": ({ children }) => (
          <li className="pl-1 leading-7">{children}</li>
        ),

        quote: ({ children }) => (
          <blockquote className="my-6 rounded-r-xl border-l-4 border-primary bg-muted/40 px-5 py-4 italic leading-7 text-foreground/80">
            {children}
          </blockquote>
        ),

        image: ({ image }) => (
          <figure
            className={`${isPoem ? "px-24 lg:px-80" : "px-24 lg:px-48"}  my-8 space-y-3`}
          >
            <div
              className={`${isPoem ? "" : ""} relative aspect-video w-full overflow-hidden rounded-xl shadow-sm`}
            >
              <Zoom zoomMargin={80}>
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
          <p
            className={`${isPoem ? "italic text-center" : " text-justify"} not-last:mb-2 text-foreground/90 leading-7 `}
          >
            {children}
          </p>
        ),

        link: ({ children, url }) => {
          const isExternal = url.startsWith("http");

          interface StrapiTextNode {
            props: {
              text?: string;
            };
          }

          const hasTextContent = React.Children.toArray(children).some(
            (child) => {
              if (typeof child === "string") return child.trim().length > 0;

              if (React.isValidElement(child)) {
                const strapiChild = child as unknown as StrapiTextNode;
                return (strapiChild.props.text?.trim().length ?? 0) > 0;
              }

              return false;
            },
          );

          if (!hasTextContent) return null;

          return (
            <Link
              href={url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1 text-primary font-normal tracking-wide italic hover:text-primary/80 transition-all hover:underline ease-in-out duration-150"
            >
              <LinkIcon className="w-4 h-4 shrink-0" />
              <span>{children}</span>
            </Link>
          );
        },
      }}
    />
  );
};

export default RichTextRenderer;
