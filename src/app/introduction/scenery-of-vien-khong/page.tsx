import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-00.svg";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import type { SceneryPageAttributes } from "@/features/sceneryPage/model/sceneryPage.types";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { fetchSceneryPage } from "@/features/sceneryPage/api/sceneryPage.api";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tịnh Cảnh Viên Không",
};
export default async function PastAndPresentPage() {
  const locale = (await getLocale()) as Locale;

  const fullResponse = await fetchSceneryPage({
    locale,
    populate: "*",
  });
  const data = fullResponse.data as SceneryPageAttributes | null;
  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="">
          <header className="flex flex-col w-full items-center mb-6 space-y-2">
            <div className="page-label items-center">
              <span>{locale === "vi" ? "Giới thiệu" : "Introduction"}</span>
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
