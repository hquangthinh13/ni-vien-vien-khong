import React from "react";

import QuestionCard from "./QuestionCard";
import type { Locale } from "@/types/locale";
import { Question } from "../model/question.types";

export default async function QuestionSection({
  locale,
  questions,
}: {
  locale: Locale;
  questions: Question[];
}) {
  if (questions.length === 0) {
    return (
      <div className="py-4 text-muted-foreground">
        {locale === "vi"
          ? "Chưa có câu hỏi nào được gửi."
          : "No questions sent."}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 w-full gap-2 my-4">
      {questions.map((item, index) => (
        <QuestionCard
          locale={locale}
          key={item.id}
          question={item}
          className={index !== questions.length - 1 ? "border-b pb-2" : ""}
        />
      ))}
    </div>
  );
}
