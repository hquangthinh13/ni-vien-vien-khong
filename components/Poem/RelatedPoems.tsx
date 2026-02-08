"use client";

import React from "react";
import Link from "next/link";
import type { Poem } from "@/components/Poem/Poem.type";

interface RelatedPoemsProps {
  poems: Poem[];
}

const RelatedPoems = ({ poems }: RelatedPoemsProps) => {
  if (!poems || poems.length === 0) return null;

  return (
    <section className="pt-12">
      <h3 className="flex justify-center items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest mb-6">
        Đọc thêm
      </h3>

      <div className="flex flex-col items-center gap-4">
        {poems.map((poem) => (
          <Link
            key={poem.documentId}
            href={`/library/poem/${poem.documentId}`}
            className="text-lg md:text-xl font-bold text-foreground/80 hover:text-primary transition-colors duration-300 text-center px-4"
          >
            {poem.title}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPoems;
