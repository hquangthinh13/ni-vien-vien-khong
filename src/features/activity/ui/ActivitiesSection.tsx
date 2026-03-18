import React from "react";
import { fetchActivities } from "@/features/activity/api/activity.api";
import type { Locale } from "@/types/locale";

async function getActivitiesData({ locale }: { locale: Locale }) {
  const res = await fetchActivities({
    sort: ["publishedAt:desc"],
    pagination: { limit: 5 },
    populate: "*",
    locale,
  });
  // console.log("Fetched activities data:", res);
  return res;
}
import SimplifiedNewsCard from "@/features/activity/ui/SimplifiedActivitiesCard";
import MobileActivitiesCard from "@/features/activity/ui/MobileActivitiesCard";

export default async function ActivitiesSection({
  locale,
}: {
  locale: Locale;
}) {
  try {
    const posts = await getActivitiesData({ locale });

    const data = Array.isArray(posts?.data)
      ? posts.data
      : posts?.data
        ? [posts.data]
        : [];

    if (data.length === 0) {
      return <div className="p-4 text-gray-500">No activities found.</div>;
    }

    const rowOne = data.slice(0, 2);
    const rowTwo = data.slice(2, 5);
    return (
      <div className="mx-auto mt-4">
        <section className="flex flex-col lg:hidden gap-0">
          {data.map((post) => (
            <MobileActivitiesCard
              locale={locale}
              key={post.id}
              activity={post}
            />
          ))}
        </section>
        <section className="hidden lg:flex flex-col">
          {/* Row 1: 12-Column Grid for 70/30 split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b pb-4">
            {rowOne.map(
              (post, index) =>
                post && (
                  <div
                    key={post.id}
                    className={index === 0 ? "lg:border-r pr-4" : "pl-4"}
                  >
                    <SimplifiedNewsCard
                      key={post.id}
                      activity={post}
                      variant="top"
                      isFirst={index === 0}
                      locale={locale}
                    />
                  </div>
                ),
            )}
          </div>

          {/* Row 2: 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 ">
            {rowTwo.map(
              (post) =>
                post && (
                  <div key={post.id} className="not-last:border-r pr-4">
                    <SimplifiedNewsCard
                      key={post.id}
                      activity={post}
                      variant="bottom"
                      locale={locale}
                    />
                  </div>
                ),
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return <div className="p-4 text-red-500">Failed to load activities.</div>;
  }
}
