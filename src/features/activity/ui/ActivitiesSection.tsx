import React from "react";
import type { Locale } from "@/types/locale";
import SimplifiedNewsCard from "@/features/activity/ui/SimplifiedActivitiesCard";
import MobileActivitiesCard from "@/features/activity/ui/MobileActivitiesCard";
import { Activity } from "../model/activity.types";

export default async function ActivitiesSection({
  locale,
  activities,
}: {
  locale: Locale;
  activities: Activity[];
}) {
  const rowOne = activities.slice(0, 2);
  const rowTwo = activities.slice(2, 5);
  const rowThree = activities.slice(5, 8);

  return (
    <div className="mx-auto mt-4">
      <section className="grid grid-cols-1 gap-6 lg:hidden">
        {activities.map((post, index) => (
          <MobileActivitiesCard
            locale={locale}
            key={post.id}
            activity={post}
            variant={index === 0 ? "hero" : "compact"}
          />
        ))}
      </section>
      <section className="hidden lg:flex flex-col">
        {/* Row 1: 12-Column Grid for 70/30 split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b-0">
          {rowOne.map(
            (post, index) =>
              post && (
                <div
                  key={post.id}
                  // className={index === 0 ? "lg:border-r-0" : "pl-0"}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 ">
          {rowTwo.map(
            (post) =>
              post && (
                <div key={post.id} className="">
                  <SimplifiedNewsCard
                    key={post.id}
                    activity={post}
                    variant="top"
                    locale={locale}
                  />
                </div>
              ),
          )}
        </div>

        {/* Row 2: 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 ">
          {rowThree.map(
            (post) =>
              post && (
                <div key={post.id} className="">
                  <SimplifiedNewsCard
                    key={post.id}
                    activity={post}
                    variant="top"
                    locale={locale}
                  />
                </div>
              ),
          )}
        </div>
      </section>
    </div>
  );
}
