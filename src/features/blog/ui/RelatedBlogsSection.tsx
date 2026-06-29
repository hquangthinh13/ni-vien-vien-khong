import Link from "next/link";
import { ScrollText } from "lucide-react";
import type { Blog } from "@/features/blog/model/blog.types";
import type { Locale } from "@/types/locale";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface RelatedBlogsSectionProps {
  blogs: Blog[];
  locale: Locale;
}

export default function RelatedBlogsSection({
  blogs,
  locale,
}: RelatedBlogsSectionProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold uppercase tracking-wider">
        <ScrollText size={20} className="text-primary" />
        {locale === "vi" ? "Bài viết liên quan" : "Related Blogs"}
      </h3>
      <div className="space-y-6">
        {blogs.map((item) => (
          <Link
            key={item.documentId}
            href={`/library/blog/${item.slug}-${item.documentId}`}
            className="group block"
          >
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <DateTimeDisplay
                  dateString={item?.publishedAt}
                  locale={locale}
                />
                <h5 className="flex text-sm font-bold leading-tight transition-colors group-hover:text-primary md:text-md">
                  {item.title}
                </h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
