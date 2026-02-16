import Image from "next/image";
import Link from "next/link";
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
import { fetchHomePage } from "@/components/HomePage/HomePage.service";
import { HomePageAttributes } from "@/components/HomePage/HomePage.type";
import { getImageUrl } from "@/lib/api";
export default async function Home() {
  const t = await getTranslations("HomePage");
  const locale = (await getLocale()) as Locale;

  const response = await fetchHomePage({
    populate: "*",
    locale,
  });
  const data = response.data as HomePageAttributes | null;
  const coverImage = getImageUrl(data?.coverImage);
  return (
    <div className="mx-auto max-w-10xl px-4 mb-6">
      <Image
        className="rounded-lg shadow-lg my-6"
        src={coverImage || "placeholder.jpg"}
        alt="Cover image"
        placeholder="blur"
        width={1920}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        height={1080}
      />

      <div className="flex flex-col-reverse md:flex-row min-h-12 gap-4 md:gap-0 mb-6">
        {/* Left */}
        <div className="flex flex-col justify-start gap-4 md:w-[70%] p-4">
          {/* Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="font-bold font-serif text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
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
              <h2 className="font-bold font-serif text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Vấn đáp Phật pháp
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex w-full justify-end">
                    <Button variant="outline" className="cursor-pointer">
                      Đặt câu hỏi
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent
                  aria-describedby="Question form"
                  className="max-h-[90vh] overflow-y-auto"
                >
                  <DialogTitle>Đặt câu hỏi</DialogTitle>
                  <QuestionForm locale={locale} />
                </DialogContent>
              </Dialog>
            </div>
            <QuestionSection />
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
              <h2 className="font-bold font-serif text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                {t("foreword")}
              </h2>
            </div>

            <p className="flex mt-4 max-w-lg leading-snug text-justify italic text-muted-foreground">
              {data?.openingMessage}
            </p>
          </div>
          {/* Section */}
          <div className="flex flex-col pt-4 border-t">
            <div className="flex justify-between items-center">
              <h2 className="font-bold font-serif text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
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
        </div>
      </div>

      <CalendarSection />
    </div>
  );
}
