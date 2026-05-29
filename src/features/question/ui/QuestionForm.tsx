"use client";

import React, { useTransition, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";

import type { Locale } from "@/types/locale";
import { createQuestion } from "../api/question.api";
import { QuestionFormData } from "../model/question.types";
import { Send } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên đầy đủ"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  title: z.string().min(5, "Tiêu đề cần ít nhất 5 ký tự"),
  questionContent: z.string().min(10, "Nội dung câu hỏi quá ngắn"),
  phoneNumber: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface QuestionFormProps {
  locale: Locale;
}

export default function QuestionForm({ locale }: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      title: "",
      questionContent: "",
      phoneNumber: "",
      address: "",
    },
  });
  const onPreSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = recaptchaRef.current?.getValue();

    if (!token) {
      const message =
        locale === "vi"
          ? "Vui lòng xác nhận bạn không phải là người máy!"
          : "Please verify that you are not a robot!";
      toast.error(message);
      return;
    }

    handleSubmit(onSubmit)(e);
  };
  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const payload: QuestionFormData = {
          ...values,
          locale,
        };

        await createQuestion(payload);
        const message =
          locale === "vi"
            ? "Gửi câu hỏi thành công! Chúng tôi sẽ phản hồi sớm."
            : "Question sent successfully! We will get back to you soon.";
        toast.success(message);
        reset();
      } catch (error) {
        const message =
          locale === "vi"
            ? "Gửi thất bại, vui lòng kiểm tra lại thông tin."
            : "Submission failed, please check your information.";
        toast.error(message);
        console.error("Submit Error:", error);
      }
    });
  };

  return (
    <form onSubmit={onPreSubmit} noValidate>
      <FieldGroup>
        <Field className="mt-4">
          <FieldLabel htmlFor="fullName">
            {locale === "vi" ? "Họ tên" : "Full Name"}{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            {...register("fullName")}
            id="fullName"
            placeholder="Nguyễn Văn A"
            disabled={isPending}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive mt-1">
              {errors.fullName.message}
            </p>
          )}
        </Field>
        <div className="flex justify-between gap-4">
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
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="phoneNumber">
              {locale === "vi" ? "Số điện thoại" : "Phone Number"}
            </FieldLabel>
            <Input
              {...register("phoneNumber")}
              id="phoneNumber"
              placeholder="0123456789..."
              disabled={isPending}
            />
          </Field>
        </div>

        <div className="h-px bg-border/40 my-1" />

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
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1">
              {errors.title.message}
            </p>
          )}
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
            className="min-h-20"
            disabled={isPending}
          />

          {errors.questionContent && (
            <p className="text-xs text-destructive mt-1">
              {errors.questionContent.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="address">
            {locale === "vi" ? "Địa chỉ" : "Address"}
          </FieldLabel>
          <Textarea
            {...register("address")}
            id="address"
            placeholder={
              locale === "vi" ? "Nhập địa chỉ của bạn" : "Enter your address"
            }
            disabled={isPending}
          />
        </Field>
        {/* <div className="flex justify-center py-2 w-full">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={() => {}}
          />
        </div> */}
        <Field orientation="horizontal" className="pt-4">
          <div className="w-full py-5 border-t border-border/40 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "vi"
                ? "Chúng tôi sẽ phản hồi sớm nhất có thể."
                : "We will respond as soon as possible."}
            </p>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 uppercase tracking-wider text-xs font-medium cursor-pointer"
            >
              <Send className="size-3.5" />
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
