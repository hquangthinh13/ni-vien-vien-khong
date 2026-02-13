import React from "react";
import QuestionCard from "./QuestionCard";
import { fetchAnsweredQuestions } from "./Question.service";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import { Question } from "./Question.type";

export default async function QuestionSection() {
  const locale = (await getLocale()) as Locale;

  let questions: Question[] = [];
  let errorOccurred = false;

  try {
    const response = await fetchAnsweredQuestions({
      locale,
      pagination: { page: 1, pageSize: 4 },
      populate: "*",
    });
    console.log(response);
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
      <div className="text-center py-10 text-red-500">
        Could not load questions. Please try again later.
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center py-10">No questions found.</div>;
  }

  return (
    <div className="grid grid-cols-2 w-full gap-4">
      {questions.map((item) => (
        <QuestionCard key={item.id} question={item} />
      ))}
    </div>
  );
}
