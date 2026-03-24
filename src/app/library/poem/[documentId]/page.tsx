import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import { fetchPoemByDocumentId } from "@/features/poem/api/poem.api";
import type { Poem } from "@/features/poem/model/poem.types";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import RelatedPoems from "@/features/poem/ui/RelatedPoems";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Metadata, ResolvingMetadata } from "next";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";

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
    const response = await fetchPoemByDocumentId({
      locale,
      documentId: documentId,
    });

    const data = response?.data as Poem;

    if (!data) {
      return { title: "Không tìm thấy bài thơ" };
    }

    const ogImage = getImageUrl(data.coverImage, "medium");

    return {
      title: data.title,
      description: data.author || "Thông tin bài thơ tại Ni Viện Viên Không",
      openGraph: {
        title: data.title,
        description: data.author || "Thông tin bài thơ tại Ni Viện Viên Không",
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function PoemPage({ params }: Props) {
  const locale = (await getLocale()) as Locale;
  const { documentId } = await params;

  let data: Poem | null = null;

  try {
    const fullResponse = await fetchPoemByDocumentId({
      documentId: documentId,
      locale,
      // populate: "*",
    });
    data = (
      Array.isArray(fullResponse.data)
        ? fullResponse.data[0]
        : fullResponse.data
    ) as Poem | null;
    // console.log("Fetched poem data:", data);
  } catch (error) {
    console.error("Error fetching poem by documentId:", error);
  }

  // const imageUrl = getImageUrl(data?.coverImage, "medium");
  if (!data) {
    return <div className="text-center py-20">Không tìm thấy bài thơ.</div>;
  }

  return (
    <div className="page-container">
      {/* <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-6 items-start"> */}{" "}
      <div className="w-full max-w-none text-justify leading-relaxed">
        <header className="flex flex-col w-full items-center mb-6 space-y-2">
          <div className="page-label items-start">
            <span>{locale === "en" ? "Poem" : "Thơ thiền"}</span>
          </div>
          <h1 className="text-xl md:text-4xl text-left font-bold leading-tight max-w-4xl">
            {data.title}
          </h1>

          {/* {data.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md mt-4">
              <Zoom zoomMargin={80}>
                <Image
                  src={imageUrl || "/placeholder.png"}
                  alt={data.title || "Ritual cover image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
                />
              </Zoom>
            </div>
          )} */}
        </header>{" "}
        <div className="opacity-80 flex w-full justify-center my-4">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
        {/* <div className="opacity-80 flex w-full justify-center my-12">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div> */}
        <div className="w-full">
          {data.content && (
            <RichTextRenderer isPoem={true} content={data.content || []} />
          )}
        </div>{" "}
      </div>
      <RelatedPoems locale={locale} poems={data.relatedPoems || []} />
    </div>
  );
}
