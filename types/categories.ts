export type ActivityCategory =
  | "Phật Sự Trong Nước"
  | "Phật Sự Nước Ngoài"
  | "Lớp Học Phật Pháp"
  | "Tin Tức Khác";

export type CourseCategory =
  | "Khóa Tu Mùa Hè"
  | "Khóa Tu Xuất Gia Gieo Duyên"
  | "Khóa Thiền";

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  "Phật Sự Trong Nước",
  "Phật Sự Nước Ngoài",
  "Lớp Học Phật Pháp",
  "Tin Tức Khác",
];

export const COURSE_CATEGORIES: CourseCategory[] = [
  "Khóa Tu Mùa Hè",
  "Khóa Tu Xuất Gia Gieo Duyên",
  "Khóa Thiền",
];

export const isValidActivityCategory = (
  category: unknown,
): category is ActivityCategory => {
  return (
    typeof category === "string" &&
    ACTIVITY_CATEGORIES.includes(category as ActivityCategory)
  );
};

export const isValidCourseCategory = (
  category: unknown,
): category is CourseCategory => {
  return (
    typeof category === "string" &&
    COURSE_CATEGORIES.includes(category as CourseCategory)
  );
};
