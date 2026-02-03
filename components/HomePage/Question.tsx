import { id } from "date-fns/locale";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
export interface QuestionProps {
  id: string;
  name: string;
  question: string;
  answer: string;
  createdAt: string;
  answerDate: string;
}

const Question = ({
  name,
  question,
  answer,
  createdAt,
  answerDate,
}: QuestionProps) => {
  return (
    <div className="mx-auto my-4 overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm">
      <Collapsible>
        <CollapsibleTrigger className="w-full text-left outline-none">
          <div className="cursor-pointer flex flex-col p-5 bg-orange-50/30 hover:bg-orange-100/40 transition-colors w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-orange-800 uppercase tracking-wider">
                Câu hỏi
              </span>
              <span className="text-xs text-gray-400">
                {new Date(createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
              {`"${question}"`}
            </p>
            <div className="mt-2 flex items-center justify-end">
              <p className="text-sm text-gray-500">
                — Gửi bởi <span className="font-medium">{name}</span>
              </p>
              {/* <span className="text-secondary text-xs">
                Nhấn vào để xem câu trả lời
              </span> */}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
          {/* Answer Section */}
          <div className="p-5 bg-white border-t border-orange-100/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">
                Trả lời
              </span>
              <span className="text-xs text-gray-400">
                {new Date(answerDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-1 bg-emerald-100 rounded-full"></div>
              <p className="text-gray-600 italic leading-relaxed">{answer}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Question;
