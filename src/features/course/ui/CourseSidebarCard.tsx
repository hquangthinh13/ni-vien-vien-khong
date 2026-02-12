"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "../model/course.types";
import { getImageUrl } from "@/lib/api";
import { formatFriendlyDate } from "@/shared/lib/utils";
import { Locale } from "@/types/locale";
import { useLocale } from "next-intl";
interface CourseSidebarCardProps {
  course: Course;
}

const CourseSidebarCard = ({ course }: CourseSidebarCardProps) => {
  const locale = useLocale();

  const coverImageUrl = course.coverImage
    ? getImageUrl(course.coverImage)
    : null;

  const startDate = course.courseStartDate
    ? formatFriendlyDate(course.courseStartDate, locale, false)
    : "Chưa cập nhật";

  const endDate = course.courseEndDate
    ? formatFriendlyDate(course.courseEndDate, locale, false)
    : "Chưa cập nhật";

  return (
    <Link
      href={`/course/${course.documentId}`}
      className="group block w-full border-b border-border/50 pb-2 last:border-0 last:pb-0 transition-all"
    >
      <div className="flex gap-3">
        <div className="flex relative aspect-video md:aspect-4/3 w-36 sm:w-32 shrink-0 overflow-hidden rounded-md bg-muted">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={course.courseName}
              fill
              sizes="(max-width: 768px) 160px, 128px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-col justify-start space-y-1 min-w-0">
          {/* {course.category && (
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
              {course.category}
            </span>
          )} */}

          <h4 className="text-sm font-semibold text-foreground line-clamp-4 leading-snug group-hover:text-primary transition-colors">
            {course.courseName}
          </h4>

          <div className="flex items-center">
            <span className="text-[10px] font-medium text-muted-foreground tracking-tight">
              {startDate} - {endDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseSidebarCard;
