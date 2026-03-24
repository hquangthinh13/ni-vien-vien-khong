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
import {
  fetchActivities,
  fetchActivitiesByCategory,
} from "@/features/activity/api/activity.api";
import { fetchAnsweredQuestions } from "@/features/question/api/question.api";

import { getImageUrl } from "@/shared/lib/api";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import QuestionDialogTrigger from "@/features/question/ui/QuestionDialogTrigger";
export default async function Home() {
  const locale = (await getLocale()) as Locale;

  const category = "Khóa Tu";
  const [
    t,
    homePageResponse,
    activityResponse,
    courseResponse,
    questionResponse,
  ] = await Promise.all([
    getTranslations("HomePage"),
    fetchHomePage({ populate: "*", locale }),
    fetchActivities({
      sort: ["publishedAt:desc"],
      pagination: { limit: 5 },
      populate: "*",
      locale,
    }),
    fetchActivitiesByCategory({
      locale,
      category: category,
      sort: ["activityStartDate:desc"],
      pagination: { limit: 5 },
      populate: "coverImage",
    }),
    fetchAnsweredQuestions({
      locale,
      sort: ["publishedAt:desc"],
      pagination: { limit: 3 },
      populate: "*",
    }),
  ]);
  const homePage = homePageResponse.data || null;
  const coverImage = getImageUrl(homePage?.coverImage, "original");

  const activities = Array.isArray(activityResponse?.data)
    ? activityResponse.data
    : activityResponse?.data
      ? [activityResponse.data]
      : [];
  const courses = Array.isArray(courseResponse?.data)
    ? courseResponse.data
    : courseResponse?.data
      ? [courseResponse.data]
      : [];
  const questions = Array.isArray(questionResponse?.data)
    ? questionResponse.data
    : questionResponse?.data
      ? [questionResponse.data]
      : [];
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
        <div className="flex flex-col-reverse lg:flex-row min-h-12 gap-6 mb-6">
          {/* Left */}
          <div className="flex flex-col justify-start gap-6 lg:w-[70%]">
            {activities.length > 0 && (
              <MotionWrapper>
                <section className="flex flex-col pt-6 lg:pt-0 border-t lg:border-0">
                  <div className="flex justify-between items-center">
                    <Link href="/activity">
                      <h2 className="home-page-section-title">
                        {locale === "vi" ? "Tin tức" : "Activities"}
                      </h2>
                    </Link>
                    <div className="flex gap-2">
                      <Link
                        href="/activity"
                        className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                      >
                        {locale === "vi" ? "Xem thêm" : "View more"}
                      </Link>
                    </div>
                  </div>
                  <ActivitiesSection locale={locale} activities={activities} />
                </section>{" "}
              </MotionWrapper>
            )}
            <MotionWrapper>
              <section className="flex flex-col pt-6 border-t">
                <Suspense fallback={<div>Đang tải lịch hoạt động...</div>}>
                  <CalendarSection locale={locale} />
                </Suspense>
              </section>
            </MotionWrapper>{" "}
          </div>
          {/* Right */}
          <div className="flex flex-col lg:w-[30%] lg:border-l pl-0 lg:pl-6 gap-6">
            <MotionWrapper>
              <section className="flex flex-col">
                <div className="flex w-fit">
                  {" "}
                  <h1 className="home-page-section-title">{t("foreword")}</h1>
                </div>
                <p className="flex mt-4 leading-snug text-justify text-muted-foreground">
                  {homePage?.openingMessage}
                </p>
              </section>{" "}
            </MotionWrapper>
            {courses.length > 0 && (
              <MotionWrapper>
                <section className="flex flex-col pt-6 border-t">
                  <div className="flex justify-between items-center">
                    {" "}
                    <Link href="/course">
                      <h2 className="home-page-section-title">
                        {locale === "vi" ? "Khóa tu" : "Courses"}
                      </h2>
                    </Link>
                    <div className="flex gap-2">
                      <Link
                        href="/course"
                        className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                      >
                        {locale === "vi" ? "Xem thêm" : "View more"}
                      </Link>
                    </div>
                  </div>
                  <CourseSection locale={locale} courses={courses} />
                </section>
              </MotionWrapper>
            )}
            <MotionWrapper>
              <section className="flex flex-1 flex-col pt-6 pb-0 border-t">
                <div className="flex justify-between items-center">
                  <Link href="/library/question">
                    <h2 className="home-page-section-title">
                      {locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A"}
                    </h2>
                  </Link>
                  <Link
                    href="/library/question"
                    className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                  >
                    {locale === "vi" ? "Xem thêm" : "View more"}
                  </Link>
                </div>
                <QuestionSection locale={locale} questions={questions} />

                <QuestionDialogTrigger locale={locale} />
              </section>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </main>
  );
}
