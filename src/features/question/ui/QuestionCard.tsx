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
import { cn } from "@/shared/lib/utils";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface QuestionCardProps {
  question: Question;
  className?: string;
  fontSize?: "sm" | "md";
  locale?: Locale;
}

const QuestionCard = async ({
  question,
  className,
  fontSize = "sm",
  locale,
}: QuestionCardProps) => {
  const hasVideo = !!question.videoResponseContent;
  const hasBlog = !!question.blogResponseContent;

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
          <div className="group block cursor-pointer">
            <div className="flex flex-col gap-2">
              <DateTimeDisplay
                dateString={question.createdAt}
                locale={locale as string}
                includeTime={false}
              />
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

        <DialogContent
          data-lenis-prevent
          className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl"
        >
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
