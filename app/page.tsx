import Image from "next/image";
import Link from "next/link";
import coverImage from "../public/homepage-cover.jpg";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewsSection from "@/components/Activity/ActivitiesSection";
import QuestionSection from "@/components/Question/QuestionSection";
import CalendarSection from "@/components/Activity/CalendarSection";
import QuestionForm from "@/components/Question/QuestionForm";
import type { Locale } from "@/types/locale";
import { getTranslations, getLocale } from "next-intl/server";
import CourseSection from "@/components/Course/CourseSection";
import CourseRegistrationSection from "@/components/CourseRegistration/CourseRegistrationSection";
export default async function Home() {
  const t = await getTranslations("HomePage");
  const locale = (await getLocale()) as Locale;
  return (
    <div className="mx-auto max-w-6xl px-4 mb-6">
      <Image
        className="rounded-lg shadow-lg my-6"
        src={coverImage}
        alt="Cover image"
        placeholder="blur"
      />

      <div className="flex flex-col-reverse md:flex-row min-h-12 gap-4 md:gap-0 mb-6">
        {/* Left */}
        <div className="flex flex-col justify-start gap-4 md:w-[70%] p-4">
          {/* Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Tin tức
              </h2>{" "}
              <div className="flex gap-2">
                <Link
                  href="/activity"
                  className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                >
                  Xem thêm
                </Link>
              </div>
            </div>
            <NewsSection />
          </div>
          {/* Section */}
          <div className="flex flex-1 flex-col pt-4 border-t">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Vấn đáp Phật pháp
              </h2>{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex w-full justify-end">
                    <Button variant="outline" className="cursor-pointer">
                      Đặt câu hỏi
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  {" "}
                  <DialogTitle>Đặt câu hỏi</DialogTitle>
                  <QuestionForm locale={locale} />
                </DialogContent>
              </Dialog>
            </div>
            <QuestionSection />{" "}
            <div className="flex w-full justify-end">
              <Link
                href="/library/question"
                className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col md:w-[30%] md:border-l p-4 gap-4">
          {/* Section */}
          <div className="flex flex-col">
            <div className="flex w-fit">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                {t("foreword")}
              </h2>
            </div>

            <p className="flex mt-4 max-w-lg leading-snug text-justify italic text-muted-foreground">
              Trang web vienkhongni.com ra đời nhằm mục đích cho sự tiện ích đến
              toàn thể thân hữu, đạo hữu muốn tìm hiểu những sinh hoạt tín
              ngưỡng, tu tập, văn hoá, giáo dục, xã hội... của Ni Viện Viên
              Không và Ni Sư Liễu Pháp.
            </p>
          </div>
          {/* Section */}
          <div className="flex flex-col pt-4 border-t">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Khóa tu
              </h2>{" "}
              <div className="flex gap-2">
                <Link
                  href="/course"
                  className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                >
                  Xem thêm
                </Link>
              </div>
            </div>
            <CourseSection />
            <div className="mt-4">
              <CourseRegistrationSection onlyButton={true} />
            </div>
          </div>

          {/* Section */}
          {/* <div className="flex flex-col pt-4 border-t">
            <div className="flex w-fit mb-4">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Đặt câu hỏi
              </h2>
            </div>
            <QuestionForm locale={locale} />
          </div> */}
        </div>
      </div>
      {/* Section */}

      <CalendarSection />
    </div>
  );
}
