import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Danh mục sách khác" };

export default async function OtherBooksListPage({
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
        category: "Danh Mục Sách Khác",
        title: { vi: "Danh mục sách khác", en: "Other Book Categories" },
        eyebrow: { vi: "Tủ sách tham khảo", en: "Reference library" },
        description: {
          vi: "Các đầu sách và tài liệu Phật học được tuyển chọn theo nhiều chủ đề.",
          en: "Selected Buddhist books and documents across diverse subjects.",
        },
      }}
    />
  );
}
