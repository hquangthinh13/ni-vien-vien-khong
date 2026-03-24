import React from "react";
import { fetchMonasteryPage } from "@/features/monasteryPage/api/monasteryPage.api";

import { getLocale } from "next-intl/server";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import type { Locale } from "@/types/locale";
import TextMotionWrapper from "@/shared/motion/TextMotionWrapper";
import { Metadata } from "next";
import { MonasteryPageResponse } from "@/features/monasteryPage/model/monasteryPage.types";
import MonasteryList from "@/features/monasteryPage/ui/MonasteryList";
export const metadata: Metadata = {
  title: "Các tu viện khác",
};

export default async function MonasteryPage() {
  const locale = (await getLocale()) as Locale;

  const response = (await fetchMonasteryPage({
    locale,
    populate: ["monasteries.coverImage", "coverImage"],
  })) as MonasteryPageResponse;

  const monasteries = response.data?.monasteries || [];

  return (
    <div className="page-container">
      <div className="flex flex-col gap-6 items-center mb-6">
        <TextMotionWrapper delay={0.2} className="text-center">
          <h1 className="page-header">
            {locale === "vi" ? "Các tu viện khác" : "Other Monasteries"}
          </h1>
        </TextMotionWrapper>
        <TextMotionWrapper delay={0.2}>
          <div className="opacity-80">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
        </TextMotionWrapper>
      </div>{" "}
      {/* <TextMotionWrapper delay={0.3} className="mt-8">
        <p className="text-muted-foreground text-justify">
          {response.data?.content}
        </p>
      </TextMotionWrapper> */}
      <MonasteryList items={monasteries} />{" "}
    </div>
  );
}
