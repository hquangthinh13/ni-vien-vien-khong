import React from "react";
import QuestionCard from "@/features/question/ui/QuestionCard";
import QuestionForm from "@/features/question/ui/QuestionForm";
import { Button } from "@/shared/ui/button";
import { fetchAnsweredQuestions } from "@/features/question/api/question.api";
import { getAppLocale } from "@/shared/lib/i18n";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";

export const metadata: Metadata = {
  title: "Vấn đáp Phật pháp",
};

export default async function QuestionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getAppLocale();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;

  const response = await fetchAnsweredQuestions({
    locale,
    pagination: {
      page: currentPage,
      pageSize,
    },
    sort: "publishedAt:desc",
    populate: "*",
  });

  const questions = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta?.pagination;

  return (
    <PageShell>
      <AppBreadcrumb locale={locale} items={[{ label: locale === "vi" ? "Thư viện" : "Library" }, { label: locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A" }]} />
      <PageHeader
        title={locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A"}
      />

      <Dialog>
        <DialogTrigger asChild>
          <div className="flex w-full justify-center">
            <Button variant="outline" className="cursor-pointer">
              {locale === "vi" ? "Gửi câu hỏi" : "Submit Question"}
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent
          data-lenis-prevent
          aria-describedby="Question form"
          className="max-h-[90vh] overflow-y-auto md:min-w-2xl lg:min-w-3xl"
        >
          <DialogTitle>
            {locale === "vi" ? "Đặt câu hỏi" : "Ask a Question"}
          </DialogTitle>
          <QuestionForm locale={locale} />
        </DialogContent>
      </Dialog>

      {questions.length === 0 ? (
        <EmptyState
          className="mt-4"
          message={
            locale === "vi"
              ? "Chưa có câu hỏi nào được phản hồi."
              : "No answered questions yet."
          }
        />
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {questions.map((item, index) => (
            <QuestionCard
              key={item.id}
              question={item}
              className={index !== questions.length - 1 ? "border-b pb-4" : ""}
              fontSize="md"
              locale={locale}
            />
          ))}
        </div>
      )}

      {meta ? (
        <Pagination
          currentPage={currentPage}
          pageCount={meta.pageCount}
          locale={locale}
          className="mt-12"
        />
      ) : null}
    </PageShell>
  );
}
