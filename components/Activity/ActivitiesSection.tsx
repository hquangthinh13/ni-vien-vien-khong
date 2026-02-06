import React from "react";
import { fetchActivities } from "./Activity.service";

async function getActivitiesData() {
  const res = await fetchActivities({
    sort: ["publishedAt:desc"],
    pagination: { limit: 5 },
    populate: "coverImage",
  });
  console.log("Fetched activities data:", res);
  return res;
}
import SimplifiedNewsCard from "@/components/Activity/SimplifiedActivitiesCard";

export default async function ActivitiesSection() {
  const posts = await getActivitiesData();

  const data = Array.isArray(posts.data)
    ? posts.data
    : posts.data
      ? [posts.data]
      : [];
  const rowOne = data.slice(0, 2);
  const rowTwo = data.slice(2, 5);

  return (
    <div className="mx-auto mt-4">
      {/* Row 1: 12-Column Grid for 70/30 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 border-b pb-4">
        {rowOne.map(
          (post, index) =>
            post && (
              <div
                key={post.id}
                className={
                  index === 0 ? "col-span-8 lg:border-r pr-4" : "col-span-4"
                }
              >
                <SimplifiedNewsCard
                  key={post.id}
                  activity={post}
                  variant="top"
                  isFirst={index === 0}
                />
              </div>
            ),
        )}
      </div>

      {/* Row 2: 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4">
        {rowTwo.map(
          (post) =>
            post && (
              <SimplifiedNewsCard
                key={post.id}
                activity={post}
                variant="bottom"
              />
            ),
        )}
      </div>
    </div>
  );
}
