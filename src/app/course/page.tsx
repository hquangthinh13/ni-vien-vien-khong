import React from "react";
import Image from "next/image";
import { Locale, useTranslations } from "next-intl";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import lineOrnament from "@/public/ornament-01.svg";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { fetchCourses } from "@/features/course/api/course.api";
import { Course } from "@/features/course/model/course.types";
import { getImageUrl } from "@/lib/api";
import { formatFriendlyDate } from "@/shared/lib/utils";
import { getLocale } from "next-intl/server";
export default async function CoursePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const yearsPerPage = 3;
  const currentYear = new Date().getFullYear();
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const pageSize = 20;

  const endYear = currentYear - (currentPage - 1) * yearsPerPage;
  const startYear = endYear - (yearsPerPage - 1);

  const response = await fetchCourses({
    filters: {
      courseStartDate: {
        $gte: `${startYear}-01-01`,
        $lte: `${endYear}-12-31`,
      },
    },
    sort: ["courseStartDate:desc"],
    populate: "coverImage",
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
  });

  const courses = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  const groupedByYear = courses.reduce(
    (acc, course) => {
      const year = course.courseStartDate
        ? new Date(course.courseStartDate).getFullYear()
        : "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(course);
      return acc;
    },
    {} as Record<number | string, Course[]>,
  );

  const displayYears = Object.keys(groupedByYear).sort(
    (a, b) => Number(b) - Number(a),
  );
  return (
    <div className="flex flex-col w-full mx-auto max-w-10xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          {/* {t("title")} */}
          Khóa tu
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      {/* Sec */}
      <div className="grid grid-cols-1 lg:grid-cols-10 justify-end mb-6 gap-6">
        <div className="lg:col-span-10 flex flex-col gap-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="year-2025"
            className="w-full space-y-4"
          >
            {displayYears.map((year) => (
              <AccordionItem
                key={year}
                value={`year-${year}`}
                className="w-full border-none"
              >
                <div className="flex flex-col border border-border shadow-sm rounded-xl bg-card">
                  <AccordionTrigger className="flex w-full items-center p-4 hover:no-underline hover:bg-muted/50 transition-all group border-none">
                    <div className="flex flex-1 items-center justify-between w-full">
                      <div className="flex flex-col items-start gap-0">
                        <span className="text-lg md:text-lg font-bold tracking-wide leading-tight">
                          {year ? `Năm ${year}` : "Năm không xác định"}{" "}
                        </span>
                        <span className="text-sm text-muted-foreground font-light">
                          {groupedByYear[year].length} khóa tu
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="p-0 border-t w-full">
                    <div className="grid grid-cols-1 w-full divide-y divide-border">
                      {groupedByYear[year].map((course) => (
                        <Link
                          href={`/course/${course.documentId}`}
                          key={course.id}
                          className="group flex gap-6 p-2 md:p-4 hover:bg-muted/30 transition-all duration-300"
                        >
                          <div className="relative shrink-0 w-32 md:w-48 aspect-video rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={
                                getImageUrl(course.coverImage) ||
                                "/placeholder-image.png"
                              }
                              alt={course.courseName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between ">
                            <div className="space-y-2">
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary">
                                {course.category || "Khóa tu"}
                              </span>

                              <h3 className="font-bold text-base md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {course.courseName}
                              </h3>
                            </div>

                            {course.courseStartDate && course.courseEndDate && (
                              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                <CalendarDays
                                  size={14}
                                  className="text-primary/70"
                                />
                                <span className="text-xs md:text-sm font-medium">
                                  {`${formatFriendlyDate(course.courseStartDate, locale, false)} - ${formatFriendlyDate(course.courseEndDate, locale, false)}`}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="hidden md:flex items-center self-center pl-4">
                            <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}{" "}
            {meta && meta.pageCount > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                {currentPage > 1 ? (
                  <Link href={`?page=${currentPage - 1}`}>
                    <Button
                      size="icon"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <ChevronLeft />
                    </Button>
                  </Link>
                ) : (
                  <Button size="icon" variant="outline" disabled>
                    <ChevronLeft />
                  </Button>
                )}
                <span className="flex items-center text-muted-foreground text-sm">
                  Trang {meta.page} trên {meta.pageCount}
                </span>
                {currentPage < meta.pageCount ? (
                  <Link href={`?page=${currentPage + 1}`}>
                    <Button
                      className="cursor-pointer"
                      size="icon"
                      variant="outline"
                    >
                      <ChevronRight />
                    </Button>
                  </Link>
                ) : (
                  <Button size="icon" variant="outline" disabled>
                    <ChevronRight />
                  </Button>
                )}
              </div>
            )}
          </Accordion>
        </div>
        {/* <div className="lg:col-span-3 flex flex-col gap-4">
          <CourseRegistrationSection />
        </div> */}
      </div>
    </div>
  );
}
