import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import ActivitiesSection from "@/features/activity/ui/ActivitiesSection";
import QuestionSection from "@/features/question/ui/QuestionSection";
import CalendarSection from "@/features/activity/ui/CalendarSection";
import type { Locale } from "@/types/locale";
import { getTranslations, getLocale } from "next-intl/server";
import CourseSection from "@/features/activity/ui/CourseSection";
import { fetchHomePage } from "@/features/homePage/api/homePage.api";
import { HomePageAttributes } from "@/features/homePage/model/homePage.types";
import { getImageUrl } from "@/shared/lib/api";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import QuestionDialogTrigger from "@/features/question/ui/QuestionDialogTrigger";
export default async function Home() {
  const locale = (await getLocale()) as Locale;
  console.log("Check API URL:", process.env.NEXT_PUBLIC_API_URL);
  const t = await getTranslations("HomePage");

  const response = await fetchHomePage({ populate: "*", locale });
  // const [t, response] = await Promise.all([
  //   getTranslations("HomePage"),
  //   fetchHomePage({ populate: "*", locale }),
  // ]);
  const data = response.data as HomePageAttributes | null;
  const coverImage = getImageUrl(data?.coverImage, "original");

  return (
    <main>
      <MotionWrapper>
        <Image
          src={coverImage || "/placeholder.png"}
          alt="Cover image"
          width={1600}
          height={900}
          className="h-auto w-screen"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          sizes="100vw"
          quality={75}
          priority
        />
      </MotionWrapper>
      <div className="page-container">
        <div className="flex flex-col-reverse md:flex-row min-h-12 gap-6 mb-6">
          {/* Left */}
          <div className="flex flex-col justify-start gap-6 md:w-[70%]">
            <MotionWrapper>
              <section className="flex flex-col pt-6 md:pt-0 border-t md:border-0">
                <div className="flex justify-between items-center">
                  <h1 className="home-page-section-title">
                    {locale === "vi" ? "Tin tức" : "Activities"}
                  </h1>
                  <div className="flex gap-2">
                    <Link
                      href="/activity"
                      className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                    >
                      {locale === "vi" ? "Xem thêm" : "View more"}
                    </Link>
                  </div>
                </div>
                <Suspense fallback={<div>Đang tải tin tức...</div>}>
                  <ActivitiesSection locale={locale} />
                </Suspense>
              </section>{" "}
            </MotionWrapper>{" "}
            <MotionWrapper>
              <section className="flex flex-col pt-6 border-t">
                <Suspense fallback={<div>Đang tải lịch hoạt động...</div>}>
                  <CalendarSection locale={locale} />
                </Suspense>
              </section>
            </MotionWrapper>{" "}
          </div>
          {/* Right */}
          <div className="flex flex-col md:w-[30%] md:border-l pl-0 md:pl-6 gap-6">
            <MotionWrapper>
              <section className="flex flex-col">
                <div className="flex w-fit">
                  <h1 className="home-page-section-title">{t("foreword")}</h1>
                </div>
                <p className="flex mt-4 max-w-lg leading-snug text-justify text-muted-foreground">
                  {data?.openingMessage}
                </p>
              </section>{" "}
            </MotionWrapper>
            <MotionWrapper>
              <section className="flex flex-col pt-6 border-t">
                <div className="flex justify-between items-center">
                  <h1 className="home-page-section-title">
                    {locale === "vi" ? "Khóa tu" : "Courses"}
                  </h1>
                  <div className="flex gap-2">
                    <Link
                      href="/course"
                      className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                    >
                      {locale === "vi" ? "Xem thêm" : "View more"}
                    </Link>
                  </div>
                </div>
                <Suspense fallback={<div>Đang tải khóa tu...</div>}>
                  <CourseSection locale={locale} />
                </Suspense>
              </section>{" "}
            </MotionWrapper>{" "}
            <MotionWrapper>
              <section className="flex flex-1 flex-col pt-6 pb-0 border-t">
                <div className="flex justify-between items-center">
                  <h1 className="home-page-section-title">
                    {locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A"}
                  </h1>
                  <Link
                    href="/library/question"
                    className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                  >
                    {locale === "vi" ? "Xem thêm" : "View more"}
                  </Link>
                </div>
                <Suspense fallback={<div>Đang tải câu hỏi...</div>}>
                  <QuestionSection locale={locale} />{" "}
                </Suspense>

                <QuestionDialogTrigger locale={locale} />
              </section>{" "}
            </MotionWrapper>{" "}
          </div>
        </div>
      </div>{" "}
    </main>
  );
}
