"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ActivityVibrantCard from "./ActivityVibrantCard";
import { fetchCoursesByCategory } from "@/features/activity/api/activity.api";
import type { Activity } from "@/features/activity/model/activity.types";
import type { CourseCategory } from "@/types/categories";
import type { Locale } from "@/types/locale";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface CourseListProps {
  initialCourses: Activity[];
  initialCategory: CourseCategory;
  locale: Locale;
}

export default function CourseList({
  initialCourses,
  initialCategory,
  locale,
}: CourseListProps) {
  const [courses, setCourses] = useState<Activity[]>(initialCourses);
  const [category, setCategory] = useState<CourseCategory>(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView();

  const handleTabChange = async (value: string) => {
    const newCategory = value as CourseCategory;
    setCategory(newCategory);
    setLoading(true);

    try {
      const res = await fetchCoursesByCategory({
        locale,
        category: newCategory,
        pagination: { page: 1, pageSize: 8 },
        populate: "coverImage",
        sort: "activityStartDate:desc",
      });

      const newData = Array.isArray(res.data) ? res.data : [];
      setCourses(newData);
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
          const res = await fetchCoursesByCategory({
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
            setCourses((prev) => [...prev, ...newData]);
            setPage(nextPage);
            setHasMore(newData.length === 8);
          }
        } catch (error) {
          console.error("Failed to load more courses:", error);
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
            <TabsTrigger value="Khóa Tu Mùa Hè">Khóa Tu Mùa Hè</TabsTrigger>
            <TabsTrigger value="Khóa Tu Xuất Gia Gieo Duyên ">
              Khóa Tu Xuất Gia Gieo Duyên
            </TabsTrigger>
            <TabsTrigger value="Khóa Thiền">Khóa Thiền</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full max-w-7xl">
        {courses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {courses.map((course) => (
              <div key={course.documentId} className="w-full">
                <ActivityVibrantCard activity={course} locale={locale} />
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
      <div ref={ref} className="min-h-[200px] w-full mt-2 max-w-7xl"></div>
    </div>
  );
}
