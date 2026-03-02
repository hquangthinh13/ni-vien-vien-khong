import { fetchPoems } from "@/features/poem/api/poem.api"; // Adjust path
import { getLocale } from "next-intl/server";
import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import PoemCard from "@/features/poem/ui/PoemCard";
import type { Locale } from "@/types/locale";

export default async function PoemListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 8;

  const response = await fetchPoems({
    locale,
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
    sort: "createdAt:desc",
    populate: "*",
  });
  // console.log("Poem fetch response:", response);
  const poems = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <div className="flex flex-col w-full mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Thơ thiền
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {poems.map((poem) => (
          <PoemCard key={poem.documentId} poem={poem} />
        ))}
      </div>

      {meta && meta.pageCount > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          {currentPage > 1 && (
            <a
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 border rounded hover:bg-accent"
            >
              Previous
            </a>
          )}
          <span className="flex items-center">
            Page {meta.page} of {meta.pageCount}
          </span>
          {currentPage < meta.pageCount && (
            <a
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 border rounded hover:bg-accent"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
