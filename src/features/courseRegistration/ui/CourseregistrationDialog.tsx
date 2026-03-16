"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import DynamicActivityRegistrationForm from "./DynamicActivityRegistrationForm";
import type { Locale } from "@/types/locale";
import { CirclePlus } from "lucide-react";

interface Props {
  documentId: string;
  locale: Locale;
  active: boolean;
  registrationLimit?: number;
}

export default function ActivityRegistrationDialog({
  documentId,
  locale,
  active,
  registrationLimit,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group/reg relative cursor-pointer overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 transition-transform duration-500 group-hover/reg:scale-150" />

          <div className="relative flex items-center justify-between">
            <div className="flex flex-col gap-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                {locale === "vi" ? "Tham gia sự kiện" : "Join us"}
              </span>
              <h4 className="font-serif text-lg font-black uppercase tracking-normal text-secondary-foreground">
                {locale === "vi"
                  ? "Điền thông tin đăng ký ngay"
                  : "Register Now"}
              </h4>
              {registrationLimit && (
                <p className="text-xs text-muted-foreground italic">
                  {locale === "vi"
                    ? "Số lượng đăng ký có hạn: "
                    : "Limited slots available: "}{" "}
                  {registrationLimit}
                </p>
              )}
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 group-hover/reg:scale-110 group-hover/reg:rotate-12">
              <CirclePlus className="h-6 w-6" />
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
