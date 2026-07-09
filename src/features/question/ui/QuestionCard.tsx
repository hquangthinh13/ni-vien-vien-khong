import {
  ChevronRight,
  FileText,
  PlayCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import type { Question } from "@/features/question/model/question.types";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { DEFAULT_LOCALE, type Locale } from "@/types/locale";
import { cn } from "@/shared/lib/utils";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface QuestionCardProps {
  question: Question;
  className?: string;
  fontSize?: "sm" | "md";
  locale?: Locale;
  variant?: "compact" | "archive";
}

function getEmbedUrl(url?: string) {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function getAnswerType(question: Question, locale: Locale) {
  const hasVideo = Boolean(question.videoResponseContent);
  const hasBlog = Boolean(question.blogResponseContent);

  if (hasVideo && hasBlog) {
    return locale === "vi" ? "Video & Bài viết" : "Video & Article";
  }
  if (hasVideo) return "Video";
  if (hasBlog) return locale === "vi" ? "Bài viết" : "Article";
  return locale === "vi" ? "Giải đáp" : "Answer";
}

export default function QuestionCard({
  question,
  className,
  fontSize = "sm",
  locale,
  variant = "compact",
}: QuestionCardProps) {
  const localeToUse = locale ?? DEFAULT_LOCALE;
  const hasVideo = Boolean(question.videoResponseContent);
  const hasBlog = Boolean(question.blogResponseContent);
  const embedUrl = getEmbedUrl(question.videoResponseContent?.videoLink);
  const answerType = getAnswerType(question, localeToUse);
  const titleClass = fontSize === "md" ? "text-base" : "text-sm";

  const trigger =
    variant === "archive" ? (
      <div className={cn("group cursor-pointer", className)}>
        <div className="hidden min-h-20 grid-cols-[6.5rem_minmax(0,1fr)_7.5rem_7rem_1.25rem] items-center gap-3 border-b border-border/75 py-3 md:grid">
          <DateTimeDisplay
            dateString={question.createdAt}
            locale={localeToUse}
            includeTime={false}
            className="md:text-xs"
          />
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
            {question.title}
          </h3>
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {question.fullName}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            {hasVideo && !hasBlog ? (
              <PlayCircle className="size-4" />
            ) : (
              <FileText className="size-4" />
            )}
            {answerType}
          </span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>

        <div className="flex flex-col gap-2 border-b border-border/75 py-4 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <DateTimeDisplay
              dateString={question.createdAt}
              locale={localeToUse}
              includeTime={false}
              className="md:text-xs"
            />
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              {hasVideo && !hasBlog ? (
                <PlayCircle className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
              {answerType}
            </span>
          </div>
          <h3 className="line-clamp-3 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
            {question.title}
          </h3>
          <span className="text-xs text-muted-foreground">
            {question.fullName}
          </span>
        </div>
      </div>
    ) : (
      <div className={cn("group block cursor-pointer", className)}>
        <div className="flex flex-col gap-2">
          <DateTimeDisplay
            dateString={question.createdAt}
            locale={localeToUse}
            includeTime={false}
            className="md:text-xs"
          />
          <h3
            className={cn(
              "line-clamp-2 font-semibold leading-snug transition-colors duration-200 group-hover:text-primary",
              titleClass,
            )}
          >
            {question.title}
          </h3>
          {question.fullName ? (
            <span className="ml-auto font-mono text-xs text-secondary-foreground/80">
              — {question.fullName}
            </span>
          ) : null}
        </div>
      </div>
    );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        data-lenis-prevent
        className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl"
      >
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle>{question.title}</DialogTitle>
          <DialogDescription asChild>
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-5">
              <p className="text-base font-medium italic leading-relaxed text-foreground/80">
                &ldquo;{question.questionContent}&rdquo;
              </p>
            </div>
          </DialogDescription>
          {question.fullName ? (
            <div className="flex justify-end">
              <span className="font-mono text-sm text-secondary-foreground">
                — {question.fullName}
              </span>
            </div>
          ) : null}
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {hasVideo ? (
            <section className="flex flex-col gap-4">
              <h3 className="border-l-4 border-primary pl-2 font-bold">
                {question.videoResponseContent?.title}
              </h3>
              {embedUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  <iframe
                    src={embedUrl}
                    title={
                      question.videoResponseContent?.title ||
                      (localeToUse === "vi" ? "Video giải đáp" : "Video answer")
                    }
                    className="absolute inset-0 size-full"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          {hasBlog && question.blogResponseContent ? (
            <section className="flex flex-col gap-4">
              <h3 className="border-l-4 border-primary pl-2 font-bold">
                {question.blogResponseContent.title}
              </h3>
              <div className="rounded-lg border border-border bg-background p-4">
                <RichTextRenderer
                  content={
                    question.blogResponseContent
                      .responseContent as unknown as BlocksContent
                  }
                />
              </div>
            </section>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
