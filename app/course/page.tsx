import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronRight, Clock, LayoutGrid } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

import lineOrnament from "@/public/ornament-01.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const CoursePage = () => {
  const t = useTranslations("CoursePage");

  // Dữ liệu mẫu
  const mockCourses = [
    {
      id: 1,
      slug: "khoa-tu-he",
      title:
        "KHÓA TU XUẤT GIA GIEO DUYÊN | LẦN 4 | DL2025 | PL.2569 – NI VIỆN VIÊN KHÔNG",
      date: "28/01/2025",
      desc: "Chương trình dành cho thiếu niên...",
    },
    {
      id: 2,
      slug: "mot-ngay-an-lac",
      title: "Khóa Tu Mùa Hè 2025 | NI VIỆN VIÊN KHÔNG",
      date: "15/02/2025",
      desc: "Nuôi dưỡng tâm từ bi...",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          {t("title")}
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>
      <Accordion
        type="single"
        collapsible
        defaultValue="year-2025"
        className="w-full space-y-4"
      >
        {[2025, 2024, 2023, 2022, 2021].map((year) => (
          <AccordionItem
            key={year}
            value={`year-${year}`}
            className="w-full border-none"
          >
            <div className="flex flex-col w-md lg:w-2xl border rounded-xl bg-card">
              <AccordionTrigger className="flex w-full items-center p-4 hover:no-underline hover:bg-muted/50 transition-all group border-none">
                <div className="flex flex-1 items-center justify-between w-full">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-lg md:text-lg font-bold tracking-wide">
                      {"Năm"} {year}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0 border-t w-full">
                <div className="grid grid-cols-1 w-full divide-y divide-border">
                  {mockCourses.map((item) => (
                    <Link
                      href={`/course/${item.slug}`}
                      key={item.id}
                      className="group flex gap-6 p-2 md:p-4 hover:bg-muted/30 transition-all duration-300"
                    >
                      <div className="relative shrink-0 w-32 md:w-48 aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={
                            item.imageUrl ||
                            "https://vienkhongni.com/wp-content/uploads/2025/10/543127801_1216970293799702_1075303545561369108_n.jpg"
                          }
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between ">
                        <div className="space-y-2">
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary">
                            Khóa tu mùa hè
                          </span>

                          <h3 className="font-bold text-base md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground mt-2">
                          <CalendarDays size={14} className="text-primary/70" />
                          <span className="text-xs md:text-sm font-medium">
                            01/02/2026 - 07/02/2026
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center self-center pl-4">
                        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <ChevronRight size={20} />
                        </div>
                        {/* <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full cursor-pointer"
                        >
                          <ChevronRight />
                        </Button> */}
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>{" "}
      <Pagination className="mt-4 mx-0 w-auto">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CoursePage;
