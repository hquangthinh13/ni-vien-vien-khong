import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BlocksContent } from "@strapi/blocks-react-renderer";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getVideoId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const formatFriendlyDate = (dateString: string, locale: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const timePart = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: locale === "en",
  }).format(date);

  const datePart = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return locale === "vi"
    ? `${timePart} ngày ${datePart}`
    : `${datePart}, ${timePart}`;
};

export const extractFirstParagraph = (content?: BlocksContent): string => {
  if (!content || content.length === 0) return "";

  // Tìm block đầu tiên có type là 'paragraph'
  const firstParagraph = content.find(
    (block): block is Extract<BlocksContent[number], { type: "paragraph" }> =>
      block.type === "paragraph",
  );

  if (!firstParagraph || !firstParagraph.children) return "";

  // Sử dụng reduce hoặc map để nối chuỗi từ các children
  return firstParagraph.children
    .map((child) => {
      // Chỉ lấy text nếu child có thuộc tính 'text'
      if ("text" in child) {
        return child.text;
      }
      return "";
    })
    .join("")
    .trim();
};
