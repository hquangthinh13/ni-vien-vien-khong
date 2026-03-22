import React from "react";

import QuestionCard from "./QuestionCard";
import { fetchAnsweredQuestions } from "../api/question.api";
import type { Locale } from "@/types/locale";
import { Question } from "../model/question.types";

export default async function QuestionSection({ locale }: { locale: Locale }) {
  let questions: Question[] = [];
  let errorOccurred = false;

  try {
    const response = await fetchAnsweredQuestions({
      locale,
      sort: ["publishedAt:desc"],
      pagination: { page: 1, pageSize: 5 },
      populate: "*",
    });
    // console.log(response);
    if (Array.isArray(response.data)) {
      questions = response.data;
    } else if (response.data) {
      questions = [response.data];
    }
  } catch (error) {
    console.error("Failed to load questions:", error);
    errorOccurred = true;
  }

  if (errorOccurred) {
    return (
      <div className="py-4 text-red-500">
        Could not load questions. Please try again later.
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-4 text-muted-foreground">
        {locale === "vi"
          ? "Chưa có câu hỏi nào được gửi."
          : "No questions found."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 w-full gap-2 my-4">
      {questions.map((item, index) => (
        <QuestionCard
          key={item.id}
          question={item}
          className={index !== questions.length - 1 ? "border-b pb-2" : ""}
        />
      ))}
    </div>
  );
}
