import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import type { Locale } from "@/types/locale";
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

export const formatFriendlyDate = (
  dateString: string,
  locale: Locale,
  includeTime: boolean = true, // Mặc định là true
) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  // 1. Định dạng phần ngày (Luôn có)
  const datePart = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  // 2. Nếu không cần hiển thị giờ, trả về phần ngày luôn
  if (!includeTime) {
    return datePart;
  }

  // 3. Định dạng phần giờ
  const timePart = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: locale === "en",
  }).format(date);

  // 4. Kết hợp lại dựa trên ngôn ngữ
  // return locale === "vi"
  //   ? `${timePart} ngày ${datePart}`
  //   : `${datePart}, ${timePart}`;

  return locale === "vi" ? `${datePart}` : `${datePart}, ${timePart}`;
};
export const formatShortDate = (
  dateString: string,
  locale: Locale = "vi",
): string => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Kiểm tra tính hợp lệ của ngày
  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  if (locale === "vi") {
    return `${day} tháng ${month + 1}, ${year}`;
  } else {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month]} ${day}, ${year}`;
  }
};

export const extractPreviewContent = (
  content?: BlocksContent,
  maxLength: number = 400,
): string => {
  if (!content || content.length === 0) return "";

  let fullText = "";

  for (const block of content) {
    // Chỉ lấy text từ các block dạng paragraph hoặc heading để tránh lấy text rác từ các block đặc biệt
    if (block.type === "paragraph" || block.type.startsWith("heading")) {
      const blockText = block.children
        .map((child) => ("text" in child ? child.text : ""))
        .join("");

      fullText += blockText + " ";
    }

    if (fullText.length >= maxLength) break;
  }

  const trimmedText = fullText.trim();

  if (trimmedText.length > maxLength) {
    return trimmedText.substring(0, maxLength).split(/\s(?=\S*$)/)[0] + "...";
  }

  return trimmedText;
};

export const extractPoemPreviewContent = (
  content?: BlocksContent,
  maxLength: number = 400,
): string => {
  if (!content || content.length === 0) return "";

  const lines: string[] = [];

  for (const block of content) {
    if (block.type === "paragraph" || block.type.startsWith("heading")) {
      const blockText = block.children
        .map((child) => ("text" in child ? child.text : ""))
        .join("")
        .trim();

      if (blockText) {
        lines.push(blockText);
      }
    }

    if (lines.join("\n").length >= maxLength) break;
  }

  const fullText = lines.join("\n").trim();

  if (fullText.length > maxLength) {
    return fullText.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
  }

  return fullText;
};

export const formatTimeShort = (timeStr: string) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}`;
};

export const parseTimeToDecimal = (timeStr: string) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours + minutes / 60;
};

export const isRichTextEmpty = (
  content: BlocksContent | null | undefined,
): boolean => {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return true;
  }

  return content.every((block) => {
    if (!block.children || block.children.length === 0) return true;

    return block.children.every((child) => {
      if ("text" in child) {
        return child.text.trim() === "";
      }
      return false;
    });
  });
};

export const getDocumentIdFromSlug = (slug: string) => {
  const parts = slug.split("-");
  return parts.pop() as string;
};

export function getYouTubeThumbnail(
  url: string,
  quality: "maxres" | "hq" | "sd" | "default" = "maxres",
): string | null {
  // Regex để trích xuất ID video từ các định dạng URL phổ biến
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];

    // Bản đồ các loại chất lượng ảnh
    const qualityMap = {
      maxres: "maxresdefault",
      hq: "hqdefault",
      sd: "sddefault",
      default: "default",
    };

    const suffix = qualityMap[quality] || "maxresdefault";
    return `https://img.youtube.com/vi/${videoId}/${suffix}.jpg`;
  }

  return null;
}
