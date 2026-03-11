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

export const formatFriendlyDate = (
  dateString: string,
  locale: string,
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
  return locale === "vi"
    ? `${timePart} ngày ${datePart}`
    : `${datePart}, ${timePart}`;
};
export const formatShortDate = (
  dateString: string,
  locale: string = "vi",
): string => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Kiểm tra tính hợp lệ của ngày
  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  if (locale === "vi") {
    // Định dạng: Ngày 8 tháng 2, 2024
    return `Ngày ${day} tháng ${month + 1}, ${year}`;
  } else {
    // Định dạng tiếng Anh: February 8, 2024
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
export const extractFirstFourLines = (content?: BlocksContent): string => {
  if (!content || content.length === 0) return "";

  let fullText = "";

  // 1. Duyệt qua tất cả các blocks để lấy text thô
  for (const block of content) {
    if (block.type === "paragraph" && block.children) {
      const blockText = block.children
        .map((child) => ("text" in child ? child.text : ""))
        .join("");

      // Thêm dấu xuống dòng sau mỗi block paragraph để phân tách dòng thực tế
      fullText += blockText + "\n";
    }
  }

  // 2. Tách chuỗi thành mảng các dòng dựa trên ký tự xuống dòng
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0); // Loại bỏ dòng trống nếu cần

  // 3. Lấy 4 dòng đầu tiên và nối lại
  return lines.slice(0, 4).join("\n");
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
