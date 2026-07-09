import Link from "next/link";
import type { Locale } from "@/types/locale";

interface HomeSectionHeaderProps {
  title: string;
  href: string;
  locale: Locale;
}

export default function HomeSectionHeader({
  title,
  href,
  locale,
}: HomeSectionHeaderProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5 md:mb-8">
      <Link href={href}>
        <h2 className="home-page-section-title">{title}</h2>
      </Link>

      <Link
        href={href}
        className="shrink-0 pb-0.5 text-sm font-semibold italic text-primary transition-colors hover:text-primary/75 hover:underline"
      >
        {locale === "vi" ? "Xem thêm" : "View more"}
      </Link>
    </div>
  );
}
