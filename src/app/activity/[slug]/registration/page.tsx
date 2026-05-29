import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { Button } from "@/shared/ui/button";
import { isActive } from "@/features/activity/api/activity.api";
import { getDocumentIdFromSlug } from "@/shared/lib/utils";
import { fetchActivityByDocumentIdWithRegistrationForm } from "@/features/activity/api/activity.api";
import type { Activity } from "@/features/activity/model/activity.types";
import ActivityRegistrationPageForm from "@/features/courseRegistration/ui/ActivityRegistrationPageForm";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ActivityRegistrationPage({ params }: Props) {
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;
  const documentId = getDocumentIdFromSlug(slug);

  let response;
  try {
    response = await fetchActivityByDocumentIdWithRegistrationForm({
      locale,
      documentId,
      populate: ["registrationForm"],
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
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            asChild
            variant="outline"
            className="cursor-pointer"
          >
            <Link href={backHref} className="">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>{" "}
          <h1 className="text-xl font-bold font-serif text-foreground">
            {locale === "vi" ? "Đăng ký tham gia" : "Activity Registration"}
          </h1>
        </div>

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
