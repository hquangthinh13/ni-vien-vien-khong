import type { Ritual } from "../model/ritual.types";
import { DEFAULT_LOCALE, type Locale } from "@/types/locale";
import RelatedContentList from "@/shared/layout/RelatedContentList";

interface RelatedRitualsProps {
  rituals: Ritual[];
  locale?: Locale;
}

export default function RelatedRitualsSection({
  rituals,
  locale,
}: RelatedRitualsProps) {
  const localeToUse = locale ?? DEFAULT_LOCALE;

  return (
    <RelatedContentList
      title={
        localeToUse === "vi" ? "Nghi thức liên quan" : "Related rituals"
      }
      locale={localeToUse}
      items={rituals.map((item) => ({
        key: item.documentId,
        href: `/library/ritual/${item.documentId}`,
        title: item.title,
        date: item.publishedAt,
      }))}
    />
  );
}
