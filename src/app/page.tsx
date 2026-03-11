import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/shared/ui/dialog";
import ActivitiesSection from "@/features/activity/ui/ActivitiesSection";
import QuestionSection from "@/features/question/ui/QuestionSection";
import CalendarSection from "@/features/activity/ui/CalendarSection";
import QuestionForm from "@/features/question/ui/QuestionForm";
import type { Locale } from "@/types/locale";
import { getTranslations, getLocale } from "next-intl/server";
import CourseSection from "@/features/activity/ui/CourseSection";
import { fetchHomePage } from "@/features/homePage/api/homePage.api";
import { HomePageAttributes } from "@/features/homePage/model/homePage.types";
import { getImageUrl } from "@/shared/lib/api";
import { MessageCircleQuestionMark } from "lucide-react";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { DialogDescription } from "@radix-ui/react-dialog";
export default async function Home() {
  const t = await getTranslations("HomePage");
  const locale = (await getLocale()) as Locale;
  const response = await fetchHomePage({
    populate: "*",
    locale,
  });
  const data = response.data as HomePageAttributes | null;
  const coverImage = getImageUrl(data?.coverImage);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ni Viện Viên Không",
    url: "https://ni-vien-vien-khong-frontend.vercel.app",
    logo: "https://ni-vien-vien-khong-frontend.vercel.app/logo.png",
    sameAs: [
      "https://www.facebook.com/Nivienvienkhong",
      "https://www.youtube.com/c/NiVi%E1%BB%87nVi%C3%AAnKh%C3%B4ng",
    ],
  };
  return (
    <div>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <MotionWrapper>
        <Image
          className="mb-4"
          src={coverImage || "placeholder.jpg"}
          alt="Cover image"
          placeholder="blur"
          width={1920}
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          height={1080}
        />
      </MotionWrapper>
      <div className="mx-auto max-w-7xl px-0 mb-6">
        <div className="flex flex-col-reverse md:flex-row min-h-12 gap-0 mb-6">
          {/* Left */}
          <div className="flex flex-col justify-start gap-4 md:w-[70%] p-4">
            <MotionWrapper>
              <section className="flex flex-col pt-4 md:pt-0 border-t md:border-0">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold font-serif text-2xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                    Tin tức
                  </h2>{" "}
                  <div className="flex gap-2">
                    <Link
                      href="/activity"
                      className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
                <ActivitiesSection />
              </section>{" "}
            </MotionWrapper>{" "}
            <MotionWrapper>
              <CalendarSection locale={locale} />{" "}
            </MotionWrapper>{" "}
          </div>
          {/* Right */}
          <div className="flex flex-col md:w-[30%] md:border-l p-4 pb-0 gap-4">
            <MotionWrapper>
              <section className="flex flex-col">
                <div className="flex w-fit">
                  <h2 className="font-bold font-serif text-2xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                    {t("foreword")}
                  </h2>
                </div>
                <p className="flex mt-4 max-w-lg leading-snug text-justify text-muted-foreground">
                  {data?.openingMessage}
                </p>
              </section>{" "}
            </MotionWrapper>
            <MotionWrapper>
              <section className="flex flex-col pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold font-serif text-2xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                    Khóa tu
                  </h2>{" "}
                  <div className="flex gap-2">
                    <Link
                      href="/course"
                      className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
                <CourseSection />
              </section>{" "}
            </MotionWrapper>{" "}
            <MotionWrapper>
              <section className="flex flex-1 flex-col pt-4 pb-0 border-t">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold font-serif text-2xl whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
                    Vấn đáp Phật pháp
                  </h2>
                  <Link
                    href="/library/question"
                    className="flex w-fit text-sm font-semibold ease-in-out duration-150 transition-all hover:underline text-primary italic"
                  >
                    Xem thêm
                  </Link>
                </div>

                <QuestionSection />

                <Dialog>
                  <DialogTrigger asChild>
                    <div className="group/reg relative cursor-pointer overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md">
                      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 transition-transform duration-500 group-hover/reg:scale-150" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex flex-col gap-0">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            {locale === "vi"
                              ? "Bạn có thắc mắc?"
                              : "Have a Question?"}
                          </span>
                          <h4 className="font-serif text-lg font-black uppercase tracking-normal text-secondary-foreground">
                            {locale === "vi"
                              ? "Đặt câu hỏi cho chúng tôi"
                              : "Ask a Question"}
                          </h4>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 group-hover/reg:scale-110 group-hover/reg:rotate-12">
                          <MessageCircleQuestionMark className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    aria-describedby="Question form"
                    className="max-h-[90vh] overflow-y-auto"
                  >
                    <DialogTitle>Đặt câu hỏi</DialogTitle>
                    <DialogDescription>
                      {locale === "vi"
                        ? "Hãy đặt câu hỏi của bạn dưới đây và chúng tôi sẽ trả lời sớm nhất có thể."
                        : "Please ask your question below and we will respond as soon as possible."}
                    </DialogDescription>
                    <QuestionForm locale={locale} />
                  </DialogContent>
                </Dialog>
              </section>{" "}
            </MotionWrapper>{" "}
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
