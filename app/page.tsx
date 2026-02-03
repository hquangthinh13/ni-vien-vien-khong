import Image from "next/image";
import Link from "next/link";
import coverImage from "../public/homepage-cover.jpg";
import ornament from "../public/ornament-01.svg";
import lineOrnament from "../public/ornament-00.svg";
import { useTranslations } from "next-intl";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import SimplifiedNewsCard from "@/components/News/SimplifiedNewsCard";
import NewsSection from "@/components/News/NewsSection";
import QuestionSection from "@/components/Question/QuestionSection";
import CalendarSection from "@/components/News/CalendarSection";
export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="mx-auto max-w-6xl px-4 mb-6">
      <Image
        className="rounded-lg shadow-lg my-6"
        src={coverImage}
        alt="Cover image"
        placeholder="blur"
      />

      <div className="flex flex-col md:flex-row min-h-12 gap-4 md:gap-0 mb-6">
        {/* Left */}
        <div className="flex flex-col justify-start gap-4 md:w-[70%] p-4">
          {/* Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Tin tức
              </h2>{" "}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <ChevronLeftIcon />
                </Button>{" "}
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
            <NewsSection />
          </div>
          {/* Section */}
          <div className="flex flex-1 flex-col pt-4 border-t">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Diễn đàn
              </h2>{" "}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <ChevronLeftIcon />
                </Button>{" "}
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
            <QuestionSection />
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col md:w-[30%] md:border-l p-4 gap-4">
          {/* Section */}
          <div className="flex flex-col">
            <div className="flex w-fit">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                {t("foreword")}
              </h2>
            </div>

            <p className="flex mt-4 max-w-lg leading-snug text-justify italic text-muted-foreground">
              Trang web vienkhongni.com ra đời nhằm mục đích cho sự tiện ích đến
              toàn thể thân hữu, đạo hữu muốn tìm hiểu những sinh hoạt tín
              ngưỡng, tu tập, văn hoá, giáo dục, xã hội... của Ni Viện Viên
              Không và Ni Sư Liễu Pháp.
            </p>
          </div>
          {/* Section */}
          <div className="flex flex-col pt-4 border-t">
            <div className="flex w-fit">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Khóa tu
              </h2>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Card className="flex flex-1 p-0 transition-all ease-in-out duration-200 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center gap-4">
                    <span className="flex flex-1 font-bold tracking-wide text-sm">
                      Khóa tu mùa hè
                    </span>
                    <Link
                      href=""
                      className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:tracking-wide hover:underline text-primary italic"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex flex-1 p-0 transition-all ease-in-out duration-200 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center gap-4">
                    <span className="flex flex-1 font-bold tracking-wide text-sm">
                      Khóa tu Xuất Gia Gieo Duyên
                    </span>
                    <Link
                      href=""
                      className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:tracking-wide hover:underline text-primary italic"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section */}
          <div className="flex flex-col pt-4 border-t">
            <div className="flex w-fit mb-4">
              <h2 className="font-bold text-xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                Đặt câu hỏi
              </h2>
            </div>
            <Card className="flex flex-1 p-0 transition-all ease-in-out duration-200">
              <CardContent className="p-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Tên</FieldLabel>
                    <Input id="fieldgroup-name" placeholder="Nguyễn Văn A" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <Input
                      id="fieldgroup-email"
                      type="email"
                      placeholder="nivienvienkhong@example.com"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Câu hỏi</FieldLabel>
                    <Textarea
                      id="textarea-message"
                      placeholder="Nhập câu hỏi của bạn tại đây."
                    />
                    <FieldDescription>
                      Chúng tôi sẽ trả lời câu hỏi của bạn trong vòng ... ngày.
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <div className="flex flex-1 justify-end">
                      <Button className="cursor-pointer" type="submit">
                        Gửi
                      </Button>
                    </div>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Section */}

      <CalendarSection />
    </div>
  );
}
export function PaginationIconsOnly() {
  return (
    <div className="flex items-start justify-end gap-4 mt-4">
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
