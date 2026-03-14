import { Metadata, ResolvingMetadata } from "next";
import ConfirmSection from "@/features/activity/ui/ConfirmSection";
import { fetchActivityByDocumentId } from "@/features/activity/api/activity.api";
import { notFound } from "next/navigation";
import { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import {
  Activity,
  SingleActivityResponse,
} from "@/features/activity/model/activity.types";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
type Props = {
  params: { slug: string };
};
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  const locale = (await getLocale()) as Locale;

  try {
    const response = await fetchActivityByDocumentId({
      locale,
      documentId: documentId,
      fields: [
        "zaloGroup",
        "activityName",
        "activityStartDate",
        "activityEndDate",
      ],
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
  const locale = (await getLocale()) as Locale;
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
      ],
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
    <main>
      <ConfirmSection
        zaloGroup={response.data?.zaloGroup}
        activityName={response.data?.activityName}
      />
    </main>
  );
}
