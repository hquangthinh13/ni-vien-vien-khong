import QuestionCard from "@/features/question/ui/QuestionCard";
import QuestionForm from "@/features/question/ui/QuestionForm";
import { fetchAnsweredQuestions } from "@/features/question/api/question.api";
import { getAppLocale } from "@/shared/lib/i18n";
import type { Metadata } from "next";
import PageShell from "@/shared/layout/PageShell";
import PageHeader from "@/shared/layout/PageHeader";
import AppBreadcrumb from "@/shared/layout/AppBreadcrumb";
import EmptyState from "@/shared/layout/EmptyState";
import Pagination from "@/shared/layout/Pagination";
import ArchiveResultsHeader from "@/shared/layout/archive/ArchiveResultsHeader";

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
  const totalQuestions = meta?.total ?? questions.length;

  return (
    <PageShell className="pb-16 md:pb-20">
      <AppBreadcrumb
        locale={locale}
        items={[
          {
            label: locale === "vi" ? "Thư viện" : "Library",
            href: "/library",
          },
          {
            label:
              locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A",
          },
        ]}
      />
      <PageHeader
        title={locale === "vi" ? "Vấn đáp Phật pháp" : "Buddhist Q&A"}
        className="mb-10"
      />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <aside
          id="question-form"
          className="order-1 scroll-mt-24 rounded-lg border border-[#dfcdb6] bg-[#f8f2e8] p-5 md:p-7 lg:order-2 lg:col-span-5"
        >
          <div className="mb-6 border-l-4 border-primary pl-4">
            <h2 className="text-xl font-bold uppercase tracking-wide text-foreground">
              {locale === "vi" ? "Đặt câu hỏi" : "Ask a Question"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {locale === "vi"
                ? "Vui lòng trình bày câu hỏi rõ ràng. Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
                : "Please describe your question clearly. We will respond as soon as possible."}
            </p>
          </div>
          <QuestionForm locale={locale} />
        </aside>

        <section className="order-2 min-w-0 lg:order-1 lg:col-span-7">
          <div className="mb-5">
            <ArchiveResultsHeader
              title={
                locale === "vi" ? "Câu hỏi đã giải đáp" : "Answered Questions"
              }
              total={totalQuestions}
              countLabel={
                locale === "vi"
                  ? "câu hỏi"
                  : totalQuestions === 1
                    ? "question"
                    : "questions"
              }
            />
          </div>

          {questions.length === 0 ? (
            <EmptyState
              message={
                locale === "vi"
                  ? "Chưa có câu hỏi nào được phản hồi."
                  : "No answered questions yet."
              }
            />
          ) : (
            <>
              <div className="hidden grid-cols-[6.5rem_minmax(0,1fr)_7.5rem_7rem_1.25rem] gap-3 border-b border-border/80 pb-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <span>{locale === "vi" ? "Ngày" : "Date"}</span>
                <span>{locale === "vi" ? "Câu hỏi" : "Question"}</span>
                <span>{locale === "vi" ? "Người hỏi" : "Asked by"}</span>
                <span>{locale === "vi" ? "Giải đáp" : "Answer"}</span>
                <span />
              </div>

              <div>
                {questions.map((item) => (
                  <QuestionCard
                    key={item.id}
                    question={item}
                    locale={locale}
                    variant="archive"
                  />
                ))}
              </div>
            </>
          )}

          {meta ? (
            <Pagination
              currentPage={currentPage}
              pageCount={meta.pageCount}
              locale={locale}
              className="mt-10 border-t border-border/80 pt-6"
            />
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}
