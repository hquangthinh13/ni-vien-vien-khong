import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import lineOrnament from "@/public/ornament-01.svg";
import RitualCard from "@/features/ritual/ui/RitualCard";
import type { Locale } from "@/types/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { fetchRituals } from "@/features/ritual/api/ritual.api";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Nghi thức nghi lễ",
};
export default async function RitualListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 12;

  const response = await fetchRituals({
    locale,
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
    sort: "createdAt:desc",
    populate: "*",
  });
  const docs = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <div className="page-container">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h1 className="page-header"> Nghi thức nghi lễ</h1>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <RitualCard key={doc.documentId} doc={doc} />
        ))}
      </div>

      {meta && meta.pageCount > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          {currentPage > 1 ? (
            <Link href={`?page=${currentPage - 1}`}>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <ChevronLeft />
              </Button>
            </Link>
          ) : (
            <Button size="icon" variant="outline" disabled>
              <ChevronLeft />
            </Button>
          )}
          <span className="flex items-center text-muted-foreground text-sm">
            Trang {meta.page} trên {meta.pageCount}
          </span>
          {currentPage < meta.pageCount ? (
            <Link href={`?page=${currentPage + 1}`}>
              <Button className="cursor-pointer" size="icon" variant="outline">
                <ChevronRight />
              </Button>
            </Link>
          ) : (
            <Button size="icon" variant="outline" disabled>
              <ChevronRight />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
