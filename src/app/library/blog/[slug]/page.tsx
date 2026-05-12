import React from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import lineOrnament from "@/public/ornament-01.svg";
import { formatShortDate } from "@/shared/lib/utils";
import type { Blog } from "@/features/blog/model/blog.types";
import { getLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import { fetchBlogByDocumentId } from "@/features/blog/api/blog.api";
import { getImageUrl } from "@/shared/lib/api";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);
  const locale = (await getLocale()) as Locale;

  try {
    const response = await fetchBlogByDocumentId({
      locale,
      documentId: documentId,
    });

    const data = response?.data as Blog;

    if (!data) {
      return { title: "Không tìm thấy bài viết" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description: "Chia sẻ từ Ni Viện Viên Không",
      openGraph: {
        title: data.title,
        description: "Chia sẻ từ Ni Viện Viên Không",
        images: ogImage ? [ogImage] : [],
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
    response = await fetchBlogByDocumentId({
      locale,
      documentId: documentId,
      populate: "*",
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

  const data = response.data as Blog;
  // console.log("Fetched blog data:", data);

  return (
    <div className="page-container">
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {" "}
        <div className="lg:col-span-7 w-full max-w-none text-justify leading-relaxed">
          <header className="flex flex-col w-full items-start mb-6 space-y-2">
            <div className="page-label items-start">
              <span>Chia sẻ</span>
            </div>

            <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
              {data.title}
            </h1>
            {data.publishedAt && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                <CalendarDays size={18} className="" />
                <span>{formatShortDate(data.publishedAt, locale)}</span>
              </div>
            )}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md mt-4">
              <Zoom zoomMargin={0}>
                <Image
                  src={getImageUrl(data.coverImage) || "/placeholder.png"}
                  alt={data.title || "Blog cover image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Zoom>
            </div>
          </header>
          <div className="opacity-80 flex w-full justify-center my-12">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>
          <div className="w-full">
            {data.blogContent && (
              <RichTextRenderer content={data.blogContent || []} />
            )}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
