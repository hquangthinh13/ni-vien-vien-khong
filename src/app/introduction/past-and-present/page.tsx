import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-00.svg";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { fetchHistoryPage } from "@/features/historyPage/api/historyPage.api";
import type { HistoryPageAttributes } from "@/features/historyPage/model/historyPage.types";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";

export default async function PastAndPresentPage() {
  const locale = (await getLocale()) as Locale;

  const fullResponse = await fetchHistoryPage({
    locale,
    populate: "*",
  });
  const data = fullResponse.data as HistoryPageAttributes | null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="">
          <header className="space-y-2">
            <div className="text-center text-primary text-sm uppercase tracking-widest font-mono font-bold">
              <span className="">Giới thiệu</span>
            </div>

            <h1 className="text-2xl md:text-4xl text-center font-bold leading-tight">
              {data?.title}
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
