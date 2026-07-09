"use client";

import { useMemo, useState, useTransition } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import type { Locale } from "@/types/locale";
import { createQuestion } from "../api/question.api";
import type { QuestionFormData } from "../model/question.types";

const buildFormSchema = (locale: Locale) =>
  z.object({
    fullName: z
      .string()
      .min(
        2,
        locale === "vi"
          ? "Vui lòng nhập họ tên đầy đủ"
          : "Please enter your full name",
      ),
    email: z
      .string()
      .email(
        locale === "vi"
          ? "Địa chỉ email không hợp lệ"
          : "Invalid email address",
      ),
    title: z
      .string()
      .min(
        5,
        locale === "vi"
          ? "Tiêu đề cần ít nhất 5 ký tự"
          : "The title must contain at least 5 characters",
      ),
    questionContent: z
      .string()
      .min(
        10,
        locale === "vi"
          ? "Nội dung câu hỏi quá ngắn"
          : "The question is too short",
      ),
    phoneNumber: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
  });

type FormValues = z.infer<ReturnType<typeof buildFormSchema>>;

interface QuestionFormProps {
  locale: Locale;
}

export default function QuestionForm({ locale }: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const schema = useMemo(() => buildFormSchema(locale), [locale]);
  const captchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      title: "",
      questionContent: "",
      phoneNumber: "",
      address: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!captchaToken) {
      toast.error(
        locale === "vi"
          ? "Vui lòng xác nhận bạn không phải là người máy!"
          : "Please verify that you are not a robot!",
      );
      return;
    }

    startTransition(async () => {
      try {
        const payload: QuestionFormData = {
          ...values,
          locale,
        };

        await createQuestion(payload);
        toast.success(
          locale === "vi"
            ? "Gửi câu hỏi thành công! Chúng tôi sẽ phản hồi sớm."
            : "Question sent successfully! We will get back to you soon.",
        );
        reset();
        setCaptchaToken(null);
        setCaptchaKey((currentKey) => currentKey + 1);
      } catch (error) {
        toast.error(
          locale === "vi"
            ? "Gửi thất bại, vui lòng kiểm tra lại thông tin."
            : "Submission failed, please check your information.",
        );
        console.error("Submit Error:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fullName">
            {locale === "vi" ? "Họ tên" : "Full Name"}{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            {...register("fullName")}
            id="fullName"
            placeholder={locale === "vi" ? "Nguyễn Văn A" : "Full name"}
            disabled={isPending}
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName ? (
            <p className="input-error-message">{errors.fullName.message}</p>
          ) : null}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email">
              Email <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="example@gmail.com"
              disabled={isPending}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="input-error-message">{errors.email.message}</p>
            ) : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="phoneNumber">
              {locale === "vi" ? "Số điện thoại" : "Phone Number"}
            </FieldLabel>
            <Input
              {...register("phoneNumber")}
              id="phoneNumber"
              placeholder="0123456789"
              disabled={isPending}
            />
          </Field>
        </div>

        <div className="my-1 h-px bg-border/60" />

        <Field>
          <FieldLabel htmlFor="title">
            {locale === "vi" ? "Tựa đề" : "Title"}{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            {...register("title")}
            id="title"
            placeholder={
              locale === "vi"
                ? "Tóm tắt câu hỏi của bạn..."
                : "Summarize your question..."
            }
            disabled={isPending}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <p className="input-error-message">{errors.title.message}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="questionContent">
            {locale === "vi" ? "Nội dung câu hỏi" : "Question Content"}{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            {...register("questionContent")}
            id="questionContent"
            placeholder={
              locale === "vi"
                ? "Nhập chi tiết câu hỏi..."
                : "Enter your question details..."
            }
            className="min-h-28"
            disabled={isPending}
            aria-invalid={Boolean(errors.questionContent)}
          />
          {errors.questionContent ? (
            <p className="input-error-message">
              {errors.questionContent.message}
            </p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="address">
            {locale === "vi" ? "Địa chỉ" : "Address"}
          </FieldLabel>
          <Textarea
            {...register("address")}
            id="address"
            placeholder={
              locale === "vi"
                ? "Nhập địa chỉ của bạn"
                : "Enter your address"
            }
            className="min-h-20"
            disabled={isPending}
          />
        </Field>

        <div className="flex w-full justify-center overflow-hidden py-1">
          {captchaSiteKey ? (
            <ReCAPTCHA
              key={captchaKey}
              sitekey={captchaSiteKey}
              onChange={setCaptchaToken}
              onExpired={() => setCaptchaToken(null)}
            />
          ) : (
            <p className="text-center text-xs text-destructive">
              {locale === "vi"
                ? "Chưa cấu hình reCAPTCHA cho biểu mẫu."
                : "reCAPTCHA is not configured for this form."}
            </p>
          )}
        </div>

        <Field orientation="horizontal" className="pt-2">
          <div className="flex w-full flex-col gap-4 border-t border-border/60 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {locale === "vi"
                ? "Thông tin của bạn được bảo mật. Chúng tôi sẽ phản hồi sớm nhất có thể."
                : "Your information is kept private. We will respond as soon as possible."}
            </p>
            <Button
              type="submit"
              disabled={isPending || !captchaSiteKey}
              className="self-start text-xs font-medium uppercase tracking-wider sm:self-auto"
            >
              <Send data-icon="inline-start" />
              {isPending
                ? locale === "vi"
                  ? "Đang gửi..."
                  : "Sending..."
                : locale === "vi"
                  ? "Gửi câu hỏi"
                  : "Submit Question"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
