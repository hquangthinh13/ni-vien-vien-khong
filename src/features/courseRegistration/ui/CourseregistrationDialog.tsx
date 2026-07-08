"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/types/locale";
import { ArrowUpRight, PenLine } from "lucide-react";

interface Props {
  slug: string;
  locale: Locale;
  active: boolean;
  registrationLimit?: number;
  formOpened?: boolean;
}

export default function ActivityRegistrationDialog({
  slug,
  locale,
  active,
  registrationLimit,
  formOpened,
}: Props) {
  const router = useRouter();
  const isDisabled = formOpened === false || !active;

  if (isDisabled) return null;

  return (
    <button
      type="button"
      onClick={() => router.push(`/activity/${slug}/registration`)}
      className="group/reg relative w-full cursor-pointer overflow-hidden rounded-lg border border-primary/15 bg-card px-4 py-3 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-primary transition-all duration-300 group-hover/reg:w-1.5" />

      <div className="relative flex items-center gap-3 pl-1">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover/reg:bg-primary group-hover/reg:text-primary-foreground">
          <PenLine className="h-4 w-4" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          {/* <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">
            {locale === "vi" ? "Đăng ký tham gia" : "Registration"}
          </span> */}
          <span className="mb-0.5 block font-serif text-base font-semibold leading-normal text-foreground">
            {locale === "vi" ? "Điền thông tin đăng ký" : "Register for this event"}
          </span>
          {typeof registrationLimit === "number" ? (
            // <p className="mt-1 text-xs text-muted-foreground">
            //   {locale === "vi" ? "Số lượng đăng ký: " : "Limited slots: "}
            //   <span className="font-semibold text-foreground">
            //     {registrationLimit}
            //   </span>
            // </p>

            <p className="block font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
             {locale === "vi" ? "Số lượng đăng ký: " : "Limited slots: "} {registrationLimit}
          </p>
          ) : null}
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary transition-transform duration-300 group-hover/reg:-translate-y-0.5 group-hover/reg:translate-x-0.5">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
