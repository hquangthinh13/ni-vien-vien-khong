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
    <div className="mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-12">
        <TextMotionWrapper delay={0.2} className="text-center">
          <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
            Các tu viện khác
          </h2>
        </TextMotionWrapper>
        <TextMotionWrapper delay={0.2}>
          <div className="opacity-80">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
        </TextMotionWrapper>
      </div>{" "}
      <TextMotionWrapper delay={0.3} className="mt-8">
        <p className="text-muted-foreground text-justify">
          {response.data?.content}
        </p>
      </TextMotionWrapper>
      <MonasteryList items={monasteries} />{" "}
    </div>
  );
}
