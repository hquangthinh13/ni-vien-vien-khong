import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";

import ActivitiesSection from "@/features/activity/ui/ActivitiesSection";

import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import CourseSection from "@/features/activity/ui/CourseSection";
import VideoCard from "@/features/video/ui/VideoCard";

import { fetchHomePage } from "@/features/homePage/api/homePage.api";
import {
  fetchActivities,
  fetchActivitiesByCategory,
} from "@/features/activity/api/activity.api";
import { fetchVideo } from "@/features/video/api/video.api";
import ActivityCalendarDashboardSection from "@/features/activity/ui/ActivityCalendarDashboardSection";

import { getImageUrl } from "@/shared/lib/api";
import MotionWrapper from "@/shared/motion/MotionWrapper";

import { HomePageResponse } from "@/features/homePage/model/homePage.types";
import { ActivityResponse } from "@/features/activity/model/activity.types";
import { VideoPlaylistResponse } from "@/features/video/model/video.types";

import ornament from "@/public/ornament-01.svg";

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
          pagination: { limit: 5 },
          populate: "coverImage",
        }),
        { data: [] } as ActivityResponse,
      ),

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
        <div className="py-4 px-4 max-w-7xl mx-auto ">
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
      <div className="page-container gap-12">
        <MotionWrapper className="flex mb-6 max-w-2xl mx-auto">
          <section className="flex flex-col">
            <div className="flex w-fit mx-auto">
              <h1 className="home-page-section-title">
                {locale === "vi" ? "Lời ngỏ" : "Foreword"}
              </h1>
            </div>
            <p className="flex mt-4 leading-loose text-center text-muted-foreground">
              {homePage?.openingMessage}
            </p>{" "}
            <Image
              src={ornament}
              alt="Ornament"
              width={32}
              height={32}
              className="h-6 w-auto opacity-75 mt-4"
            />
          </section>{" "}
        </MotionWrapper>
        {activities.length > 0 && (
          <MotionWrapper>
            <section className="flex flex-col">
              <div className="flex justify-between items-center">
                <Link href="/activity">
                  <h2 className="home-page-section-title">
                    {locale === "vi" ? "Tin tức mới nhất" : "Latest Activities"}
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
            <section className="flex flex-col">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
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
        {courses.length > 0 && (
          <MotionWrapper>
            <section className="flex flex-col">
              <div className="flex justify-between items-center">
                <Link href="/activity">
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
              <ActivitiesSection locale={locale} activities={courses} />
            </section>{" "}
          </MotionWrapper>
        )}
        <MotionWrapper>
          <section className="flex flex-col">
            <Suspense fallback={<div>Đang tải lịch hoạt động...</div>}>
              {/* <CalendarSection locale={locale} /> */}
              <ActivityCalendarDashboardSection locale={locale} />
            </Suspense>
          </section>
        </MotionWrapper>{" "}
      </div>
    </main>
  );
}
