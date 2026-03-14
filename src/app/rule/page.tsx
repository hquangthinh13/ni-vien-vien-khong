import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-00.svg";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { fetchRulePage } from "@/features/rulePage/api/rulePage.api";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { notFound } from "next/navigation";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Nội quy lưu trú",
};
export default async function RulePage() {
  const locale = (await getLocale()) as Locale;

  const fullResponse = await fetchRulePage({
    locale,
    populate: "*",
  });
  const data = fullResponse.data || null;
  if (!data) {
    notFound();
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 min-h-lvh">
      <div className="flex flex-col gap-12">
        <article className="">
          <header className="space-y-2">
            <div className="flex justify-center items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>Nội quy lưu trú</span>
            </div>

            <h1 className="text-2xl md:text-4xl text-center font-bold leading-tight">
              {data.title}
            </h1>
          </header>
          <div className="opacity-80 flex w-full justify-center my-8 scale-y-[-1]">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>

          <RichTextRenderer content={data?.content || []} />
          <div className="opacity-80 flex w-full justify-center my-8">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>
        </article>
      </div>
    </div>
  );
}
