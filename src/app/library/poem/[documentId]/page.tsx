import React from "react";
import Image from "next/image";
import lineOrnament from "@/public/ornament-00.svg";
import PoetryRenderer from "@/features/poem/ui/PoetryRenderer";
import { fetchPoemByDocumentId } from "@/features/poem/api/poem.api";
import type { Poem } from "@/features/poem/model/poem.types";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import RelatedPoems from "@/features/poem/ui/RelatedPoems";
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
    const response = await fetchPoemByDocumentId({
      locale,
      documentId: documentId,
    });

    const data = response?.data as Poem;

    if (!data) {
      return { title: "Không tìm thấy bài thơ" };
    }

    const ogImage = getImageUrl(data.coverImage);

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
      populate: "*",
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

  const imageUrl = getImageUrl(data?.coverImage, "medium");
  if (!data) {
    return <div className="text-center py-20">Không tìm thấy bài thơ.</div>;
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-0 justify-center">
        <article className="w-full">
          <header className="space-y-2">
            <div className="flex justify-center items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
              <span>Thơ thiền</span>
            </div>

            <h1 className="text-2xl md:text-4xl text-center font-bold leading-tight">
              {data.title}
            </h1>
            {data.author && (
              <p className="text-center text-sm italic text-muted-foreground">
                {data.author}
              </p>
            )}
          </header>
          <div className=" flex w-full justify-center">
            <div className="relative aspect-square w-full max-w-48 overflow-hidden rounded-full shadow-md mt-4">
              <Image
                src={imageUrl || "/placeholder.png"}
                alt={data.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg=="
              />
            </div>
          </div>

          <div className="opacity-80 flex w-full justify-center my-8 scale-y-[-1]">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>

          <div className="poem-content-wrapper">
            <PoetryRenderer content={data.content || []} />
          </div>

          <div className="opacity-80 flex w-full justify-center mt-8">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
          </div>
        </article>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {poems.map((poem) => (
            <PoemCard key={poem.documentId} poem={poem} />
          ))}
        </div>{" "} */}
        <RelatedPoems poems={data.relatedPoems || []} />
      </div>
    </div>
  );
}
