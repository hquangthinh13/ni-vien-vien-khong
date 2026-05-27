import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-00.svg";
import ornament from "@/public/ornament-01.svg";

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
    <div className="page-container">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h1 className="page-header">{data.title}</h1>{" "}
        <div className="opacity-80">
          <Image src={ornament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <RichTextRenderer content={data?.content || []} />
      </div>

      <div className="opacity-80 flex w-full justify-center my-8">
        <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
      </div>
    </div>
  );
}
