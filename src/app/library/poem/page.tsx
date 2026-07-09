import type { Metadata } from "next";
import { fetchPoems } from "@/features/poem/api/poem.api";
import PoemList from "@/features/poem/ui/PoemList";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import PageHeader from "@/shared/layout/PageHeader";
import PageShell from "@/shared/layout/PageShell";
import { getAppLocale } from "@/shared/lib/i18n";

export const metadata: Metadata = {
  title: "Thơ thiền",
};

export default async function PoemListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;

  const response = await fetchPoems({
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: ["title:asc"],
    populate: "*",
  });

  const poems = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <AppBreadcrumb
        locale={locale}
        items={[
          {
            label: locale === "vi" ? "Thư viện" : "Library",
            href: "/library",
          },
          { label: locale === "vi" ? "Thơ thiền" : "Poems" },
        ]}
      />
      <PageHeader
        title={locale === "vi" ? "Thơ thiền" : "Poems"}
        className="mb-10"
      />

      <PoemList
        poems={poems}
        locale={locale}
        currentPage={currentPage}
        paginationMeta={meta}
      />
    </PageShell>
  );
}
