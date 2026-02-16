import Image from "next/image";
import lineOrnament from "@/public/ornament-01.svg";
import React from "react";
import QuestionCard from "@/components/Question/QuestionCard";
import QuestionForm from "@/components/Question/QuestionForm";
import { Button } from "@/components/ui/button";

import { fetchAnsweredQuestions } from "@/components/Question/Question.service";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import { Question } from "@/components/Question/Question.type";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
export default async function QuestionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;

  const response = await fetchAnsweredQuestions({
    locale,
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
    sort: "publishedAt:desc",
    populate: "*",
  });
  const questions = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <div className="flex flex-col w-full mx-auto max-w-10xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Vấn đáp Phật pháp
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex w-full justify-center">
            <Button variant="outline" className="cursor-pointer">
              Đặt câu hỏi
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent
          aria-describedby="Question form"
          className="max-h-[90vh] overflow-y-auto"
        >
          {" "}
          <DialogTitle>Đặt câu hỏi</DialogTitle>
          <QuestionForm locale={locale} />
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {questions.map((item) => (
          <QuestionCard key={item.id} question={item} />
        ))}
      </div>

      {meta && meta.pageCount > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          {currentPage > 1 && (
            <a
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 border rounded hover:bg-accent"
            >
              Trước
            </a>
          )}
          <span className="flex items-center">
            Trang {meta.page} trên {meta.pageCount}
          </span>
          {currentPage < meta.pageCount && (
            <a
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 border rounded hover:bg-accent"
            >
              Sau
            </a>
          )}
        </div>
      )}
    </div>
  );
}
