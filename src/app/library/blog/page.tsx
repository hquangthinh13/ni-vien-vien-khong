import { fetchBlogs } from "@/features/blog/api/blog.api";
import { getAppLocale } from "@/shared/lib/i18n";
import { Metadata } from "next";
import BlogList from "@/features/blog/ui/BlogList";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

export const metadata: Metadata = {
  title: "Chia sẻ",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page: pageSlug } = await searchParams;

  const currentPage = Number(pageSlug) || 1;

  const response = await fetchBlogs({
    locale,
    pagination: { page: currentPage, pageSize: 6 },
    sort: ["publishedAt:desc"],
    populate: "coverImage",
  });
  const initialBlogs = Array.isArray(response.data) ? response.data : [];
  const paginationMeta = response.meta?.pagination;

  return (
    <PageShell>
      <AppBreadcrumb locale={locale} items={[{ label: locale === "vi" ? "Thư viện" : "Library" }, { label: locale === "vi" ? "Chia sẻ" : "Blog" }]} />
      <PageHeader
        title={locale === "vi" ? "Chia sẻ" : "Blog"}
        className="mb-10"
      />
      <BlogList
        key={currentPage}
        initialBlogs={initialBlogs}
        paginationMeta={paginationMeta}
        locale={locale}
        currentPage={currentPage}
      />
    </PageShell>
  );
}
