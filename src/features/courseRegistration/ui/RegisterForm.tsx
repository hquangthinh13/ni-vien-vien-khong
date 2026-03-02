"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/shared/ui/field";

import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";

import type { Activity } from "@/features/activity/model/activity.types";
import type {
  ActivityRegistrationFormData,
  RegistrationPayload,
} from "@/features/courseRegistration/model/activityRegistration.types";
import type { BasicInfoComponent } from "@/types/form-templates";

import { ActivityRegistrationFormDataBuilder } from "@/features/courseRegistration/api/activityRegistration.formData-builder";
import { createActivityRegistration } from "@/features/courseRegistration/api/activityRegistration.api";

import {
  buildRegistrationSchema,
  customKey,
} from "@/shared/lib/registration-schema";

type RegisterFormProps = {
  activity: Activity;
  onSuccess?: () => void;
};

export default function RegisterForm({
  activity,
  onSuccess,
}: RegisterFormProps) {
  const template = activity.registrationForm;
  const schema = React.useMemo(
    () => buildRegistrationSchema(template),
    [template],
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      haveZalo: false,
      medicalConditions: false,
    } as FormValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues): Promise<void> => {
    const registreeData: BasicInfoComponent = {
      fullName: values.fullName,
      dob: values.dob,
      gender: values.gender,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
      haveZalo: values.haveZalo,
      zaloName: values.zaloName,
    };

    const registrationPayload: RegistrationPayload = {};

    if (template.defaultIdentitySectionIncluded) {
      registrationPayload.identityDetail = {
        IDNumber: values.IDNumber,
        issueDate: values.issueDate,
        issueAt: values.issueAt,
        otherIssueOrganisation: values.otherIssueOrganisation,
      };
    }

    if (template.defaultRelationSectionIncluded) {
      registrationPayload.relationDetail = {
        relationFullName: values.relationFullName,
        relationPhoneNumber: values.relationPhoneNumber,
        relationship: values.relationship,
      };
    }

    if (template.defaultRoutineSectionIncluded) {
      registrationPayload.routineDetail = {
        dietaryRequirements: values.dietaryRequirements,
        medicalConditions: values.medicalConditions,
      };
    }

    const otherDetail: Record<string, unknown> = {};
    for (const component of template.customizedComponents ?? []) {
      const key = customKey(component.id);
      otherDetail[key] = values[key];
    }

    if (Object.keys(otherDetail).length > 0) {
      registrationPayload.otherDetail = otherDetail;
    }

    const formData: ActivityRegistrationFormData =
      new ActivityRegistrationFormDataBuilder()
        .withFormData({
          registreeData,
          firstTimeRegistered: true,
          registeredActivity: activity.documentId ?? String(activity.id),
        })
        .withRegistrationPayload(registrationPayload)
        .build();

    await createActivityRegistration(formData);

    form.reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldSet>
        <FieldLegend>Thông tin cơ bản</FieldLegend>

        <FieldGroup className="grid md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Họ và tên</FieldLabel>
            <FieldContent>
              <Input {...register("fullName")} />
            </FieldContent>
            <FieldError>{errors.fullName?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input {...register("email")} />
            </FieldContent>
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Số điện thoại</FieldLabel>
            <FieldContent>
              <Input {...register("phoneNumber")} />
            </FieldContent>
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Địa chỉ</FieldLabel>
            <FieldContent>
              <Input {...register("address")} />
            </FieldContent>
            <FieldError>{errors.address?.message}</FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
      </Button>
    </form>
  );
}
