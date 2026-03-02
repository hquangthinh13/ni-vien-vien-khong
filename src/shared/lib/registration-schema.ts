import { z } from "zod";
import { ComponentTypeEnum } from "@/types/form-components";
import type { RegistrationFormTemplate } from "@/features/activity/model/activity.types";
import type { BasicInfoComponent } from "@/types/form-templates";
export const customKey = (id: number): `custom_${number}` =>
  `custom_${id}` as const;

/**
 * BasicInfo schema khớp 100% với BasicInfoComponent
 */
export const basicInfoSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập họ tên"),
    dob: z.string().min(1, "Vui lòng chọn ngày sinh"),
    gender: z.enum(["Male", "Female"], "Vui lòng chọn giới tính"),
    phoneNumber: z.string().min(8, "SĐT không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    haveZalo: z.boolean(),
    zaloName: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.haveZalo && !val.zaloName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zaloName"],
        message: "Vui lòng nhập tên Zalo",
      });
    }
  });

// đảm bảo type khớp BasicInfoComponent
type _CheckBasic =
  z.infer<typeof basicInfoSchema> extends BasicInfoComponent ? true : never;

export function buildRegistrationSchema(tpl: RegistrationFormTemplate) {
  const dynamicShape: Record<string, z.ZodTypeAny> = {};

  if (tpl.defaultIdentitySectionIncluded) {
    dynamicShape.IDNumber = z.string().optional();
    dynamicShape.issueDate = z.string().optional();
    dynamicShape.issueAt = z.string().optional();
    dynamicShape.otherIssueOrganisation = z.string().optional();
  }

  if (tpl.defaultRelationSectionIncluded) {
    dynamicShape.relationFullName = z.string().optional();
    dynamicShape.relationPhoneNumber = z.string().optional();
    dynamicShape.relationship = z.string().optional();
  }

  if (tpl.defaultRoutineSectionIncluded) {
    dynamicShape.dietaryRequirements = z.string().optional();
    dynamicShape.medicalConditions = z.boolean().optional();
  }

  for (const component of tpl.customizedComponents ?? []) {
    const key = customKey(component.id);

    switch (component.type) {
      case ComponentTypeEnum.Bool:
        dynamicShape[key] = z.boolean().optional();
        break;

      case ComponentTypeEnum.Number:
        dynamicShape[key] = z.coerce.number().optional();
        break;

      case ComponentTypeEnum.Date:
      case ComponentTypeEnum.DateTime:
      case ComponentTypeEnum.ShortText:
      case ComponentTypeEnum.LongText:
        dynamicShape[key] = z.string().optional();
        break;

      default:
        dynamicShape[key] = z.unknown().optional();
        break;
    }
  }

  return basicInfoSchema.merge(z.object(dynamicShape));
}
