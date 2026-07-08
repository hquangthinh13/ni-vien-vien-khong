import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Images,
  MessageCircleQuestion,
} from "lucide-react";
import type { Locale } from "@/types/locale";

interface HomeQuickLinksProps {
  locale: Locale;
}

const HomeQuickLinks = ({ locale }: HomeQuickLinksProps) => {
  const links = [
    {
      title: locale === "vi" ? "Pháp thoại" : "Dharma Talks",
      description:
        locale === "vi" ? "Nghe bài giảng Phật pháp" : "Listen to teachings",
      href: "/library/video",
      Icon: BookOpen,
    },
    {
      title: locale === "vi" ? "Khóa tu" : "Courses",
      description:
        locale === "vi" ? "Lịch tu và đăng ký" : "Schedule & registration",
      href: "/course",
      Icon: CalendarDays,
    },
    {
      title: locale === "vi" ? "Thư viện" : "Library",
      description:
        locale === "vi"
          ? "Hình ảnh, video, tư liệu"
          : "Images, videos & resources",
      href: "/library",
      Icon: Images,
    },
    {
      title: locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A",
      description:
        locale === "vi" ? "Gửi câu hỏi, đọc giải đáp" : "Ask & read answers",
      href: "/library/question",
      Icon: MessageCircleQuestion,
    },
  ];

  return (
    <section className="mb-8">
      <div
        className="grid grid-cols-2 gap-[1px] overflow-hidden rounded-lg border border-none"
        style={{ background: "#c8a06a" }}
      >
        {links.map(({ title, description, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 bg-[#f9f3ea] px-4 py-3.5 transition-colors duration-200 hover:bg-[#f2e8d5]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c8a06a] bg-[#f2e8d5] transition-colors duration-200 group-hover:bg-[#e8d5b8]">
              <Icon className="h-4 w-4 text-[#8a6040]" strokeWidth={1.5} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-serif text-[0.85rem] font-semibold leading-snug text-[#3d2008]">
                {title}
              </p>
              <p className="truncate font-serif text-[0.7rem] italic leading-snug text-[#8a6040]">
                {description}
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-[#c4a07a] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8a6040]">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeQuickLinks;
