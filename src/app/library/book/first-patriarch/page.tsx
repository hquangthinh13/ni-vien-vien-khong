import type { Metadata } from "next";
import LinkedDocumentArchivePage from "@/features/linkedDocument/ui/LinkedDocumentArchivePage";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = { title: "Sách Sơ Tổ Hộ Tông" };

export default async function FirstPatriarchListPage({
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
        category: "Sách Sơ Tổ Hộ Tông",
        title: { vi: "Sách Sơ Tổ Hộ Tông", en: "First Patriarch Books" },
        eyebrow: { vi: "Tủ sách Phật học", en: "Buddhist library" },
        description: {
          vi: "Tuyển tập trước tác và tư liệu về Sơ Tổ Hộ Tông.",
          en: "A collection of writings and materials about the First Patriarch.",
        },
      }}
    />
  );
}
