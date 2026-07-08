import { Metadata, ResolvingMetadata } from "next";
import ConfirmSection from "@/features/activity/ui/ConfirmSection";
import { fetchActivityByDocumentId } from "@/features/activity/api/activity.api";
import { notFound } from "next/navigation";
import { getAppLocale } from "@/shared/lib/i18n";
import {
  Activity,
  SingleActivityResponse,
} from "@/features/activity/model/activity.types";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import { getActivityBreadcrumbItems } from "@/features/activity/lib/activity-breadcrumb";
type Props = {
  params: { slug: string };
};
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  const locale = await getAppLocale();

  try {
    const response = await fetchActivityByDocumentId({
      locale,
      documentId: documentId,
      fields: [
        "zaloGroup",
        "activityName",
        "activityStartDate",
        "activityEndDate",
        "activityCategory",
        "slug",
      ],
      populate: ["courseContent"],
    });

    const data = response?.data as Activity;

    if (!data) {
      return { title: "Không tìm thấy" };
    }

    return {
      title: `Đăng ký thành công | ${data.activityName}`,
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function Page({ params }: Props) {
  const locale = await getAppLocale();
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  let response;
  try {
    response = (await fetchActivityByDocumentId({
      locale,
      documentId: documentId,
      fields: [
        "zaloGroup",
        "activityName",
        "activityStartDate",
        "activityEndDate",
        "activityCategory",
        "slug",
      ],
      populate: ["courseContent"],
    })) as SingleActivityResponse;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }
  if (!response || !response.data) {
    notFound();
  }

  return (
    <main className="page-container">
      <AppBreadcrumb
        locale={locale}
        items={getActivityBreadcrumbItems({
          activity: response.data,
          locale,
          detailHref: `/activity/${slug}`,
          append: [
            { label: locale === "vi" ? "Xác nhận" : "Confirmation" },
          ],
        })}
        className="mb-6"
      />
      <ConfirmSection
        zaloGroup={response.data?.zaloGroup}
        activityName={response.data?.activityName}
      />
    </main>
  );
}
