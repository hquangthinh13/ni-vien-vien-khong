import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import ActivitiesSection from "@/features/activity/ui/ActivitiesSection";
import QuestionSection from "@/features/question/ui/QuestionSection";
import CalendarSection from "@/features/activity/ui/CalendarSection";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
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

import { HomePageResponse } from "@/features/homePage/model/homePage.types";
import { ActivityResponse } from "@/features/activity/model/activity.types";
import { QuestionResponse } from "@/features/question/model/question.types";
async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    const data = await promise;
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return fallback;
  }
}

export default async function Home() {
  const locale = (await getLocale()) as Locale;
  const category = "Khóa Tu";
  // const [homePageResponse, activityResponse, courseResponse, questionResponse] =
  //   await Promise.all([
  //     fetchHomePage({ populate: "*", locale }),
  //     fetchActivities({
  //       sort: ["publishedAt:desc"],
  //       pagination: { limit: 5 },
  //       populate: "*",
  //       locale,
  //     }),
  //     fetchActivitiesByCategory({
  //       locale,
  //       category: category,
  //       sort: ["activityStartDate:desc"],
  //       pagination: { limit: 4 },
  //       populate: "coverImage",
  //     }),
  //     fetchAnsweredQuestions({
  //       locale,
  //       sort: ["publishedAt:desc"],
  //       pagination: { limit: 3 },
  //       populate: "*",
  //     }),
  //   ]).catch((error) => {
  //     console.error("Error fetching data for home page:", error);
  //     return [null, null, null, null];
  //   });

  // const homePage = homePageResponse?.data || null;
  const [homePageResponse, activityResponse, courseResponse, questionResponse] =
    await Promise.all([
      safeFetch(fetchHomePage({ populate: "*", locale }), {
        data: null,
      } as HomePageResponse),
      safeFetch(
        fetchActivities({
          sort: ["publishedAt:desc"],
          pagination: { limit: 5 },
          populate: "*",
          locale,
        }),
        { data: [] } as ActivityResponse,
      ),
      safeFetch(
        fetchActivitiesByCategory({
          locale,
          category: category,
          sort: ["activityStartDate:desc"],
          pagination: { limit: 4 },
          populate: "coverImage",
        }),
        { data: [] } as ActivityResponse,
      ),
      safeFetch(
        fetchAnsweredQuestions({
          locale,
          sort: ["publishedAt:desc"],
          pagination: { limit: 3 },
          populate: "*",
        }),
        { data: [] } as QuestionResponse,
      ),
    ]);

  // 3. Xử lý dữ liệu (TypeScript sẽ rất hài lòng với cách này)
  const homePage =
    homePageResponse?.data && !Array.isArray(homePageResponse.data)
      ? homePageResponse.data
      : null;
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
        <div className="flex flex-col lg:flex-row min-h-12 gap-6 mb-6">
          {/* Left */}
          <div className="flex flex-col justify-start gap-6 lg:w-[70%]">
            <MotionWrapper className="flex lg:hidden">
              <section className="flex flex-col">
                <div className="flex w-fit">
                  {" "}
                  <h1 className="home-page-section-title">
                    {locale === "vi" ? "Lời ngỏ" : "Foreword"}
                  </h1>
                </div>
                <p className="flex mt-4 leading-snug text-justify text-muted-foreground">
                  {homePage?.openingMessage}
                </p>
              </section>{" "}
            </MotionWrapper>
            {activities.length > 0 && (
              <MotionWrapper>
                <section className="flex flex-col pt-6 lg:pt-0 border-t-0 lg:border-0">
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
              <section className="flex flex-col pt-6 border-t-0">
                <Suspense fallback={<div>Đang tải lịch hoạt động...</div>}>
                  <CalendarSection locale={locale} />
                </Suspense>
              </section>
            </MotionWrapper>{" "}
          </div>
          {/* Right */}
          <div className="flex flex-col lg:w-[30%] lg:border-l-0 pl-0 lg:pl-6 gap-6 lg:sticky lg:top-24 lg:h-fit">
            <MotionWrapper className="lg:flex hidden">
              <section className="flex flex-col">
                <div className="flex w-fit">
                  <h1 className="home-page-section-title">
                    {locale === "vi" ? "Lời ngỏ" : "Foreword"}
                  </h1>
                </div>
                <p className="flex mt-4 leading-snug text-justify text-muted-foreground">
                  {homePage?.openingMessage}
                </p>
              </section>{" "}
            </MotionWrapper>
            {courses.length > 0 && (
              <MotionWrapper>
                <section className="flex flex-col pt-6 border-t-0">
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
              <section className="flex flex-1 flex-col pt-6 pb-0 border-t-0">
                <div className="flex justify-between items-center">
                  <Link href="/library/question">
                    <h2 className="home-page-section-title">
                      {locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A"}
                    </h2>
                  </Link>
                  {/* <Link
                    href="/library/question"
                    className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                  >
                    {locale === "vi" ? "Xem thêm" : "View more"}
                  </Link> */}
                  <QuestionDialogTrigger locale={locale} />
                </div>
                <QuestionSection locale={locale} questions={questions} />
              </section>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </main>
  );
}
