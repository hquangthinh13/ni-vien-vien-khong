import Image from "next/image";
import coverImage from "../public/homepage-cover.jpg";
import ornament from "../public/ornament-01.svg";
import lineOrnament from "../public/ornament-00.svg";
import NewsCard from "@/components/NewsCard";
import EventCalendar from "@/components/EventCalendar";
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
      {/* <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">
          Số bài trên trang
        </FieldLabel>
        <Select defaultValue="25">
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">3</SelectItem>
              <SelectItem value="25">5</SelectItem>
              <SelectItem value="50">10</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field> */}
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
  const t = useTranslations("Homepage");

  return (
    <div className="mx-auto max-w-4xl px-4 ">
      <Image
        className="rounded-lg shadow-lg my-6"
        src={coverImage}
        alt="Cover image"
        placeholder="blur" // blurred preview while loading
      />
      <div className="flex flex-1 justify-center">
        <Image
          src={lineOrnament}
          alt="Ornament"
          className="w-auto h-6 mt-24 mb-12 opacity-60"
        />
      </div>
      <div className="flex flex-1 flex-col gap-6 justify-between items-center">
        <h2 className="font-bold text-md tracking-widest uppercase whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
          {t("foreword")}
        </h2>

        <p className="flex max-w-lg text-center italic text-muted-foreground">
          {" "}
          Trang web vienkhongni.com ra đời nhằm mục đích cho sự tiện ích đến
          toàn thể thân hữu, đạo hữu muốn tìm hiểu những sinh hoạt tín ngưỡng,
          tu tập, văn hoá, giáo dục, xã hội... của Ni Viện Viên Không và Ni Sư
          Liễu Pháp.
        </p>
      </div>

      <div className="flex flex-1 justify-center scale-y-[-1] opacity-60">
        <Image
          src={lineOrnament}
          alt="Ornament"
          className="w-auto h-6 mb-12 mt-24"
        />
      </div>

      <div className="flex flex-1 flex-col gap-6 justify-between items-center mb-24">
        <h2 className="font-bold text-md tracking-widest uppercase whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
          Sự kiện
        </h2>

        <div className=" mx-auto px-0 pb-8">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <EventCalendar />
    </div>
  );
}
