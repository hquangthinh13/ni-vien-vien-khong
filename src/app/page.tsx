import Image from "next/image";
import { Suspense } from "react";
import { DEFAULT_BLUR_DATA_URL } from "@/shared/constants/image-placeholders";

import { getAppLocale } from "@/shared/lib/i18n";
import Navbar from "@/shared/layout/Navbar";
import { fetchHomePage } from "@/features/homePage/api/homePage.api";
import { fetchActivities } from "@/features/activity/api/activity.api";
import { fetchVideo } from "@/features/video/api/video.api";
import ActivityCalendarDashboardSection from "@/features/activity/ui/ActivityCalendarDashboardSection";
import HomeEditorialLayout from "@/features/homePage/ui/HomeEditorialLayout";
import HomeEditorialNews from "@/features/homePage/ui/HomeEditorialNews";
import HomeVideoEditorialSection from "@/features/homePage/ui/HomeVideoEditorialSection";

import { getImageUrl } from "@/shared/lib/api";
import MotionWrapper from "@/shared/motion/MotionWrapper";

import { HomePageResponse } from "@/features/homePage/model/homePage.types";
import { ActivityResponse } from "@/features/activity/model/activity.types";
import { VideoPlaylistResponse } from "@/features/video/model/video.types";

import decoration from "@/public/ornament-00.svg";

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
  const locale = await getAppLocale();
  // const category = "Khóa Tu";

  // const homePage = homePageResponse?.data || null;
  const [homePageResponse, activityResponse, videoResponse] = await Promise.all(
    [
      safeFetch(fetchHomePage({ populate: "*", locale }), {
        data: null,
      } as HomePageResponse),
      safeFetch(
        fetchActivities({
          sort: ["publishedAt:desc"],
          pagination: { limit: 8 },
          populate: "*",
          locale,
        }),
        { data: [] } as ActivityResponse,
      ),
      // safeFetch(
      //   fetchActivitiesByCategory({
      //     locale,
      //     category: "Khóa Tu",
      //     sort: ["activityStartDate:desc"],
      //     pagination: { limit: 5 },
      //     populate: "coverImage",
      //   }),
      //   { data: [] } as ActivityResponse,
      // ),
      safeFetch(
        fetchVideo({
          locale,
          sort: ["publishedAt:desc"],
          pagination: { limit: 4 },
          populate: "*",
        }),
        {
          data: [],
        } as VideoPlaylistResponse,
      ),
    ],
  );
  // console.log("activityResponse", activityResponse);
  // console.log(courseResponse);
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
  // const courses = Array.isArray(courseResponse?.data)
  //   ? courseResponse.data
  //   : courseResponse?.data
  //     ? [courseResponse.data]
  //     : [];
  const videos = Array.isArray(videoResponse?.data)
    ? videoResponse.data
    : videoResponse?.data
      ? [videoResponse.data]
      : [];
  return (
    <main>
      <MotionWrapper>
        <div className="flex flex-col lg:h-screen">
          <Navbar />

          {/* Mobile */}
          <div className="lg:hidden">
            <Image
              src={coverImage || "/placeholder.png"}
              alt="Cover image"
              width={1920}
              height={1080}
              className="w-full h-auto"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              priority
            />
          </div>

          {/* Desktop */}
          <div className="hidden lg:block relative flex-1">
            <Image
              src={coverImage || "/placeholder.png"}
              alt="Cover image"
              fill
              className="object-cover object-[10%_center]"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              priority
            />
          </div>
        </div>
      </MotionWrapper>

      <HomeEditorialLayout>
        <MotionWrapper>
          <section className="mx-auto flex max-w-3xl flex-col items-center justify-center py-2 text-center md:py-4">
            <div className="mx-auto flex w-fit">
              <h1 className="home-page-section-title">
                {locale === "vi" ? "Lời ngỏ" : "Foreword"}
              </h1>
            </div>
            <p className="mt-6 text-sm leading-8 text-muted-foreground md:text-base md:leading-9">
              {homePage?.openingMessage}
            </p>
            <Image
              src={decoration}
              alt="Ornament"
              width={32}
              height={32}
              className="mt-10 h-4 w-auto opacity-70"
            />
          </section>
        </MotionWrapper>

        {activities.length > 0 ? (
          <MotionWrapper>
            <HomeEditorialNews locale={locale} activities={activities} />
          </MotionWrapper>
        ) : null}

        {videos.length > 0 ? (
          <MotionWrapper>
            <HomeVideoEditorialSection locale={locale} videos={videos} />
          </MotionWrapper>
        ) : null}

        <MotionWrapper>
          <section>
            <Suspense
              fallback={
                <div className="py-16 text-center font-mono text-sm text-muted-foreground">
                  {locale === "vi"
                    ? "Đang tải lịch hoạt động..."
                    : "Loading activity calendar..."}
                </div>
              }
            >
              <ActivityCalendarDashboardSection locale={locale} />
            </Suspense>
          </section>
        </MotionWrapper>
      </HomeEditorialLayout>
    </main>
  );
}
