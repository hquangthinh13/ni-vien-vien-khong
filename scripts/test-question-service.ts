import "dotenv/config";
import { isValidLocale, Locale } from "@/types/locale";
import {
  createQuestion,
  fetchAnsweredQuestions,
  hasVideoResponse,
  hasBlogResponse,
  filterQuestionsWithVideoResponse,
  filterQuestionsWithBlogResponse,
} from "@/components/Question/Question.service";
import type {
  QuestionFormData,
  Question,
} from "@/components/Question/Question.type";

const locale = isValidLocale(process.argv[2]) ? process.argv[2] : "vi";

const main = async () => {
  try {
    console.log("=== Testing Question Services ===\n");

    // Test 1: Create a question
    console.log(
      "1. Creating a new question (with optional address and phone):",
    );
    const questionFormData: QuestionFormData = {
      fullName: "Lam Mai Tuyen",
      email: "nguyenvana@example.com",
      title: "Làm sao để bắt đầu tu tập?",
      questionContent:
        "Tôi là người mới bắt đầu, vậy bước đầu tiên để bắt đầu tu tập là gì?",
      address: "123 Đường Lê Lợi, Hà Nội",
      phoneNumber: "+84912345678",
      locale: locale,
    };

    // try {
    //   const newQuestion = await createQuestion(questionFormData);
    //   console.log("✓ Question created successfully!");
    //   console.log("Response:", JSON.stringify(newQuestion, null, 2));
    // } catch (error) {
    //   console.log(
    //     "✗ Failed to create question:",
    //     error instanceof Error ? error.message : error,
    //   );
    // }
    // console.log();

    // Test 2: Create a minimal question (without optional fields)
    console.log("2. Creating a question with minimal fields:");
    const minimalQuestionData: QuestionFormData = {
      fullName: "Huynh Quang Thinh",
      email: "tranthib@example.com",
      title: "Khóa tu này bao lâu?",
      questionContent: "Khóa tu này kéo dài bao nhiêu ngày?",
      locale: locale,
    };

    // try {
    //   const minimalQuestion = await createQuestion(minimalQuestionData);
    //   console.log("✓ Question created successfully!");
    //   console.log("Response:", JSON.stringify(minimalQuestion, null, 2));
    // } catch (error) {
    //   console.log(
    //     "✗ Failed to create question:",
    //     error instanceof Error ? error.message : error,
    //   );
    // }
    // console.log();

    // Test 3: Fetch answered questions with pagination
    console.log("3. Fetching answered questions (with pagination):");
    try {
      const answeredQuestions = await fetchAnsweredQuestions({
        locale,
        pagination: { page: 1, pageSize: 10 },
        populate: "*",
      });

      if (Array.isArray(answeredQuestions.data)) {
        console.log(
          `✓ Found ${answeredQuestions.data.length} answered questions`,
        );
        const totalQuestions = answeredQuestions.meta?.pagination?.total || 0;
        console.log(`  Total answered questions: ${totalQuestions}`);

        if (answeredQuestions.data.length > 0) {
          console.log("\n  Sample questions:");
          answeredQuestions.data.slice(0, 3).forEach((question, index) => {
            console.log(`    ${index + 1}. "${question.attributes.title}"`);
            console.log(
              `       Status: ${question.attributes.questionStatus || "N/A"}`,
            );
            console.log(
              `       Video Response: ${hasVideoResponse(question) ? "Yes" : "No"}`,
            );
            console.log(
              `       Blog Response: ${hasBlogResponse(question) ? "Yes" : "No"}`,
            );
          });
        }
      } else if (answeredQuestions.data) {
        console.log("✓ Answered question found:");
        const question = answeredQuestions.data as Question;
        console.log(`  Title: "${question.attributes.title}"`);
        console.log(
          `  Video Response: ${hasVideoResponse(question) ? "Yes" : "No"}`,
        );
        console.log(
          `  Blog Response: ${hasBlogResponse(question) ? "Yes" : "No"}`,
        );
      } else {
        console.log("⚠ No answered questions found");
      }
    } catch (error) {
      console.log(
        "✗ Failed to fetch answered questions:",
        error instanceof Error ? error.message : error,
      );
    }
    console.log();

    // Test 4: Fetch all answered questions and filter by response type
    console.log(
      "4. Fetching answered questions and filtering by response type:",
    );
    try {
      const allAnswered = await fetchAnsweredQuestions({
        locale,
        pagination: { pageSize: 20 },
        populate: "*",
      });

      if (Array.isArray(allAnswered.data) && allAnswered.data.length > 0) {
        const questionsWithVideo = filterQuestionsWithVideoResponse(
          allAnswered.data,
        );
        const questionsWithBlog = filterQuestionsWithBlogResponse(
          allAnswered.data,
        );

        console.log(`✓ Analyzed ${allAnswered.data.length} answered questions`);
        console.log(
          `  Questions with video response: ${questionsWithVideo.length}`,
        );
        console.log(
          `  Questions with blog response: ${questionsWithBlog.length}`,
        );

        if (questionsWithVideo.length > 0) {
          console.log("\n  Sample questions with video response:");
          questionsWithVideo.slice(0, 2).forEach((question, index) => {
            console.log(
              `    ${index + 1}. "${question.title}" (${question.fullName})`,
            );
          });
        }

        if (questionsWithBlog.length > 0) {
          console.log("\n  Sample questions with blog response:");
          questionsWithBlog.slice(0, 2).forEach((question, index) => {
            console.log(
              `    ${index + 1}. "${question.title}" (${question.fullName})`,
            );
          });
        }
      } else {
        console.log("⚠ No answered questions available for filtering");
      }
    } catch (error) {
      console.log(
        "✗ Failed to filter questions:",
        error instanceof Error ? error.message : error,
      );
    }
    console.log();

    // Test 5: Fetch answered questions with specific fields
    console.log("5. Fetching answered questions with specific fields only:");
    try {
      const specificFields = await fetchAnsweredQuestions({
        locale,
        fields: ["title", "fullName", "questionContent"],
        pagination: { pageSize: 5 },
      });

      if (
        Array.isArray(specificFields.data) &&
        specificFields.data.length > 0
      ) {
        console.log(
          `✓ Fetched ${specificFields.data.length} questions with limited fields`,
        );
        console.log("\n  Questions:");
        specificFields.data.forEach((question, index) => {
          console.log(`    ${index + 1}. "${question.title}"`);
          console.log(`       By: ${question.fullName}`);
        });
      } else {
        console.log("⚠ No questions found");
      }
    } catch (error) {
      console.log(
        "✗ Failed to fetch questions with specific fields:",
        error instanceof Error ? error.message : error,
      );
    }
    console.log();

    console.log("=== All tests completed! ===");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  }
};

main();
