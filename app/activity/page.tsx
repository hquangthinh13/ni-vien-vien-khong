import Image from "next/image";
import ornament from "../public/ornament-01.svg";
import lineOrnament from "@/public/ornament-00.svg";
import NewsCard from "@/components/Activity/NewsCard";
import EventCalendar from "@/components/Activity/EventCalendar";
import { useTranslations } from "next-intl";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaginationIconsOnly() {
  return (
    <div className="flex items-center justify-end gap-4 mt-4">
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
export const MOCK_POSTS = [
  {
    id: 1,
    slug: "dai-le-vu-lan-2026",
    title:
      "DANH SÁCH PHÁP THOẠI | KHÓA TU XUẤT GIA GIEO DUYÊN | LẦN 4 | DL2025 | PL.2569 – NI VIỆN VIÊN KHÔNG",
    imageUrl:
      "https://vienkhongni.com/wp-content/uploads/2025/10/LE-XUAT-GIA-GIEO-DUYEN-1.jpg",
    text: "Hòa chung không khí mùa báo hiếu, Ni Viện tổ chức đại lễ Vu Lan nhằm tri ân công đức sinh thành dưỡng dục của cha mẹ đại lễ Vu Lan nhằm tri ân công đức sinh thành dưỡng dục của cha mẹ...",
  },
  {
    id: 2,
    slug: "khoa-tu-mua-he",
    title: "Thông báo Khóa Tu Mùa Hè cho Thanh Thiếu Niên",
    imageUrl:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=800",
    text: "Khóa tu giúp các em rèn luyện kỹ năng sống, lòng hiếu thảo và tìm lại sự bình yên trong tâm hồn sau những ngày học tập căng thẳng.",
  },
  {
    id: 3,
    slug: "phap-thoai-thay-tru-tri",
    title: "LỄ DÂNG Y TẮM MƯA TẠI NI VIỆN VIÊN KHÔNG PL.2569",
    imageUrl:
      "https://vienkhongni.com/wp-content/uploads/2025/08/1-2048x1365.jpg", // Test how your UI handles a missing image
    text: "Kính mời quý Phật tử gần xa về tham dự buổi chia sẻ giáo lý định kỳ vào tối Chủ Nhật tuần này tại Chánh điện.",
  },
  {
    id: 4,
    slug: "tu-thien-mien-trung",
    title: "Chương Trình Thiện Nguyện 'Áo Ấm Cho Em'",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
    text: "Ni Viện đang kêu gọi sự đóng góp của các mạnh thường quân để chuẩn bị quà tết cho trẻ em vùng cao trong tháng tới.",
  },
  {
    id: 5,
    slug: "tu-thien-mien-trung",
    title: "Chương Trình Thiện Nguyện 'Áo Ấm Cho Em'",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
    text: "Ni Viện đang kêu gọi sự ",
  },
  {
    id: 6,
    slug: "dai-le-vu-lan-2026",
    title:
      "DANH SÁCH PHÁP THOẠI | KHÓA TU XUẤT GIA GIEO DUYÊN | LẦN 4 | DL2025 | PL.2569 – NI VIỆN VIÊN KHÔNG",
    imageUrl:
      "https://vienkhongni.com/wp-content/uploads/2025/10/LE-XUAT-GIA-GIEO-DUYEN-1.jpg",
    text: "Hòa chung không khí mùa báo hiếu, Ni Viện tổ chức đại lễ Vu Lan nhằm tri ân công đức sinh thành dưỡng dục của cha mẹ đại lễ Vu Lan nhằm tri ân công đức sinh thành dưỡng dục của cha mẹ...",
  },
];
export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="mx-auto max-w-6xl px-4 ">
      <div className="flex flex-1 flex-col gap-6 justify-between items-center mb-24">
        <h2 className="font-bold text-lg tracking-widest uppercase whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
          Tin tức
        </h2>

        <div className=" mx-auto px-0 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_POSTS.map((post) => (
              <NewsCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                imageUrl={post.imageUrl || null}
                text={post.text}
              />
            ))}
          </div>{" "}
          <PaginationIconsOnly />
        </div>
      </div>
    </div>
  );
}
