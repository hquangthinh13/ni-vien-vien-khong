"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner"; // Hoặc thư viện thông báo bạn dùng

import { Card, CardContent } from "@/shared/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";

import type { Locale } from "@/types/locale";
import { createQuestion } from "../api/question.api";
import { QuestionFormData } from "../model/question.types";

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

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const payload: QuestionFormData = {
          ...values,
          locale,
        };

        await createQuestion(payload);

        toast.success("Gửi câu hỏi thành công! Chúng tôi sẽ phản hồi sớm.");
        reset();
      } catch (error) {
        toast.error("Gửi thất bại, vui lòng kiểm tra lại thông tin.");
        console.error("Submit Error:", error);
      }
    });
  };

  return (

    // <Card className="flex flex-1 p-0 shadow-md">
    //   <CardContent className="p-6">
    <form className="" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fullName">
            Họ và tên <span className="text-destructive">*</span>
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
            <FieldLabel htmlFor="phoneNumber">Số điện thoại</FieldLabel>
            <Input
              {...register("phoneNumber")}
              id="phoneNumber"
              placeholder="0123456789..."
              disabled={isPending}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="title">
            Tựa đề <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            {...register("title")}
            id="title"
            placeholder="Tiêu đề câu hỏi của bạn"
            disabled={isPending}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1">
              {errors.title.message}
            </p>
          )}
        </Field>

        {/* Câu hỏi */}
        <Field>
          <FieldLabel htmlFor="questionContent">
            Nội dung câu hỏi <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            {...register("questionContent")}
            id="questionContent"
            placeholder="Nhập chi tiết câu hỏi..."
            className="min-h-[80px]"
            disabled={isPending}
          />

          {errors.questionContent && (
            <p className="text-xs text-destructive mt-1">
              {errors.questionContent.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
          <Textarea
            {...register("address")}
            id="address"
            placeholder="Nhập địa chỉ của bạn"
            disabled={isPending}
          />
        </Field>

        <Field orientation="horizontal" className="pt-4">
          <div className="flex flex-1 justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Đang gửi..." : "Gửi câu hỏi"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
    //   </CardContent>
    // </Card>

  );
}
