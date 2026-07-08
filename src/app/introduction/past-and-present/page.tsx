import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-00.svg";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { fetchHistoryPage } from "@/features/historyPage/api/historyPage.api";
import type { HistoryPageAttributes } from "@/features/historyPage/model/historyPage.types";
import { getAppLocale } from "@/shared/lib/i18n";
import { Metadata } from "next";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
export const metadata: Metadata = {
  title: "Ni Viện Viên Không Xưa và Nay",
};
export default async function PastAndPresentPage() {
  const locale = await getAppLocale();
  let data: HistoryPageAttributes | null = null;

  try {
    const fullResponse = await fetchHistoryPage({
      locale,
      populate: "*",
    });
    data = fullResponse.data as HistoryPageAttributes | null;
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return (
    <div className="page-container">
      <AppBreadcrumb
        locale={locale}
        items={[
          { label: locale === "vi" ? "Giới thiệu" : "Introduction" },
          {
            label:
              data?.title ||
              (locale === "vi"
                ? "Viên Không Xưa và Nay"
                : "Vien Khong Past and Present"),
          },
        ]}
        className="mb-6"
      />
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="w-full">
          <header className="flex flex-col w-full items-center mb-6 space-y-2">
            <div className="page-label items-center">
              <span>{locale === "vi" ? "Giới thiệu" : "Introduction"}</span>
            </div>

            <h1 className="text-2xl md:text-4xl text-center font-bold leading-tight">
              {data?.title ||
                (locale === "vi"
                  ? "Viên Không Xưa và Nay"
                  : "Vien Khong Past and Present")}
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
