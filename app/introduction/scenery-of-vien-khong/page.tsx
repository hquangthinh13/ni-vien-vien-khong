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
          <div className="prose prose-orange max-w-none text-justify leading-relaxed space-y-6">
            {/* <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 py-1">
              "Hạnh phúc không phải là có thật nhiều, mà là buông xả thật
              nhiều." — Một thông điệp ý nghĩa trong buổi đại lễ năm nay.
            </p> */}

            <p>
              Thiền viện Viên Không được Hòa thượng Viên Minh thành lập vào năm
              1987 với tâm nguyện xây dựng một môi trường hành thiền nghiêm túc
              cho chư Tăng và Ni. Đến năm 1999, theo quy định phân biệt tu học
              giữa Tăng và Ni giới, Ni viện được xây dựng riêng biệt, cách Thiền
              viện Viên Không khoảng 1 km.
            </p>
            <figure className="mb-10 space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
                <Image
                  src={image01}
                  alt="Ni Viện Viên Không những ngày đầu tiên"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              <figcaption className="text-center">
                <span className="text-xs md:text-sm text-muted-foreground italic flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-border" />
                  Ni Viện Viên Không những ngày đầu tiên
                  <div className="h-px w-8 bg-border" />
                </span>
              </figcaption>
            </figure>
            <div className="flex justify-center my-8">
              <Image
                src={ornament}
                alt="ornament"
                width={40}
                height={40}
                className="opacity-40"
              />
            </div>
            <p>
              Ni Viện Viên Không tọa lạc tại Khu 2, Ấp 4, Xã Châu Pha, TP. Hồ
              Chí Minh (Cách gọi cũ: xã Tóc Tiên, TP. Phú Mỹ, tỉnh Bà Rịa – Vũng
              Tàu). Với không gian thanh tịnh và trong lành, nơi đây trở thành
              điểm dừng chân lý tưởng cho những ai mong muốn tìm hiểu, thực hành
              giáo pháp và sống trong môi trường tu tập an hòa.
            </p>
            <figure className="mb-10 space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
                <Image
                  src={image02}
                  alt="Ni Viện Viên Không những ngày đầu tiên"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              <figcaption className="text-center">
                <span className="text-xs md:text-sm text-muted-foreground italic flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-border" />
                  Ni Viện Viên Không những ngày đầu tiên
                  <div className="h-px w-8 bg-border" />
                </span>
              </figcaption>
            </figure>
          </div>
          <div className="opacity-80 flex w-full justify-center my-8">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>
        </article>
      </div>
    </div>
  );
}
