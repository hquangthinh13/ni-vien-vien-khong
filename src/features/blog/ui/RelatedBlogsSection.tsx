import type { Blog } from "@/features/blog/model/blog.types";
import type { Locale } from "@/types/locale";
import RelatedContentList from "@/shared/layout/RelatedContentList";

interface RelatedBlogsSectionProps {
  blogs: Blog[];
  locale: Locale;
}

export default function RelatedBlogsSection({
  blogs,
  locale,
}: RelatedBlogsSectionProps) {
  return (
    <RelatedContentList
      title={locale === "vi" ? "Bài viết liên quan" : "Related blogs"}
      locale={locale}
      items={blogs.map((item) => ({
        key: item.documentId,
        href: `/library/blog/${item.slug}-${item.documentId}`,
        title: item.title,
        date: item.publishedAt,
      }))}
    />
  );
}
