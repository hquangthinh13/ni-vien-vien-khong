export type ActivityCategory =
  | "Phật Sự Trong Nước"
  | "Phật Sự Nước Ngoài"
  | "Lớp Học Phật Pháp"
  | "Tin Tức Khác";

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  "Phật Sự Trong Nước",
  "Phật Sự Nước Ngoài",
  "Lớp Học Phật Pháp",
  "Tin Tức Khác",
];

export const isValidActivityCategory = (
  category: unknown,
): category is ActivityCategory => {
  return (
    typeof category === "string" &&
    ACTIVITY_CATEGORIES.includes(category as ActivityCategory)
  );
};
