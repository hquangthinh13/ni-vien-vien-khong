import { getAppLocale } from "@/shared/lib/i18n";
import RitualArchiveList from "@/features/ritual/ui/RitualArchiveList";
import { fetchRituals } from "@/features/ritual/api/ritual.api";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

export const metadata: Metadata = {
  title: "Nghi thức nghi lễ",
};

export default async function RitualListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 12;

  const response = await fetchRituals({
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: "createdAt:desc",
    populate: "*",
  });

  const docs = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <AppBreadcrumb locale={locale} items={[{ label: locale === "vi" ? "Thư viện" : "Library" }, { label: locale === "vi" ? "Nghi thức nghi lễ" : "Rituals and Ceremonies" }]} />
      <PageHeader
        title={locale === "vi" ? "Nghi thức nghi lễ" : "Rituals and Ceremonies"}
        className="mb-10"
      />

      <RitualArchiveList
        rituals={docs}
        locale={locale}
        currentPage={currentPage}
        paginationMeta={meta}
      />
    </PageShell>
  );
}
