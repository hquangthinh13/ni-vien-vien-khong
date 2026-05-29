import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";

import ActivitiesSection from "@/features/activity/ui/ActivitiesSection";
import QuestionSection from "@/features/question/ui/QuestionSection";
import CalendarSection from "@/features/activity/ui/CalendarSection";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import CourseSection from "@/features/activity/ui/CourseSection";
import VideoCard from "@/features/video/ui/VideoCard";

import { fetchHomePage } from "@/features/homePage/api/homePage.api";
import {
  fetchActivities,
  fetchActivitiesByCategory,
} from "@/features/activity/api/activity.api";
import { fetchAnsweredQuestions } from "@/features/question/api/question.api";
import { fetchVideo } from "@/features/video/api/video.api";

import { getImageUrl } from "@/shared/lib/api";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import QuestionDialogTrigger from "@/features/question/ui/QuestionDialogTrigger";

import { HomePageResponse } from "@/features/homePage/model/homePage.types";
import { ActivityResponse } from "@/features/activity/model/activity.types";
import { QuestionResponse } from "@/features/question/model/question.types";
import {
  VideoPlaylist,
  VideoPlaylistResponse,
} from "@/features/video/model/video.types";
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
  const [homePageResponse, activityResponse, courseResponse, videoResponse] =
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
      // safeFetch(
      //   fetchAnsweredQuestions({
      //     locale,
      //     sort: ["publishedAt:desc"],
      //     pagination: { limit: 3 },
      //     populate: "*",
      //   }),
      //   { data: [] } as QuestionResponse,
      // ),
      safeFetch(
        fetchVideo({
          locale,
          sort: ["publishedAt:desc"],
          pagination: { limit: 3 },
          populate: "*",
        }),
        {
          data: [],
        } as VideoPlaylistResponse,
      ),
    ]);

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
  const videos = Array.isArray(videoResponse?.data)
    ? videoResponse.data
    : videoResponse?.data
      ? [videoResponse.data]
      : [];
  return (
    <main>
      <MotionWrapper>
        <div className="pt-4 px-4 max-w-7xl mx-auto ">
          <Image
            src={coverImage || "/placeholder.png"}
            alt="Cover image"
            width={1600}
            height={900}
            className="h-auto w-screen rounded-lg"
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR_DATA_URL}
            sizes="100vw"
            quality={75}
            priority
          />
        </div>
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
                        {locale === "vi"
                          ? "Tin tức mới nhất"
                          : "Latest Activities"}
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
            {videos.length > 0 && (
              <MotionWrapper>
                <section className="flex flex-col pt-6 border-t-0">
                  <div className="flex justify-between items-center">
                    <Link href="/library/video">
                      <h2 className="home-page-section-title">
                        {locale === "vi" ? "Pháp thoại" : "Dharma Talks"}
                      </h2>
                    </Link>
                    <div className="flex gap-2">
                      <Link
                        href="/library/video"
                        className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                      >
                        {locale === "vi" ? "Xem thêm" : "View more"}
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                    {videos.map((video, index) => (
                      <VideoCard
                        key={video.documentId}
                        video={video}
                        locale={locale}
                        isLastMobile={index === videos.length - 1}
                      />
                    ))}
                  </div>
                </section>
              </MotionWrapper>
            )}
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
                        {locale === "vi" ? "Khóa tu gần đây" : "Recent Courses"}
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
            {/* <MotionWrapper>
              <section className="flex flex-1 flex-col pt-6 pb-0 border-t-0">
                <div className="flex justify-between items-center">
                  <Link href="/library/question">
                    <h2 className="home-page-section-title">
                      {locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A"}
                    </h2>
                  </Link>
                
                  <QuestionDialogTrigger locale={locale} />
                </div>
                <QuestionSection locale={locale} questions={questions} />
              </section>
            </MotionWrapper> */}
          </div>
        </div>{" "}
        <MotionWrapper>
          <section className="flex flex-col pt-6 border-t-0">
            <Suspense fallback={<div>Đang tải lịch hoạt động...</div>}>
              <CalendarSection locale={locale} />
            </Suspense>
          </section>
        </MotionWrapper>{" "}
      </div>
    </main>
  );
}
