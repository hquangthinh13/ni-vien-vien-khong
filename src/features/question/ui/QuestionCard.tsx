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
import { Info } from "lucide-react";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = async ({ question }: QuestionCardProps) => {
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
    <div className="w-full overflow-hidden bg-white border border-border rounded-xl shadow-sm transition-all hover:shadow-md">
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full flex-1 h-full text-left outline-none group border-l-6 border-primary cursor-pointer flex flex-col p-4 gap-1 bg-orange-50/30 hover:bg-orange-100/40 transition-colors">
            {" "}
            <p className="text-lg font-bold text-foreground leading-tight line-clamp-2">
              {" "}
              {question.title}
            </p>{" "}
            <span className="text-xs text-muted-foreground">
              Vào lúc{" "}
              {question.createdAt
                ? formatFriendlyDate(question.createdAt, locale, true)
                : ""}
            </span>
            <div className="pt-2">
              <div className="italic text-foreground/90 bg-muted/30 p-3 rounded-lg border-primary/20">
                <p className="line-clamp-3 text-sm leading-relaxed">
                  {question.questionContent}
                </p>
              </div>
            </div>{" "}
            <div className="flex justify-end mt-auto">
              <span className="text-xs text-secondary-foreground">
                - Gửi bởi{" "}
                <span className="font-semibold">{question.fullName}</span>
              </span>
            </div>{" "}
            <span className="flex items-center text-secondary-foreground/70 text-xs">
              <Info className="inline-block mr-1" size={12} />
              Nhấn vào để xem câu trả lời
            </span>
          </div>
        </DialogTrigger>

        <DialogContent
          aria-describedby="Answered question content"
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground pr-6">
              {question.title}
            </DialogTitle>
            <div className="pt-2 pb-4 border-b border-orange-100">
              <p className="italic text-foreground/90 bg-muted/30 p-3 rounded-lg border-l-4 border-primary/20">
                {question.questionContent}
              </p>{" "}
              <div className="flex justify-end mt-2">
                <span className="text-xs text-secondary-foreground">
                  - Gửi bởi{" "}
                  <span className="font-semibold">{question.fullName}</span>
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="w-full">
              {hasVideo && (
                <div className="space-y-4 mb-8">
                  {question.videoResponseContent?.title && (
                    <h4 className="font-bold text-foreground text-lg">
                      {question.videoResponseContent.title}
                    </h4>
                  )}
                  {embedUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md border">
                      <iframe
                        src={embedUrl}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                      />
                    </div>
                  ) : (
                    <p className="text-red-500 italic text-sm">
                      Link video không hợp lệ
                    </p>
                  )}
                </div>
              )}

              {hasBlog && (
                <div className="space-y-3">
                  {question.blogResponseContent?.title && (
                    <h4 className="font-bold text-foreground text-lg border-l-4 border-primary pl-3">
                      {question.blogResponseContent.title}
                    </h4>
                  )}
                  {question.blogResponseContent?.responseContent && (
                    <div className="prose prose-orange max-w-none">
                      <RichTextRenderer
                        content={
                          question.blogResponseContent
                            .responseContent as unknown as BlocksContent
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {!hasVideo && !hasBlog && (
                <div className="text-center py-10">
                  <p className="text-gray-500 italic">
                    Đang cập nhật nội dung phản hồi...
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionCard;
