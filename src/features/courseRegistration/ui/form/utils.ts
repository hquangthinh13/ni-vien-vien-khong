import { isValid, parseISO } from "date-fns";
import type { FieldErrors } from "react-hook-form";
import type {
  Activity,
  RegistrationFormTemplate,
} from "@/features/activity/model/activity.types";
import type { FormSection } from "@/types/form-components";
import type {
  DynamicFields,
  DynamicFieldValue,
  RegistrationFormValues,
} from "./types";

type ProcessedDynamicRecord = Record<
  string,
  DynamicFieldValue | string[] | boolean | number
>;

export const getSectionKey = (section: string): string => {
  switch (section) {
    case "Thông tin CCCD (Identity Detail)":
      return "identityDetail";
    case "Thông tin tu học (Monatic Detail)":
      return "monasticDetail";
    case "Thông tin thân nhân (Relation Detail)":
      return "relationDetail";
    case "Thông tin sinh hoạt (Routine Detail)":
      return "routineDetail";
    case "Thông tin khác (Others)":
      return "otherDetail";
    default:
      return "otherDetail";
  }
};

export const getFieldError = (
  errors: FieldErrors<RegistrationFormValues>,
  name: string,
) => {
  const parts = name.split(".");
  let current: unknown = errors;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current as { message?: string } | undefined;
};

export const validateActivityAge = (
  activity: Activity | null,
  dobIso: string,
): string | null => {
  if (!activity?.ageRestricted) return null;

  const dob = parseISO(dobIso);
  if (!isValid(dob)) {
    return "Vui lòng chọn ngày sinh hợp lệ";
  }

  const currentYear = new Date().getFullYear();
  const birthYear = dob.getFullYear();
  const age = currentYear - birthYear;

  if (activity.minAge != null && age < activity.minAge) {
    return `Rất tiếc, bạn chưa đủ tuổi tham gia (Yêu cầu từ năm sinh ${currentYear - activity.minAge} trở về trước)`;
  }

  if (activity.maxAge != null && age > activity.maxAge) {
    return `Rất tiếc, bạn đã vượt quá độ tuổi quy định (Yêu cầu từ năm sinh ${currentYear - activity.maxAge} trở về sau)`;
  }

  return null;
};

export const processDynamicSection = (
  sectionData: DynamicFields,
  sectionEnum: FormSection,
  template: RegistrationFormTemplate | null,
  dynamicOthers: Record<string, string>,
): DynamicFields => {
  const processed: ProcessedDynamicRecord = { ...sectionData };
  const sectionComps =
    template?.customizedComponents?.filter((c) => c.section === sectionEnum) ||
    [];

  sectionComps.forEach((comp) => {
    const rhfKey = comp.attributeName || `field_${comp.id}`;
    const payloadKey = comp.attributeName || comp.label;

    let val = processed[rhfKey];
    const otherText = dynamicOthers[rhfKey];

    if (val === "__OTHER__") {
      val = otherText;
    } else if (Array.isArray(val)) {
      val = val.map((v) => (v === "__OTHER__" ? otherText : v));
    }

    if (val !== undefined) {
      processed[payloadKey] = val;
    }

    if (rhfKey !== payloadKey && processed[rhfKey] !== undefined) {
      delete processed[rhfKey];
    }
  });

  return processed as DynamicFields;
};

export const mapCommitments = (
  commitmentMessages: Array<{ id: number; label: string }> | undefined,
  commitments: Record<string, boolean>,
) => {
  const mappedCommitments: Record<string, boolean> = {};
  if (!commitmentMessages) return mappedCommitments;

  commitmentMessages.forEach((msg) => {
    mappedCommitments[msg.label] = !!commitments[msg.id];
  });

  return mappedCommitments;
};
