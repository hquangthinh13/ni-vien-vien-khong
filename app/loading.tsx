import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col w-full px-4 gap-4 py-6 mx-auto max-w-6xl">
      {/* Skeleton cho Cover Image */}
      <Skeleton className="w-full h-[200px] md:h-[400px] rounded-lg shadow-lg " />

      <div className="flex flex-col-reverse md:flex-row min-h-12 gap-4 md:gap-0 mb-6">
        {/* CỘT TRÁI (70%) - Tin tức & Vấn đáp */}
        <div className="flex flex-col justify-start gap-4 md:w-[70%] p-4">
          {/* Section: Tin tức */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-32" /> {/* Tiêu đề Tin tức */}
              <Skeleton className="h-5 w-20" /> {/* Link Xem thêm */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>

          {/* Section: Vấn đáp Phật pháp */}
          <div className="flex flex-col pt-4 border-t space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-48" /> {/* Tiêu đề Vấn đáp */}
              <Skeleton className="h-10 w-28 rounded-md" />{" "}
              {/* Nút Đặt câu hỏi */}
            </div>
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-5 w-20" /> {/* Link Xem thêm */}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (30%) - Lời ngỏ & Khóa tu */}
        <div className="flex flex-col md:w-[30%] md:border-l p-4 gap-4">
          {/* Section: Lời ngỏ */}
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-7 w-24" /> {/* Tiêu đề Lời ngỏ */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>

          {/* Section: Khóa tu */}
          <div className="flex flex-col pt-4 border-t space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-24" /> {/* Tiêu đề Khóa tu */}
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" /> {/* Course Card */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Nút Đăng ký */}
          </div>
        </div>
      </div>

      {/* Section: Lịch hoạt động (CalendarSection) */}
      <div className="pt-6 border-t">
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}
