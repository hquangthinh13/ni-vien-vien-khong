"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import DynamicActivityRegistrationForm from "./DynamicActivityRegistrationForm";
import type { Locale } from "@/types/locale";
import { CirclePlus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
interface Props {
  documentId: string;
  locale: Locale;
  active: boolean;
  registrationLimit?: number;
  formOpened?: boolean;
}

export default function ActivityRegistrationDialog({
  documentId,
  locale,
  active,
  registrationLimit,
  formOpened,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={true}>
        <div>
          <div
            className={cn(
              "group/reg relative cursor-pointer overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md",
              (formOpened === false || !active) &&
                "pointer-events-none opacity-50",
            )}
          >
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 transition-transform duration-500 group-hover/reg:scale-150" />

            <div className="relative flex items-center justify-between">
              <div className="flex flex-col gap-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  {locale === "vi" ? "Tham gia sự kiện" : "Join us"}
                </span>
                <span className="font-serif text-lg font-black uppercase tracking-normal text-foreground">
                  {locale === "vi"
                    ? "Điền thông tin đăng ký ngay"
                    : "Register Now"}
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
                  {registrationLimit &&
                    (formOpened === false || !active) &&
                    " - "}
                  {(formOpened === false || !active) &&
                    (locale === "vi"
                      ? "Form đăng ký đã đóng"
                      : "Registration form is closed")}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 group-hover/reg:scale-110 group-hover/reg:rotate-12">
                <CirclePlus className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={documentId}
        className="max-h-[90vh] md:min-w-2xl lg:min-w-3xl overflow-y-auto"
      >
        <DialogTitle>Đăng ký tham gia</DialogTitle>
        <DialogDescription>
          Vui lòng điền đầy đủ thông tin để đăng ký tham gia sự kiện.
        </DialogDescription>
        <DynamicActivityRegistrationForm
          locale={locale}
          documentId={documentId}
          active={active}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
