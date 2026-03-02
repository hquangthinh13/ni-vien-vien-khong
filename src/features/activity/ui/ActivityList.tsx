"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ActivityCard from "./ActivityCard";
import { fetchActivitiesByCategory } from "../api/activity.api";
import type { Activity } from "../model/activity.types";
import type { ActivityCategory as ActivityCategoryType } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface ActivityListProps {
  initialActivities: Activity[];
  initialCategory: ActivityCategoryType;
  locale: Locale;
}

export default function ActivityList({
  initialActivities,
  initialCategory,
  locale,
}: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [category, setCategory] =
    useState<ActivityCategoryType>(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView();

  const handleTabChange = async (value: string) => {
    const newCategory = value as ActivityCategoryType;
    setCategory(newCategory);
    setLoading(true);

    try {
      const res = await fetchActivitiesByCategory({
        locale,
        category: newCategory,
        pagination: { page: 1, pageSize: 8 },
        populate: "coverImage",
        sort: "activityDate:desc",
      });

      const newData = Array.isArray(res.data) ? res.data : [];
      setActivities(newData);
      setPage(1);
      setHasMore(newData.length >= 8);
    } catch (error) {
      console.error("Failed to change category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const loadMore = async () => {
        setLoading(true);
        const nextPage = page + 1;
        try {
          const res = await fetchActivitiesByCategory({
            locale,
            category,
            pagination: { page: nextPage, pageSize: 8 },
            populate: "coverImage",
            sort: "activityDate:desc",
          });

          const newData = Array.isArray(res.data) ? res.data : [];
          if (newData.length === 0) {
            setHasMore(false);
          } else {
            setActivities((prev) => [...prev, ...newData]);
            setPage(nextPage);
            setHasMore(newData.length === 8);
          }
        } catch (error) {
          console.error("Failed to load more activities:", error);
        } finally {
          setLoading(false);
        }
      };
      loadMore();
    }
  }, [inView, hasMore, loading, category, page, locale]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-full justify-center mb-6">
        <Tabs
          defaultValue={initialCategory}
          onValueChange={handleTabChange}
          className="w-full flex flex-col items-center"
        >
          <TabsList variant="line">
            <TabsTrigger value="Phật Sự Trong Nước">
              Phật sự trong nước
            </TabsTrigger>
            <TabsTrigger value="Phật Sự Nước Ngoài">
              Phật sự ngoài nước
            </TabsTrigger>
            <TabsTrigger value="Lớp Học Phật Pháp">
              Lớp học Phật pháp
            </TabsTrigger>
            <TabsTrigger value="Tin Tức Khác">Tin tức khác</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full max-w-7xl">
        {activities.length > 0 ? (
          <div className="flex flex-wrap gap-4 w-full">
            {activities.map((activity) => (
              <div
                key={activity.documentId}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <ActivityCard activity={activity} locale={locale} />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="w-full text-sm flex justify-center items-start py-20 text-muted-foreground">
              Không có dữ liệu cho mục này.
            </div>
          )
        )}
      </div>

      {/* Infinite Scroll Trigger Area */}
      <div ref={ref} className="min-h-[200px] w-full mt-2 max-w-10xl"></div>
    </div>
  );
}
