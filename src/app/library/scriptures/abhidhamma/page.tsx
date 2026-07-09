import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Tạng Vi Diệu Pháp" };

export default async function AbhidhammaListPage({
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
        category: "Tạng Vi Diệu Pháp",
        title: { vi: "Tạng Vi Diệu Pháp", en: "Abhidhamma Texts" },
        eyebrow: { vi: "Tam Tạng kinh điển", en: "Pali Canon" },
        description: {
          vi: "Tư liệu nghiên cứu Vi Diệu Pháp trong truyền thống Theravāda.",
          en: "Abhidhamma study materials from the Theravāda tradition.",
        },
      }}
    />
  );
}
