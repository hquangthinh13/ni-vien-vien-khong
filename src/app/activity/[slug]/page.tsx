import React from "react";
import Image from "next/image";
import HighlightSection from "@/features/activity/ui/HighlightSection";
import { CalendarDays, PlayCircle } from "lucide-react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import lineOrnament from "@/public/ornament-01.svg";
import { getVideoId, formatShortDate } from "@/shared/lib/utils";
import {
  Activity,
  CourseContent,
} from "@/features/activity/model/activity.types";
import { getLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import {
  fetchActivityByDocumentIdWithRegistrationFormAndCourseContent,
  isActive,
} from "@/features/activity/api/activity.api";
import { getImageUrl } from "@/shared/lib/api";
import RelatedActivitiesSection from "@/features/activity/ui/RelatedActivitiesSection";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import ActivityRegistrationDialog from "@/features/courseRegistration/ui/CourseregistrationDialog";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
type Props = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const locale = (await getLocale()) as Locale;

  try {
    const response =
      await fetchActivityByDocumentIdWithRegistrationFormAndCourseContent({
        locale,
        documentId: documentId,
        populate: ["coverImage"],
      });

    const data = response?.data as Activity;

    if (!data) {
      return { title: "Không tìm thấy hoạt động" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");
    // console.log("ogImage", ogImage);
    return {
      title: data.activityName,
      description:
        data.activityCategory || "Thông tin hoạt động tại Ni Viện Viên Không",
      keywords: [
        "Sự kiện",
        "Tin tức",
        "Khóa tu",
        "Ni Viện Viên Không",
        `${data.activityCategory}`,
        `${data.activityName}`,
      ],
      openGraph: {
        title: data.activityName,
        description: data.activityCategory,
        url: `/activity/${data.slug}-${data.documentId}`,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: data.activityName,
              },
            ]
          : ["/open-graph.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: data.activityName,
        description:
          data.activityCategory || "Thông tin hoạt động tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : ["/open-graph.png"],
      },
      alternates: {
        canonical: `/activity/${data.slug}-${data.documentId}`,
      },
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function ActivityPage({ params }: Props) {
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  let response;
  try {
    response =
      await fetchActivityByDocumentIdWithRegistrationFormAndCourseContent({
        locale,
        documentId: documentId,
        populate: ["coverImage"],
      });
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }

  if (!response || !response.data) {
    notFound();
  }

  const data = response.data as Activity;
  // console.log("Fetched activity data:", data);
  const active = isActive(data);

  const courseContent = data?.courseContent as CourseContent;
  const videoList = courseContent?.videoSection || [];
  const sortedVideos = [...videoList].sort(
    (a, b) => (a.day ?? 0) - (b.day ?? 0),
  );

  return (
    <div className="page-container">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {" "}
        <div className="lg:col-span-7 w-full max-w-none text-justify leading-relaxed">
          <header className="flex flex-col w-full items-start mb-6 space-y-2">
            {courseContent?.courseCategory ? (
              <div className="page-label items-start">
                <span>{courseContent.courseCategory}</span>
              </div>
            ) : (
              <div className="page-label items-start">
                <span>{data.activityCategory}</span>
              </div>
            )}
            <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
              {data.activityName}
            </h1>
            {data.activityStartDate && data.activityEndDate && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                <CalendarDays size={18} className="" />
                <span>
                  {formatShortDate(data.activityStartDate, locale)} —{" "}
                  {formatShortDate(data.activityEndDate, locale)}
                </span>
              </div>
            )}{" "}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              {" "}
              <Zoom zoomMargin={80}>
                <Image
                  src={getImageUrl(data.coverImage) || "/placeholder.png"}
                  alt={data.activityName || "Course cover image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
                />{" "}
              </Zoom>
            </div>
            {/* <Zoom zoomMargin={80}>
              <Image
                src={getImageUrl(data.coverImage) || "/placeholder.png"}
                alt={data.activityName || "Course cover image"}
                className="flex rounded-2xl mt-4 hover:scale-105 transition-transform duration-300"
                priority
                placeholder="blur"
                width={1280}
                height={720}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />
            </Zoom> */}
          </header>
          <div className="opacity-80 flex w-full justify-center my-12">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
          <div className="w-full">
            {data.content && <RichTextRenderer content={data.content || []} />}
          </div>{" "}
          {courseContent?.videoSection &&
            courseContent.videoSection.length > 0 && (
              <section className="w-full mt-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                    <PlayCircle size={20} className="text-primary" />
                    Video
                  </h3>
                  {courseContent?.videoSection?.length > 0 && (
                    <span className="text-xs text-muted-foreground font-medium font-mono uppercase tracking-widest">
                      {courseContent.videoSection.length} video
                    </span>
                  )}
                </div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-3"
                >
                  {sortedVideos.map((video, index) => {
                    const videoId = getVideoId(video.videoLink);
                    const displayDay = video.haveOrdinalDate
                      ? (video.day ?? index + 1)
                      : index + 1;
                    const formattedDay =
                      displayDay < 10 ? `0${displayDay}` : displayDay;
                    return (
                      <AccordionItem
                        key={video.id}
                        value={video.title || `video-${video.id}`}
                        className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm transition-all duration-300"
                      >
                        <AccordionTrigger className="hover:no-underline py-4 group border-none items-center">
                          <div className="flex items-center gap-4 w-full">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              {formattedDay}
                            </div>

                            <div className="flex flex-col items-start gap-0.5">
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                                Video Khóa Tu
                              </span>
                              <span className="text-sm font-bold text-left line-clamp-1">
                                {video.title}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pt-0 pb-4 px-2">
                          {videoId ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl bg-black group/video">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                className="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 bg-muted/20 rounded-lg border border-dashed">
                              <PlayCircle
                                className="text-muted-foreground mb-2"
                                size={32}
                              />
                              <p className="text-sm text-muted-foreground italic">
                                Video đang được cập nhật...
                              </p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </section>
            )}
        </div>
        <aside className="lg:col-span-3 w-full space-y-6">
          <RelatedActivitiesSection activities={data.relatedActivities || []} />
          {courseContent?.highlightedImages && (
            <HighlightSection images={courseContent.highlightedImages || []} />
          )}

          {data.registrationForm && active && (
            // <Dialog>
            //   <DialogTrigger asChild>
            //     <div className="group/reg relative cursor-pointer overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md">
            //       <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 transition-transform duration-500 group-hover/reg:scale-150" />

            //       <div className="relative flex items-center justify-between">
            //         <div className="flex flex-col gap-0">
            //           <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            //             {locale === "vi" ? "Tham gia sự kiện" : "Join us"}
            //           </span>
            //           <h4 className="font-serif text-lg font-black uppercase tracking-normal text-secondary-foreground">
            //             {locale === "vi"
            //               ? "Điền thông tin đăng ký ngay"
            //               : "Register Now"}
            //           </h4>
            //           <p className="text-xs text-muted-foreground italic">
            //             {locale === "vi"
            //               ? "Số lượng đăng ký có hạn: "
            //               : "Limited slots available: "}{" "}
            //             {data.registrationLimit}
            //           </p>
            //         </div>

            //         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 group-hover/reg:scale-110 group-hover/reg:rotate-12">
            //           <CirclePlus className="h-6 w-6" />
            //         </div>
            //       </div>
            //     </div>
            //   </DialogTrigger>
            //   <DialogContent
            //     aria-describedby={documentId}
            //     className="max-h-[90vh] md:min-w-2xl lg:min-w-3xl overflow-y-auto"
            //   >
            //     <DialogTitle>Đăng ký tham gia</DialogTitle>
            //     <DialogDescription>
            //       Vui lòng điền đầy đủ thông tin để đăng ký tham gia sự kiện.
            //     </DialogDescription>
            //     <DynamicActivityRegistrationForm
            //       locale={locale}
            //       documentId={documentId}
            //       active={active}
            //             onClose={() => setOpen(false)}

            //     />
            //   </DialogContent>
            // </Dialog>
            <ActivityRegistrationDialog
              documentId={documentId}
              locale={locale}
              active={active}
              registrationLimit={data.registrationLimit}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
