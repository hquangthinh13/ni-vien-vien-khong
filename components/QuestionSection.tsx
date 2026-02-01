import React from "react";
import { QuestionProps } from "./Question";
import Question from "./Question";
const mockQuestions: QuestionProps[] = [
  {
    id: "q1",
    name: "Nguyễn Văn An",
    question:
      "Cho con hỏi lịch khóa tu gieo duyên tại tu viện mình vào tháng tới như thế nào ạ?",
    answer:
      "Chào đạo hữu, khóa tu gieo duyên sẽ diễn ra vào ngày 15 âm lịch hàng tháng. Bạn có thể đăng ký trực tiếp tại văn phòng hoặc qua trang web của tu viện.",
    createdAt: "2026-01-15T08:30:00Z",
    answerDate: "2026-01-16T10:00:00Z",
  },
  {
    id: "q2",
    name: "Trần Thị Minh Tâm",
    question:
      "Làm sao để giữ tâm bình an khi đối mặt với những áp lực căng thẳng trong công việc hằng ngày?",
    answer:
      "A Di Đà Phật, để giữ tâm bình an, con nên dành ít nhất 15 phút mỗi ngày để thực hành thiền quán hơi thở và học cách buông xả những vọng tưởng không cần thiết.",
    createdAt: "2026-01-20T14:20:00Z",
    answerDate: "2026-01-21T09:15:00Z",
  },
  {
    id: "q3",
    name: "Lê Hải Nam",
    question:
      "Tu viện có tiếp nhận Phật tử ở lại công quả trong dịp Tết Nguyên Đán không ạ?",
    answer:
      "Tu viện luôn hoan hỷ đón nhận các công quả viên. Con vui lòng liên hệ Ban Tri Khách để được hướng dẫn cụ thể về nơi lưu trú và công việc nhé.",
    createdAt: "2026-01-25T19:00:00Z",
    answerDate: "2026-01-26T08:00:00Z",
  },
];
export default async function QuestionSection() {
  return (
    <div>
      {mockQuestions.map((item) => (
        <Question key={item.id} {...item} />
      ))}
    </div>
  );
}
