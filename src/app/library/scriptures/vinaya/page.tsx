import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Tạng Luật" };

export default async function VinayaListPage({
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
        category: "Tạng Luật",
        title: { vi: "Tạng Luật", en: "Vinaya Texts" },
        eyebrow: { vi: "Tam Tạng kinh điển", en: "Pali Canon" },
        description: {
          vi: "Kinh văn và tài liệu về giới luật, nếp sống và sự tu học.",
          en: "Texts on discipline, monastic life, and Buddhist practice.",
        },
      }}
    />
  );
}
