"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import type { Blog } from "../model/blog.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { extractPreviewContent } from "@/shared/lib/utils";
import ArchiveIntroRail from "@/shared/layout/archive/ArchiveIntroRail";
import ArchivePageLayout from "@/shared/layout/archive/ArchivePageLayout";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";
import EditorialMediaCard from "@/shared/layout/archive/EditorialMediaCard";
import EmptyState from "@/shared/layout/EmptyState";
import PaginationControls from "@/shared/layout/PaginationControls";

interface BlogListProps {
  initialBlogs: Blog[];
  locale: Locale;
  paginationMeta?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  currentPage: number;
}

export default function BlogList({
  initialBlogs,
  locale,
  paginationMeta,
  currentPage,
}: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = paginationMeta?.total ?? initialBlogs.length;
  const [featuredBlog, ...remainingBlogs] = initialBlogs;

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const renderBlog = (blog: Blog, variant: "featured" | "standard") => (
    <EditorialMediaCard
      key={blog.documentId}
      locale={locale}
      variant={variant}
      item={{
        key: blog.documentId,
        href: `/library/blog/${blog.slug}-${blog.documentId}`,
        title: blog.title,
        imageUrl: getImageUrl(blog.coverImage, "medium"),
        imageAlt: blog.coverImage?.alternativeText || blog.title,
        excerpt: extractPreviewContent(blog.blogContent),
        category: locale === "vi" ? "Chia sẻ" : "Blog",
        date: blog.publishedAt,
      }}
    />
  );

  return (
    <ArchivePageLayout
      rail={
        <ArchiveIntroRail
          eyebrow={locale === "vi" ? "Chuyên mục" : "Journal"}
          title={locale === "vi" ? "Chia sẻ" : "Reflections"}
          description={
            locale === "vi"
              ? "Những bài viết về đời sống tu học, chánh niệm và sự thực hành trong mỗi ngày."
              : "Reflections on monastic life, mindfulness, and everyday practice."
          }
          total={total}
          totalLabel={locale === "vi" ? "Tất cả bài viết" : "All posts"}
        />
      }
    >
      <ArchiveResultsHeader
        title={locale === "vi" ? "Các bài chia sẻ" : "Latest reflections"}
        total={total}
        countLabel={locale === "vi" ? "bài viết" : total === 1 ? "post" : "posts"}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {featuredBlog ? (
            <div className="flex flex-col gap-6">
              {renderBlog(featuredBlog, "featured")}
              {remainingBlogs.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {remainingBlogs.map((blog) =>
                    renderBlog(blog, "standard"),
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              message={
                locale === "vi"
                  ? "Hiện chưa có bài chia sẻ nào."
                  : "No reflections available yet."
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      {paginationMeta ? (
        <PaginationControls
          currentPage={currentPage}
          pageCount={paginationMeta.pageCount}
          locale={locale}
          onPageChange={updatePage}
          className="mt-10 border-t border-border/80 pt-6"
        />
      ) : null}
    </ArchivePageLayout>
  );
}
