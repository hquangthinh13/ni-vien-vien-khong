import type { Poem } from "../model/poem.types";
import { DEFAULT_LOCALE, type Locale } from "@/types/locale";
import RelatedContentList from "@/shared/layout/RelatedContentList";

interface RelatedPoemsProps {
  poems: Poem[];
  locale?: Locale;
}

export default function RelatedPoems({ poems, locale }: RelatedPoemsProps) {
  const localeToUse = locale ?? DEFAULT_LOCALE;

  return (
    <RelatedContentList
      title={localeToUse === "vi" ? "Đọc thêm" : "More poems"}
      locale={localeToUse}
      items={poems.map((item) => ({
        key: item.documentId,
        href: `/library/poem/${item.documentId}`,
        title: item.title,
        date: item.publishedAt,
      }))}
    />
  );
}
