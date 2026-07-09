import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Tạng Kinh" };

export default async function SuttaListPage({
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
        category: "Tạng Kinh",
        title: { vi: "Tạng Kinh", en: "Sutta Texts" },
        eyebrow: { vi: "Tam Tạng kinh điển", en: "Pali Canon" },
        description: {
          vi: "Tuyển tập kinh văn và tài liệu hỗ trợ việc học, đọc và hành trì.",
          en: "Discourses and resources supporting study, reading, and practice.",
        },
      }}
    />
  );
}
