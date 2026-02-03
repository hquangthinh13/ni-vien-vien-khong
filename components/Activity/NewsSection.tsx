import React from "react";
async function getNewsData() {
  // const res = await fetch('https://api.yourbackend.com/posts');
  // return res.json();
  return MOCK_POSTS;
}
import { MOCK_POSTS } from "@/types/mock-posts";
import SimplifiedNewsCard from "@/components/Activity/SimplifiedNewsCard";

export default async function NewsSection() {
  const posts = await getNewsData();

  const rowOne = posts.slice(0, 2);
  const rowTwo = posts.slice(2, 5);

  return (
    <div className="mx-auto mt-4">
      {/* Row 1: 12-Column Grid for 70/30 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 border-b pb-4">
        {rowOne.map((post, index) => (
          <div
            key={post.id}
            className={
              index === 0 ? "col-span-8 lg:border-r pr-4" : "col-span-4"
            }
          >
            <SimplifiedNewsCard {...post} variant="top" isFirst={index === 0} />
          </div>
        ))}
      </div>

      {/* Row 2: 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-4">
        {rowTwo.map((post) => (
          <SimplifiedNewsCard key={post.id} {...post} variant="bottom" />
        ))}
      </div>
    </div>
  );
}
