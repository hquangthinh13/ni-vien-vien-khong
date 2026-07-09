import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Sách Sư Ông Viên Minh" };

export default async function VienMinhListPage({
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
        category: "Sách Sư Ông Viên Minh",
        title: { vi: "Sách Sư Ông Viên Minh", en: "Master Vien Minh Books" },
        eyebrow: { vi: "Tủ sách tu học", en: "Practice library" },
        description: {
          vi: "Tuyển tập sách và pháp học của Sư Ông Viên Minh.",
          en: "A collection of books and teachings by Master Vien Minh.",
        },
      }}
    />
  );
}
