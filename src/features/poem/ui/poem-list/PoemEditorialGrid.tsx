import type { Poem } from "@/features/poem/model/poem.types";
import type { Locale } from "@/types/locale";
import PoemArchiveCard from "./PoemArchiveCard";

interface PoemEditorialGridProps {
  poems: Poem[];
  locale: Locale;
}

export default function PoemEditorialGrid({
  poems,
  locale,
}: PoemEditorialGridProps) {
  const [featuredPoem, ...remainingPoems] = poems;

  if (!featuredPoem) return null;

  return (
    <div className="flex flex-col gap-6">
      <PoemArchiveCard poem={featuredPoem} locale={locale} variant="featured" />

      {remainingPoems.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {remainingPoems.map((poem) => (
            <PoemArchiveCard
              key={poem.documentId}
              poem={poem}
              locale={locale}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
