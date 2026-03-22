// "use client";

import dynamic from "next/dynamic";
import { MessageCircleQuestionMark } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import type { Locale } from "@/types/locale";

const QuestionForm = dynamic(
  () => import("@/features/question/ui/QuestionForm"),
  {
    loading: () => <div>Đang tải biểu mẫu...</div>,
  },
);

export default function QuestionDialogTrigger({ locale }: { locale: Locale }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group/reg relative cursor-pointer overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left transition-all duration-300 hover:bg-primary/10 hover:shadow-md"
        >
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 transition-transform duration-500 group-hover/reg:scale-150" />

          <div className="relative flex items-center justify-between">
            <div className="flex flex-col gap-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                {locale === "vi" ? "Bạn có thắc mắc?" : "Have a Question?"}
              </span>
              <span className="font-serif text-lg font-black uppercase tracking-normal text-foreground ">
                {locale === "vi"
                  ? "Đặt câu hỏi cho chúng tôi"
                  : "Ask a Question"}
              </span>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 group-hover/reg:scale-110 group-hover/reg:rotate-12">
              <MessageCircleQuestionMark className="h-6 w-6" />
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl ">
        <DialogTitle>Đặt câu hỏi</DialogTitle>
        <DialogDescription>
          {locale === "vi"
            ? "Hãy đặt câu hỏi của bạn dưới đây và chúng tôi sẽ trả lời sớm nhất có thể."
            : "Please ask your question below and we will respond as soon as possible."}
        </DialogDescription>
        <QuestionForm locale={locale} />
      </DialogContent>
    </Dialog>
  );
}
