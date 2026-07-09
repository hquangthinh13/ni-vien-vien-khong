import type { ReactNode } from "react";
import type { Locale } from "@/types/locale";
import type { AppBreadcrumbItem } from "@/shared/layout/AppBreadcrumb";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import DetailPageShell from "@/shared/layout/DetailPageShell";
import DetailHeader, {
  type DetailHeaderProps,
} from "@/shared/layout/DetailHeader";
import DetailDivider from "@/shared/layout/DetailDivider";
import DetailShareActions from "@/shared/layout/DetailShareActions";
import MotionWrapper from "@/shared/motion/MotionWrapper";

export interface DetailShareConfig {
  title: string;
  url: string;
  description?: string;
}

export interface DetailArticleLayoutProps {
  locale: Locale;
  breadcrumbItems: AppBreadcrumbItem[];
  header: DetailHeaderProps;
  content: ReactNode;
  supplementary?: ReactNode;
  share?: DetailShareConfig;
  sidebar?: ReactNode;
  className?: string;
}

export default function DetailArticleLayout({
  locale,
  breadcrumbItems,
  header,
  content,
  supplementary,
  share,
  sidebar,
  className,
}: DetailArticleLayoutProps) {
  return (
    <DetailPageShell
      className={className}
      main={
        <article className="w-full max-w-none text-justify leading-relaxed">
          <AppBreadcrumb
            locale={locale}
            items={breadcrumbItems}
            className="mb-6"
          />

          <MotionWrapper>
            <DetailHeader {...header} />
            <DetailDivider />
          </MotionWrapper>

          <div className="w-full">
            {content}
            {share ? (
              <DetailShareActions
                title={share.title}
                url={share.url}
                description={share.description}
                locale={locale}
              />
            ) : null}
          </div>

          {supplementary ? (
            <div className="mt-8 w-full">{supplementary}</div>
          ) : null}
        </article>
      }
      sidebar={sidebar}
    />
  );
}
