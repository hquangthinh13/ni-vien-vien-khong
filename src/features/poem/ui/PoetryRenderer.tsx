"use client";

import React from "react";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface PoetryRendererProps {
  content: BlocksContent;
}

const PoetryRenderer = ({ content }: PoetryRendererProps) => {
  return (
    <div className="poetry-container py-6 px-4">
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => (
            <p className="mb-4 text-center text-lg md:text-xl text-foreground/80 italic leading-relaxed tracking-wide">
              {children}
            </p>
          ),
          heading: ({ children, level }) => {
            if (level === 1) {
              return (
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 uppercase tracking-widest text-primary">
                  {children}
                </h1>
              );
            }
            return (
              <h2 className="text-xl text-center mb-6 opacity-75">
                {children}
              </h2>
            );
          },
        }}
      />
    </div>
  );
};

export default PoetryRenderer;
