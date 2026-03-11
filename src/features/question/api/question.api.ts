import { getStrapiURL, buildQuery } from "@/shared/lib/api";
import type {
  QuestionFormData,
  QuestionResponse,
  Question,
  FetchAnsweredQuestionsOptions,
} from "../model/question.types";

const QUESTIONS_ENDPOINT = "/api/user-questions";
const AUTHORIZED_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "";

// ============ 1. Create Question (POST) ============

export async function createQuestion(
  formData: QuestionFormData,
): Promise<QuestionResponse> {
  const url = getStrapiURL(QUESTIONS_ENDPOINT);

  const requestBody = {
    data: {
      fullName: formData.fullName,
      email: formData.email,
      title: formData.title,
      questionContent: formData.questionContent,
      locale: formData.locale,
      ...(formData.address && { address: formData.address }),
      ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
    },
  };
  // console.log("Request Body:", requestBody);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    body: JSON.stringify(requestBody),
  });
  // console.log("Response Status:", res.status);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to create question: ${res.status} - ${JSON.stringify(errorData)}`,
    );
  }

  return (await res.json()) as QuestionResponse;
}

// ============ 2. Fetch Answered Questions ============

export async function fetchAnsweredQuestions(
  options: FetchAnsweredQuestionsOptions = {},
): Promise<QuestionResponse> {
  const query = buildQuery(options, false) as URLSearchParams;
  query.set("filters[questionStatus][$eq]", "answered");

  const url = getStrapiURL(`${QUESTIONS_ENDPOINT}?${query.toString()}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZED_TOKEN}`,
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch answered questions: ${res.status}`);
  }

  return (await res.json()) as QuestionResponse;
}

// ============ 3. Check if Question has Video Response ============

export function hasVideoResponse(question: Question): boolean {
  return !!question.videoResponseContent;
}

// ============ 4. Check if Question has Blog Response ============

export function hasBlogResponse(question: Question): boolean {
  return !!question.blogResponseContent;
}

// ============ 5. Filter Questions with Video Response ============

export function filterQuestionsWithVideoResponse(
  questions: Question[],
): Question[] {
  return questions.filter(hasVideoResponse);
}

// ============ 6. Filter Questions with Blog Response ============

export function filterQuestionsWithBlogResponse(
  questions: Question[],
): Question[] {
  return questions.filter(hasBlogResponse);
}
