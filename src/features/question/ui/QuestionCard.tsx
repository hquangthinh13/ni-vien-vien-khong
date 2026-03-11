// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/shared/ui/dialog";
// import { Question } from "@/features/question/model/question.types";
// import RichTextRenderer from "@/shared/layout/RichTextRenderer";
// import { BlocksContent } from "@strapi/blocks-react-renderer";
// import { Locale } from "next-intl";
// import { formatFriendlyDate } from "@/shared/lib/utils";
// import { getLocale } from "next-intl/server";
// import { Info } from "lucide-react";

// interface QuestionCardProps {
//   question: Question;
// }

// const QuestionCard = async ({ question }: QuestionCardProps) => {
//   const hasVideo = !!question.videoResponseContent;
//   const hasBlog = !!question.blogResponseContent;
//   const locale = (await getLocale()) as Locale;

//   const getEmbedUrl = (url?: string) => {
//     if (!url) return "";
//     const regExp =
//       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     const videoId = match && match[2].length === 11 ? match[2] : null;
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
//   };

//   const embedUrl = getEmbedUrl(question.videoResponseContent?.videoLink);

//   return (
//     <div className="w-full overflow-hidden bg-white border-t-6 odd:border-primary even:border-accent rounded-xl shadow-sm transition-all hover:shadow-md">
//       <Dialog>
//         <DialogTrigger asChild>
//           <div className="w-full flex-1 h-full text-left outline-none group b cursor-pointer flex flex-col p-4 gap-1 bg-orange-50/30 hover:bg-orange-100/40 transition-colors">
//             {" "}
//             <p className="text-lg font-bold text-foreground leading-tight line-clamp-2">
//               {" "}
//               {question.title}
//             </p>{" "}
//             <span className="text-xs text-muted-foreground">
//               Vào lúc{" "}
//               {question.createdAt
//                 ? formatFriendlyDate(question.createdAt, locale, true)
//                 : ""}
//             </span>
//             <div className="pt-2">
//               <div className="italic text-foreground/90 bg-muted/30 p-3 rounded-lg border-primary/20">
//                 <p className="line-clamp-3 text-sm leading-relaxed">
//                   {question.questionContent}
//                 </p>
//               </div>
//             </div>{" "}
//             <div className="flex justify-end mt-auto">
//               <span className="text-xs text-secondary-foreground">
//                 - Gửi bởi{" "}
//                 <span className="font-semibold">{question.fullName}</span>
//               </span>
//             </div>{" "}
//             <span className="flex items-center text-secondary-foreground/70 text-xs">
//               <Info className="inline-block mr-1" size={12} />
//               Nhấn vào để xem câu trả lời
//             </span>
//           </div>
//         </DialogTrigger>

//         <DialogContent
//           aria-describedby="Answered question content"
//           className="max-w-2xl max-h-[90vh] overflow-y-auto"
//         >
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold text-foreground pr-6">
//               {question.title}
//             </DialogTitle>
//             <div className="pt-2 pb-4 border-b border-orange-100">
//               <p className="italic text-foreground/90 bg-muted/30 p-3 rounded-lg border-l-4 border-primary/20">
//                 {question.questionContent}
//               </p>{" "}
//               <div className="flex justify-end mt-2">
//                 <span className="text-xs text-secondary-foreground">
//                   - Gửi bởi{" "}
//                   <span className="font-semibold">{question.fullName}</span>
//                 </span>
//               </div>
//             </div>
//           </DialogHeader>

//           <div className="py-4">
//             <div className="w-full">
//               {hasVideo && (
//                 <div className="space-y-4 mb-8">
//                   {question.videoResponseContent?.title && (
//                     <h4 className="font-bold text-foreground text-lg">
//                       {question.videoResponseContent.title}
//                     </h4>
//                   )}
//                   {embedUrl ? (
//                     <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md border">
//                       <iframe
//                         src={embedUrl}
//                         className="absolute top-0 left-0 w-full h-full"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                         title="YouTube video player"
//                       />
//                     </div>
//                   ) : (
//                     <p className="text-red-500 italic text-sm">
//                       Link video không hợp lệ
//                     </p>
//                   )}
//                 </div>
//               )}

//               {hasBlog && (
//                 <div className="space-y-3">
//                   {question.blogResponseContent?.title && (
//                     <h4 className="font-bold text-foreground text-lg border-l-4 border-primary pl-3">
//                       {question.blogResponseContent.title}
//                     </h4>
//                   )}
//                   {question.blogResponseContent?.responseContent && (
//                     <div className="prose prose-orange max-w-none">
//                       <RichTextRenderer
//                         content={
//                           question.blogResponseContent
//                             .responseContent as unknown as BlocksContent
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               {!hasVideo && !hasBlog && (
//                 <div className="text-center py-10">
//                   <p className="text-gray-500 italic">
//                     Đang cập nhật nội dung phản hồi...
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default QuestionCard;
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
import { MessageCircleQuestion, ArrowRight } from "lucide-react";

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
    <div className="w-full">
      <Dialog>
        <DialogTrigger asChild>
          {/* Trigger tinh gọn cho Sidebar */}
          <div className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-orange-100 bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg active:scale-[0.98]">
            {/* Hiệu ứng Shine tương tự Button đăng ký */}
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
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-2">
              {/* <div className="h-1 w-12 bg-primary rounded-full" /> */}
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Câu hỏi từ cộng đồng
              </span>
            </div>
            <DialogTitle className="text-2xl font-serif font-black uppercase leading-tight text-foreground pr-8">
              {question.title}
            </DialogTitle>

            <div className="relative overflow-hidden rounded-2xl bg-orange-50/50 p-5 border border-orange-100/50">
              <p className="relative z-10 italic text-foreground/80 leading-relaxed font-medium">
                &ldquo;{question.questionContent}&rdquo;
              </p>
              <div className="mt-4 flex justify-end">
                <span className="text-sm font-bold text-secondary-foreground">
                  — {question.fullName}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="py-6 space-y-8">
            {/* Phần trả lời (Video/Blog) giữ nguyên logic hiển thị nhưng làm đẹp UI hơn */}
            {hasVideo && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-serif text-lg font-black uppercase">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {question.videoResponseContent?.title}
                </h4>
                {embedUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl border-4 border-white">
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
                <h4 className="flex items-center gap-2 font-serif text-lg font-black uppercase">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {question.blogResponseContent?.title}
                </h4>
                <div className="prose prose-orange max-w-none bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
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
