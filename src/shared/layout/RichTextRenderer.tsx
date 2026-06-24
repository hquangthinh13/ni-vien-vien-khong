"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import { Link as LinkIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { Button } from "../ui/button";
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

          return (
            <MotionWrapper>
              <Tag className={headingStyles[level]}>{children}</Tag>
            </MotionWrapper>
          );
        },
        list: ({ children, format }) => {
          if (format === "ordered") {
            return (
              <MotionWrapper>
                <ol className="mb-6 ml-6 list-decimal space-y-2 text-foreground/90 marker:font-medium">
                  {children}
                </ol>
              </MotionWrapper>
            );
          }

          return (
            <MotionWrapper>
              <ul className="mb-6 ml-6 list-disc space-y-2 text-foreground/90 marker:text-primary">
                {children}
              </ul>
            </MotionWrapper>
          );
        },

        "list-item": ({ children }) => (
          <MotionWrapper>
            <li className="pl-1 leading-7">{children}</li>
          </MotionWrapper>
        ),

        quote: ({ children }) => (
          <MotionWrapper>
            <blockquote className="my-6 rounded-r-xl border-l-4 border-primary bg-muted/40 px-5 py-4 italic leading-7 text-foreground/80">
              {children}
            </blockquote>
          </MotionWrapper>
        ),

        image: ({ image }) => (
          <MotionWrapper>
            <figure className={`px-0 lg:px-24 my-8 space-y-3`}>
              <div className="relative w-full overflow-hidden rounded-lg shadow-sm">
                <Zoom zoomMargin={0}>
                  <Image
                    src={image.url}
                    alt={image.alternativeText || ""}
                    width={image.width}
                    height={image.height}
                    className="h-auto w-full"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
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
          </MotionWrapper>
        ),
        paragraph: ({ children }) => (
          <motion.p
            initial={{ opacity: 0.5, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ amount: 0.2 }}
            className={`${isPoem ? "italic text-center" : "text-justify"} not-last:mb-2 text-foreground/90 leading-7`}
          >
            {children}
          </motion.p>
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
            <MotionWrapper className="my-2">
              <Button
                variant="link"
                asChild
                className="px-0! whitespace-normal"
              >
                <Link
                  href={url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <LinkIcon className="shrink-0" />
                  <span className="min-w-0 wrap-break-word whitespace-normal">
                    {children}
                  </span>
                </Link>
              </Button>
            </MotionWrapper>
          );
        },
      }}
    />
  );
};

export default RichTextRenderer;
