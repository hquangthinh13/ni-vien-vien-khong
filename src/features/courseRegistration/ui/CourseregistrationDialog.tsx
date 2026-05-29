"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/types/locale";
import { CirclePlus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

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

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => router.push(`/activity/${slug}/registration`)}
      className={cn(
        "text-left w-full group/reg relative cursor-pointer overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md",
        isDisabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 transition-transform duration-500 group-hover/reg:scale-150" />

      <div className="relative flex items-center justify-between">
        <div className="flex flex-col gap-0">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            {locale === "vi" ? "Tham gia sự kiện" : "Join us"}
          </span>
          <span className="font-serif text-lg font-black uppercase tracking-normal text-foreground">
            {locale === "vi" ? "Điền thông tin đăng ký ngay" : "Register Now"}
          </span>
          <p className="text-xs text-muted-foreground italic">
            {registrationLimit && (
              <>
                {locale === "vi"
                  ? "Số lượng đăng ký có hạn: "
                  : "Limited slots available: "}
                {registrationLimit}
              </>
            )}
            {registrationLimit && isDisabled && " - "}
            {isDisabled &&
              (locale === "vi"
                ? "Form đăng ký đã đóng"
                : "Registration form is closed")}
          </p>
        </div>

        <div className="flex aspect-square h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 group-hover/reg:scale-110 group-hover/reg:rotate-12">
          <CirclePlus className="h-6 w-6" />
        </div>
      </div>
    </button>
  );
}
