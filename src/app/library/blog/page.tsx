import { fetchBlogs } from "@/features/blog/api/blog.api";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import type { Locale } from "@/types/locale";
import TextMotionWrapper from "@/shared/motion/TextMotionWrapper";
import { Metadata } from "next";
import BlogList from "@/features/blog/ui/BlogList";
export const metadata: Metadata = {
  title: "Chia sẻ",
};
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { page: pageSlug } = await searchParams;

  const currentPage = Number(pageSlug) || 1;

  const response = await fetchBlogs({
    locale,
    pagination: { page: currentPage, pageSize: 3 },
    sort: "[publishedAt:desc]",
    populate: "coverImage",
  });
  const initialBlogs = Array.isArray(response.data) ? response.data : [];

  console.log("Fetched blogs for page:", currentPage, response);
  const paginationMeta = response.meta?.pagination;
  return (
    <div className="mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <TextMotionWrapper delay={0.2} className="text-center">
          <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
            Chia sẻ
          </h2>
        </TextMotionWrapper>
        <TextMotionWrapper delay={0.2}>
          <div className="opacity-80">
            <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
          </div>{" "}
        </TextMotionWrapper>
      </div>
      <BlogList
        key={currentPage}
        initialBlogs={initialBlogs}
        paginationMeta={paginationMeta}
        locale={locale}
        currentPage={currentPage}
      />
    </div>
  );
}
