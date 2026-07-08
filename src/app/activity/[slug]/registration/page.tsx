import { notFound } from "next/navigation";
import { getAppLocale } from "@/shared/lib/i18n";
import { isActive } from "@/features/activity/api/activity.api";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import { fetchActivityByDocumentIdWithRegistrationForm } from "@/features/activity/api/activity.api";
import type { Activity } from "@/features/activity/model/activity.types";
import ActivityRegistrationPageForm from "@/features/courseRegistration/ui/ActivityRegistrationPageForm";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import { getActivityBreadcrumbItems } from "@/features/activity/lib/activity-breadcrumb";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ActivityRegistrationPage({ params }: Props) {
  const locale = await getAppLocale();
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  let response;
  try {
    response = await fetchActivityByDocumentIdWithRegistrationForm({
      locale,
      documentId,
      populate: ["registrationForm", "courseContent"],
      // Form open/close state is time-sensitive - always fetch fresh so a
      // server-side change to `formOpened` is reflected immediately.
      revalidate: 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }

  const data = response?.data as Activity;
  if (!data) notFound();

  const active = isActive(data);
  const formIsClosed = data.formOpened === false || !active;
  const backHref = `/activity/${slug}`;

  return (
    <main className="page-container">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* <div className="flex items-center gap-4">
          <Button asChild variant="link" className="cursor-pointer px-0">
            <Link href={backHref} className="px-0">
              <ArrowLeft />
              {locale === "vi" ? "Quay lại" : "Back"}
            </Link>
          </Button>{" "}
        </div> */}

        <AppBreadcrumb
          locale={locale}
          items={getActivityBreadcrumbItems({
            activity: data,
            locale,
            detailHref: backHref,
            append: [{ label: locale === "vi" ? "Đăng ký" : "Registration" }],
          })}
        />

        {formIsClosed ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            {locale === "vi"
              ? "Form đăng ký đã đóng hoặc sự kiện không còn nhận đăng ký."
              : "The registration form is closed or this activity is no longer accepting registrations."}
          </div>
        ) : (
          <ActivityRegistrationPageForm
            locale={locale}
            documentId={documentId}
            active={active}
            backHref={backHref}
          />
        )}
      </div>
    </main>
  );
}

