"use client";

import { useRouter } from "next/navigation";
import DynamicActivityRegistrationForm from "./DynamicActivityRegistrationForm";
import type { Locale } from "@/types/locale";

interface ActivityRegistrationPageFormProps {
  locale: Locale;
  documentId: string;
  active: boolean;
  backHref: string;
}

export default function ActivityRegistrationPageForm({
  locale,
  documentId,
  active,
  backHref,
}: ActivityRegistrationPageFormProps) {
  const router = useRouter();

  return (
    <DynamicActivityRegistrationForm
      locale={locale}
      documentId={documentId}
      active={active}
      onClose={() => router.push(backHref)}
    />
  );
}

