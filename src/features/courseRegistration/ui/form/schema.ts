import * as z from "zod";

const basicSchema = z.object({
  fullName: z.string().min(1, "Họ tên là thông tin bắt buộc"),
  dob: z.string().min(1, "Ngày sinh là thông tin bắt buộc"),
  gender: z.enum(["Male", "Female"]).optional(),
  phoneNumber: z.string().min(1, "Số điện thoại là thông tin bắt buộc"),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Email không hợp lệ",
    ),
  address: z.string().optional(),
  haveZalo: z.boolean(),
  zaloName: z.string().optional(),
});

const dynamicRecordSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
);

export const registrationFormSchema = z.object({
  firstTimeRegistered: z.boolean(),
  basic: basicSchema,
  identityDetail: dynamicRecordSchema,
  monasticDetail: dynamicRecordSchema,
  relationDetail: dynamicRecordSchema,
  routineDetail: dynamicRecordSchema,
  otherDetail: dynamicRecordSchema,
  commitments: z.record(z.string(), z.boolean()),
  dynamicOthers: z.record(z.string(), z.string()),
});
