"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import HighlightSection from "@/components/Course/HighlightSection";
import {
  CalendarDays,
  PlayCircle,
  LayoutGrid,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import lineOrnament from "@/public/ornament-01.svg";
import { getVideoId } from "@/lib/utils";
// --- MOCK DATA ---
const MOCK_KHOA_TU: Course = {
  title: "KHÓA TU XUẤT GIA GIEO DUYÊN | LẦN 4 | DL2025 | PL.2569",
  category: "Khóa tu xuất gia gieo duyên",
  startDate: "28/05/2025",
  endDate: "05/06/2025",
  coverImage: "https://vienkhongni.com/wp-content/uploads/2025/08/ktmh-k1.jpg",
  content: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Khóa tu là cơ hội để các hành giả tạm gác lại những lo toan của đời thường, tìm về sự thanh tịnh trong tâm hồn. Dưới sự hướng dẫn của chư Ni tại Ni Viện Viên Không, các khóa sinh sẽ được thực hành thiền, nghe pháp và sống trong tinh thần lục hòa.",
        },
      ],
    },
    {
      type: "image",
      image: {
        url: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070",
        alternativeText: "Hành giả tọa thiền",
        caption: "Giờ tọa thiền chung tại chánh điện Ni viện",
      },
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Trong suốt 7 ngày đêm, các học viên sẽ tuân thủ thời khóa nghiêm ngặt từ lúc thức dậy lúc 4 giờ sáng đến khi chỉ tịnh lúc 9 giờ tối. Đây là trải nghiệm quý báu để mỗi người tự soi rọi lại bản thân.",
        },
      ],
    },
  ] as BlocksContent,
  highlightImages: [
    "https://vienkhongni.com/wp-content/uploads/2025/10/LE-XUAT-GIA-GIEO-DUYEN-1.jpg",
    "https://vienkhongni.com/wp-content/uploads/2025/08/1-2048x1365.jpg",
    "https://vienkhongni.com/wp-content/uploads/2025/08/DSC4807-2048x1365.jpg",
    "https://vienkhongni.com/wp-content/uploads/2025/08/Anh-Tap-the-khoa-tu-mua-he-k23-1-2048x1448.jpg",
    "https://vienkhongni.com/wp-content/uploads/2025/08/ktmh-k1.jpg",
  ],
  videos: [
    {
      id: "v1",
      title: "Ngày 1 | Khóa I | Khóa Tu Mùa Hè 2025 | NI VIỆN VIÊN KHÔNG",
      videoLink: "https://www.youtube.com/watch?v=K-a8s8OLBSE",
      day: 1,
    },
    {
      id: "v2",
      title: "Ngày 2 | Khóa I | Khóa Tu Mùa Hè 2025 | NI VIỆN VIÊN KHÔNG",
      videoLink: "https://www.youtube.com/watch?v=K-a8s8OLBSE",
      day: 2,
    },
    {
      id: "v3",
      title: "Ngày 3 | Khóa I | Khóa Tu Mùa Hè 2025 | NI VIỆN VIÊN KHÔNG",
      videoLink: "https://www.youtube.com/watch?v=K-a8s8OLBSE",
      day: 3,
    },
  ],
};
type BlockImage = {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
};
type Video = {
  id: string;
  title: string;
  videoLink: string;
  day: number;
};

type Course = {
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  content: BlocksContent;
  highlightImages: string[];
  videos: Video[];
};
const CoursePage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Course | null>(null);

  useEffect(() => {
    // Giả lập thời gian fetch dữ liệu
    const timer = setTimeout(() => {
      setData(MOCK_KHOA_TU);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const sortedVideos = data?.videos?.length
    ? [...data.videos].sort((a, b) => a.day - b.day)
    : [];

  if (loading) return <LoadingSkeleton />;
  if (!data) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-7 prose prose-orange max-w-none text-justify leading-relaxed">
          <header className="flex flex-col items-start mb-6 space-y-2">
            <div className="flex items-start gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>{data.category}</span>
            </div>
            <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
              {data.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
              <CalendarDays size={18} className="text-primary" />
              <span>
                {data.startDate} — {data.endDate}
              </span>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Image
                src={data.coverImage}
                alt={data.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </header>

          <div className="opacity-80 flex w-full justify-center my-12">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
          <RichTextRenderer content={data.content} />

          <section className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <PlayCircle size={20} className="text-primary" /> Video
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {sortedVideos.map((video) => {
                const videoId = getVideoId(video.videoLink);

                return (
                  <AccordionItem
                    key={video.id}
                    value={video.id}
                    className="border rounded-xl px-2 bg-card overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <AccordionTrigger className="hover:no-underline py-5 group border-none items-center">
                      <div className="flex items-center gap-4 w-full">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {video.day < 10 ? `0${video.day}` : video.day}
                        </div>

                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                            Video Khóa Tu
                          </span>
                          <span className="text-sm md:text-base font-bold text-left line-clamp-1">
                            {video.title}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-0 pb-4 px-2">
                      {videoId ? (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl bg-black group/video">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 bg-muted/20 rounded-lg border border-dashed">
                          <PlayCircle
                            className="text-muted-foreground mb-2"
                            size={32}
                          />
                          <p className="text-sm text-muted-foreground italic">
                            Video đang được cập nhật...
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </section>
        </div>

        <aside className="lg:col-span-3 space-y-6">
          <HighlightSection images={data.highlightImages} />
          {/* <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
            <h4 className="font-bold text-primary uppercase text-xs tracking-widest">
              Đăng ký khóa tu
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Đăng ký khóa tu Đăng ký khóa tu Đăng ký khóa tu
            </p>
            <ChevronRight className="text-primary ml-auto" />
          </div> */}{" "}
          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-2">
              Đăng ký tham gia
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic mb-4">
              Theo dõi các hoạt động Phật sự mới nhất của Ni Viện.
            </p>
            <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
              Liên hệ ngay
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex w-full px-4 py-10 mx-auto max-w-6xl">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* LEFT COLUMN — 7/10 */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Header block */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-1/3" />

            {/* Banner */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Content block */}
          <div className="space-y-6 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />

            {/* Mid image */}
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>

        {/* RIGHT COLUMN — 3/10 */}
        <aside className="lg:col-span-3 flex flex-col gap-8">
          {/* Gallery block */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />

            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePage;
