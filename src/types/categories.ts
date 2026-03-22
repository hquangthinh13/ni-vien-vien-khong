export type ActivityCategory =
  | "Phật Sự Trong Nước"
  | "Phật Sự Nước Ngoài"
  | "Lớp Học Phật Pháp"
  | "Tin Tức Khác"
  | "Khóa Tu"
  | "Tất cả";

export type CourseCategory =
  | "Khóa Tu Mùa Hè"
  | "Khóa Tu Xuất Gia Gieo Duyên"
  | "Khóa Thiền"
  | "Khác"
  | "Tất cả";

export type LinkedDocumentCategory =
  | "Tạng Kinh"
  | "Tạng Luật"
  | "Tạng Luận"
  | "Tạng Vi Diệu Pháp"
  | "Sách Sơ Tổ Hộ Tông"
  | "Sách Sư Ông Viên Minh"
  | "Tài Liệu Học Pali"
  | "Danh Mục Sách Khác";
export type CalligraphyCategory =
  | "Kinh Pháp Cú"
  | "Kinh Tụng"
  | "Chủ Đề Khác"
  | "Tất cả";

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  "Phật Sự Trong Nước",
  "Phật Sự Nước Ngoài",
  "Lớp Học Phật Pháp",
  "Tin Tức Khác",
  "Khóa Tu",
  "Tất cả",
];

export const COURSE_CATEGORIES: CourseCategory[] = [
  "Khóa Tu Mùa Hè",
  "Khóa Tu Xuất Gia Gieo Duyên",
  "Khóa Thiền",
  "Tất cả",
];

export const LINKED_DOCUMENT_CATEGORIES: LinkedDocumentCategory[] = [
  "Tạng Kinh",
  "Tạng Luật",
  "Tạng Vi Diệu Pháp",
  "Sách Sơ Tổ Hộ Tông",
  "Sách Sư Ông Viên Minh",
  "Tài Liệu Học Pali",
  "Danh Mục Sách Khác",
];

export const CALLIGRAPHY_CATEGORIES: CalligraphyCategory[] = [
  "Kinh Pháp Cú",
  "Kinh Tụng",
  "Chủ Đề Khác",
  "Tất cả",
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

export const isValidLinkedDocumentCategory = (
  category: unknown,
): category is LinkedDocumentCategory => {
  return (
    typeof category === "string" &&
    LINKED_DOCUMENT_CATEGORIES.includes(category as LinkedDocumentCategory)
  );
};

export const isValidCalligraphyCategory = (
  category: unknown,
): category is CalligraphyCategory => {
  return (
    typeof category === "string" &&
    CALLIGRAPHY_CATEGORIES.includes(category as CalligraphyCategory)
  );
};
