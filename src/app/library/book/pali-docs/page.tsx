import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Tài liệu học Pali" };

export default async function PaliDocsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;

  return (
    <LinkedDocumentArchivePage
      locale={locale}
      currentPage={Number(page) || 1}
      config={{
        category: "Tài Liệu Học Pali",
        title: { vi: "Tài liệu học Pali", en: "Pali Learning Materials" },
        eyebrow: { vi: "Ngôn ngữ kinh điển", en: "Canonical language" },
        description: {
          vi: "Tài liệu hỗ trợ học tập và nghiên cứu ngôn ngữ Pali.",
          en: "Resources for studying and researching the Pali language.",
        },
      }}
    />
  );
}
