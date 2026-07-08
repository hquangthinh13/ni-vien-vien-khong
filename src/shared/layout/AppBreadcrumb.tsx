import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { cn } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

export type AppBreadcrumbItem = {
  label: string;
  href?: string;
};

interface AppBreadcrumbProps {
  locale: Locale;
  items: AppBreadcrumbItem[];
  className?: string;
}

export default function AppBreadcrumb({
  locale,
  items,
  className,
}: AppBreadcrumbProps) {
  const homeLabel = locale === "vi" ? "Trang chủ" : "Home";
  const visibleItems = items.filter((item, index) => {
    const isLast = index === items.length - 1;
    return isLast || Boolean(item.href);
  });
  const allItems: AppBreadcrumbItem[] = [
    { label: homeLabel, href: "/" },
    ...visibleItems,
  ];

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <BreadcrumbItemGroup
              key={`${item.href || item.label}-${index}`}
              item={item}
              isLast={isLast}
            />
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbItemGroup({
  item,
  isLast,
}: {
  item: AppBreadcrumbItem;
  isLast: boolean;
}) {
  return (
    <>
      <BreadcrumbItem className="min-w-0">
        {item.href && !isLast ? (
          <BreadcrumbLink asChild>
            <Link href={item.href} className="max-w-[18rem] truncate">
              {item.label}
            </Link>
          </BreadcrumbLink>
        ) : isLast ? (
          <BreadcrumbPage className="max-w-[18rem] truncate">
            {item.label}
          </BreadcrumbPage>
        ) : (
          <span className="max-w-[18rem] truncate">{item.label}</span>
        )}
      </BreadcrumbItem>
      {!isLast ? <BreadcrumbSeparator /> : null}
    </>
  );
}
