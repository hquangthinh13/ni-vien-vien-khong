import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import lineOrnament from "@/public/ornament-01.svg";
import LinkedDocumentCard from "@/components/LinkedDocument/LinkedDocumentCard";
import type { Locale } from "@/types/locale";
import { fetchLinkedDocumentsByCategory } from "@/components/LinkedDocument/LinkedDocument.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SuttaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 15;

  const response = await fetchLinkedDocumentsByCategory({
    category: "Tạng Luận",
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
    <div className="flex flex-col w-full mx-auto max-w-10xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Tạng Luận
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <LinkedDocumentCard key={doc.documentId} doc={doc} />
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
