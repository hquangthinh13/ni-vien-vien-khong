import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import coverImage from "@/public/homepage-cover.jpg";
import lineOrnament from "@/public/ornament-00.svg";
import ornament from "@/public/ornament-01.svg";

import image01 from "@/public/past-and-present/01.jpg";
import image02 from "@/public/past-and-present/02.jpg";

export default function SceneryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="">
          <header className="space-y-2">
            <div className="flex justify-center items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>Giới thiệu</span>
            </div>

            <h1 className="text-2xl md:text-4xl text-center font-bold leading-tight">
              Tịnh Cảnh Viên Không
            </h1>
          </header>
          <div className="opacity-80 flex w-full justify-center my-8 scale-y-[-1]">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>

          <div className="opacity-80 flex w-full justify-center my-8">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>
        </article>
      </div>
    </div>
  );
}
