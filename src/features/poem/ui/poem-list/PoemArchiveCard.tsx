import type { Poem } from "@/features/poem/model/poem.types";
import type { Locale } from "@/types/locale";
import { getImageUrl } from "@/shared/lib/api";
import { extractPoemPreviewContent, extractPreviewContent } from "@/shared/lib/utils";
import EditorialMediaCard from "@/shared/layout/archive/EditorialMediaCard";

interface PoemArchiveCardProps {
  poem: Poem;
  locale: Locale;
  variant?: "featured" | "standard";
}

export default function PoemArchiveCard({
  poem,
  locale,
  variant = "standard",
}: PoemArchiveCardProps) {
  const label =
    poem.author || (locale === "vi" ? "Chưa có tác giả" : "Unknown author");
  return (
    <EditorialMediaCard
      locale={locale}
      variant={variant}
      item={{
        key: poem.documentId,
        href: `/library/poem/${poem.documentId}`,
        title: poem.title,
        imageUrl: getImageUrl(poem.coverImage, "medium"),
        imageAlt: poem.coverImage?.alternativeText || poem.title,
        excerpt: extractPoemPreviewContent(poem.content),
        category: label,
        date: poem.publishedAt,
      }}
    />
  );
}
