import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import coverImage from "@/public/homepage-cover.jpg";
import lineOrnament from "@/public/ornament-00.svg";
import ornament from "@/public/ornament-01.svg";

export default function BlogPost() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Navigation & Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 -ml-2 text-muted-foreground"
        >
          <Link href="/blog">
            <ChevronLeft size={16} />
            Quay lại tin tức
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content: 70% Width */}
        <article className="lg:w-[70%]">
          {/* Header */}
          <header className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>Sự kiện</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1 text-muted-foreground normal-case font-normal">
                <Calendar size={14} />
                28/01/2025
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Đại Lễ Phật Đản 2025: Thông Điệp Về Sự Bình An Và Lòng Từ Bi
            </h1>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User size={16} className="text-orange-600" />
                </div>
                <span className="text-sm font-medium">Ban Truyền Thông</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video w-full mb-10 overflow-hidden rounded-xl shadow-md">
            <Image
              src={coverImage}
              alt="Feature"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-orange max-w-none text-justify leading-relaxed space-y-6">
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 py-1">
              "Hạnh phúc không phải là có thật nhiều, mà là buông xả thật
              nhiều." — Một thông điệp ý nghĩa trong buổi đại lễ năm nay.
            </p>

            <p>
              Trong không khí trang nghiêm của mùa Phật Đản, Ni Viện Viên Không
              đã long trọng tổ chức lễ kỷ niệm ngày Đức Bổn Sư Thích Ca Mâu Ni
              thành đạo. Buổi lễ có sự tham dự của đông đảo chư Ni và Phật tử từ
              khắp nơi về tham dự.
            </p>

            <div className="flex justify-center my-8">
              <Image
                src={ornament}
                alt="ornament"
                width={120}
                height={40}
                className="opacity-40"
              />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              1. Ý nghĩa của ngày lễ
            </h3>
            <p>
              Đại lễ không chỉ là dịp để người con Phật hướng về đấng Từ Phụ, mà
              còn là cơ hội để mỗi chúng ta nhìn lại nội tâm, thực hành lời dạy
              của Ngài về lòng từ bi và trí tuệ trong đời sống hằng ngày. Ni sư
              Liễu Pháp đã có bài pháp thoại ngắn chia sẻ về cách ứng dụng Phật
              pháp để chuyển hóa nỗi đau thành sự an lạc.
            </p>

            <h3 className="text-xl font-bold text-foreground">
              2. Hoạt động tại Ni Viện
            </h3>
            <p>
              Bên cạnh phần lễ chính, Ni Viện còn tổ chức các hoạt động như
              phóng sinh, phát quà từ thiện cho các gia đình có hoàn cảnh khó
              khăn tại địa phương. Những nụ cười hạnh phúc của bà con chính là
              đóa hoa tươi thắm nhất dâng lên cúng dường Đức Phật.
            </p>

            <div className="bg-orange-50/50 p-6 rounded-lg border border-orange-100 my-8">
              <p className="m-0 font-medium italic text-orange-900">
                Lưu ý: Khóa tu gieo duyên tiếp theo sẽ được tổ chức vào ngày 15
                âm lịch tới đây. Quý Phật tử vui lòng đăng ký sớm tại bàn thư
                ký.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground uppercase font-bold">
                Tags:
              </span>
              <span className="text-sm bg-muted px-2 py-0.5 rounded">
                Phật Đản
              </span>
              <span className="text-sm bg-muted px-2 py-0.5 rounded">
                Ni Viện
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 size={14} /> Chia sẻ bài viết
            </Button>
          </div>
        </article>

        <aside className="lg:w-[30%] space-y-10">
          <div className="sticky top-24">
            {/* Related Posts Section */}
            <section className="space-y-6">
              <h2 className="font-bold text-xl uppercase tracking-wider">
                Tin liên quan
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="group cursor-pointer">
                    <p className="text-xs text-muted-foreground mb-1 italic">
                      12:00 - 20/01/2025
                    </p>
                    <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      Thông báo về lịch khóa tu xuất gia gieo duyên lần thứ 10
                    </h4>
                  </div>
                ))}
              </div>
            </section>

            {/* Decoration at bottom of sidebar */}
            <div className="mt-12 flex justify-center opacity-20">
              <Image
                src={lineOrnament}
                alt="line-ornament"
                className="w-full"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
