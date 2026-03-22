import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Question } from "@/features/question/model/question.types";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import { Locale } from "next-intl";
import { formatFriendlyDate } from "@/shared/lib/utils";
import { getLocale } from "next-intl/server";
import { MessageCircleQuestion } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface QuestionCardProps {
  question: Question;
  className?: string;
  fontSize?: "sm" | "md";
}

const QuestionCard = async ({
  question,
  className,
  fontSize = "sm",
}: QuestionCardProps) => {
  const hasVideo = !!question.videoResponseContent;
  const hasBlog = !!question.blogResponseContent;
  const locale = (await getLocale()) as Locale;

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const embedUrl = getEmbedUrl(question.videoResponseContent?.videoLink);

  return (
    <div className={cn("w-full", className)}>
      <Dialog>
        <DialogTrigger asChild>
          {/* <div className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-orange-100 bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg active:scale-[0.98]">
            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />

            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {question.createdAt
                    ? formatFriendlyDate(question.createdAt, locale, true)
                    : ""}
                </span>
                <MessageCircleQuestion
                  size={14}
                  className="text-primary/40 transition-transform duration-300 group-hover:rotate-12 group-hover:text-primary"
                />
              </div>

              <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {question.title}
              </h3>

              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-secondary-foreground/60 italic">
                  — {question.fullName}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Xem chi tiết <ArrowRight size={10} />
                </div>
              </div>
            </div>
          </div> */}
          <div className="group block cursor-pointer">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                {question.createdAt
                  ? formatFriendlyDate(question.createdAt, locale, false)
                  : ""}
              </span>
              <h3
                className={`text-${fontSize} font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200`}
              >
                {question.title}
              </h3>{" "}
              <span className="ml-auto text-xs text-secondary-foreground/80 font-mono">
                {question.fullName ? `— ${question.fullName}` : ""}
              </span>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl">
          <DialogHeader className="space-y-4">
            <DialogTitle>{question.title}</DialogTitle>
            <div className="relative overflow-hidden rounded-xl bg-orange-50/50 p-5 border border-orange-100/50">
              <p className="relative text-md z-10 italic text-foreground/80 leading-relaxed font-medium">
                &ldquo;{question.questionContent}&rdquo;
              </p>
            </div>{" "}
            <div className="flex justify-end">
              <span className="text-sm text-secondary-foreground font-mono">
                — {question.fullName}
              </span>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {hasVideo && (
              <div className="space-y-4">
                <h3 className="col-span-full font-bold border-l-4 border-primary pl-2">
                  {question.videoResponseContent?.title}
                </h3>
                {embedUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-xl border-4 border-white">
                    <iframe
                      src={embedUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {hasBlog && question.blogResponseContent && (
              <div className="space-y-4">
                <h3 className="col-span-full font-bold border-l-4 border-primary pl-2">
                  {question.blogResponseContent?.title}
                </h3>
                <div className="prose prose-orange max-w-none bg-white p-4 rounded-xl border border-orange-50 shadow-sm">
                  <RichTextRenderer
                    content={
                      question.blogResponseContent
                        .responseContent as unknown as BlocksContent
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionCard;
