import { fetchIntroductionPage } from "@/features/introductionPage/api/introductionPage.api";
import IntroTimelineView from "@/features/introductionPage/ui/IntroTimelineView";
import lineOrnament from "@/public/ornament-01.svg";
import Image from "next/image";
import { Metadata } from "next";
import { getAppLocale } from "@/shared/lib/i18n";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";

export const metadata: Metadata = {
  title: "Thời Khóa Tu Tập",
};

export default async function IntroductionPage() {
  const locale = await getAppLocale();
  const response = await fetchIntroductionPage({
    populate: "*",
  });

  const data = response.data;

  if (!data) return null;

  return (
    <div className="page-container">
      <AppBreadcrumb
        locale={locale}
        items={[
          { label: locale === "vi" ? "Giới thiệu" : "Introduction" },
          {
            label:
              data.title ||
              (locale === "vi" ? "Thời Khóa Tu Tập" : "Practice Schedule"),
          },
        ]}
        className="mb-6"
      />
      <div className="flex flex-col gap-6 items-center mb-6">
        <h1 className="page-header"> {data.title}</h1>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>{" "}
      <IntroTimelineView data={data} />
    </div>
  );
}
