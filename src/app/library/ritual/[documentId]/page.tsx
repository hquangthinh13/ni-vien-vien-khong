import React from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import lineOrnament from "@/public/ornament-01.svg";
import { formatShortDate } from "@/shared/lib/utils";
import { Ritual } from "@/features/ritual/model/ritual.types";
import { fetchRitualByDocumentId } from "@/features/ritual/api/ritual.api";
import { getLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import RelatedRitualsSection from "@/features/ritual/ui/RelatedRitualsSection";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { documentId: string };
};
export async function generateMetadata(
  { params }: { params: { documentId: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { documentId } = await params;
  const locale = (await getLocale()) as Locale;

  try {
    const response = await fetchRitualByDocumentId({
      locale,
      documentId: documentId,
      populate: "*",
    });

    const data = response?.data as Ritual;

    if (!data) {
      return { title: "Không tìm thấy nghi thức" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description: "Thông tin nghi thức tại Ni Viện Viên Không",
      openGraph: {
        title: data.title,
        description: "Thông tin nghi thức tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function RitualPage({ params }: Props) {
  const locale = (await getLocale()) as Locale;

  const { documentId } = await params;
  let response;
  try {
    response = await fetchRitualByDocumentId({
      locale,
      documentId: documentId,
      populate: "relatedRituals",
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

  const data = response.data as Ritual;
  console.log("Fetched ritual data:", data);
  return (
    <div className="page-container">
      {/* <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-6 items-start"> */}{" "}
      <div className="w-full max-w-none text-justify leading-relaxed">
        <header className="flex flex-col w-full items-center mb-6 space-y-2">
          <div className="page-label items-start">
            <span>Nghi thức nghi lễ</span>
          </div>
          <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
            {data.title}
          </h1>
          {/* <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
            <CalendarDays size={18} className="" />
            <span>{formatShortDate(publishedAt, locale)}</span>
          </div> */}

          {data.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Zoom zoomMargin={80}>
                <Image
                  src={
                    getImageUrl(data.coverImage, "medium") || "/placeholder.png"
                  }
                  alt={data.title || "Ritual cover image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
                />
              </Zoom>
            </div>
          )}
        </header>
        <div className="opacity-80 flex w-full justify-center my-12">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
        <div className="w-full">
          {data.content && <RichTextRenderer content={data.content || []} />}
        </div>{" "}
      </div>
      <RelatedRitualsSection
        locale={locale}
        rituals={data.relatedRituals || []}
      />
    </div>
    // </div>
  );
}
