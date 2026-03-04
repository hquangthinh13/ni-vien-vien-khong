"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm, Controller, useWatch, Path } from "react-hook-form";
import { toast } from "sonner";

// API & Types
import { fetchActivityByDocumentIdWithRegistrationForm } from "@/features/activity/api/activity.api";
import { createActivityRegistration } from "@/features/courseRegistration/api/activityRegistration.api";
import { ActivityRegistrationFormDataBuilder } from "@/features/courseRegistration/api/activityRegistration.formData-builder";
import {
  Activity,
  RegistrationFormTemplate,
  CustomizedComponent,
  MultipleChoiceOption,
} from "@/features/activity/model/activity.types";
import {
  BasicInfoComponent,
  IdentityComponent,
  MonasticComponent,
  RelationComponent,
  RoutineComponent,
} from "@/types/form-templates";
import { ComponentTypeEnum, FormSectionEnum } from "@/types/form-components";

// UI Components (Shadcn)
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import type { Locale } from "@/types/locale";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { format, parseISO, isValid } from "date-fns";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import { cn } from "@/shared/lib/utils";
// --- Types Fix ---

/**
 * Mở rộng CustomizedComponent để bao gồm multipleChoiceDetails bị thiếu trong activity.types.ts
 */
interface CustomizedComponentWithDetails extends CustomizedComponent {
  multipleChoiceDetails?: MultipleChoiceOption;
}
interface DynamicFields {
  [key: string]: string | number | boolean | undefined;
}

interface RegistrationFormValues {
  firstTimeRegistered: boolean;
  basic: BasicInfoComponent;
  // Đổi tên để khớp với getSectionKey và API payload
  identityDetail: Partial<IdentityComponent> & DynamicFields;
  monasticDetail: Partial<MonasticComponent> & DynamicFields;
  relationDetail: Partial<RelationComponent> & DynamicFields;
  routineDetail: Partial<RoutineComponent> & DynamicFields;
  otherDetail: DynamicFields;
}
// Map tên Section từ Strapi sang key của RegistrationFormValues
const sectionToFormKey = {
  [FormSectionEnum.Identity]: "identity",
  [FormSectionEnum.Monastic]: "monastic",
  [FormSectionEnum.Relation]: "relation",
  [FormSectionEnum.Routine]: "routine",
  [FormSectionEnum.Others]: "others",
} as const;

type SectionFormKey = (typeof sectionToFormKey)[keyof typeof sectionToFormKey];

interface Props {
  documentId: string;
  locale: Locale;
}

export default function ActivityRegistrationForm({
  documentId,
  locale,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [template, setTemplate] = useState<RegistrationFormTemplate | null>(
    null,
  );
  const [activity, setActivity] = useState<Activity | null>(null);
  // Lọc các component động theo tên section
  const getFieldsBySection = (sectionName: string) => {
    return (
      template?.customizedComponents.filter(
        (comp) => comp.section === sectionName,
      ) || []
    );
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      firstTimeRegistered: false,
      basic: {
        fullName: "",
        dob: "",
        gender: "Male",
        phoneNumber: "",
        email: "",
        address: "",
        haveZalo: false,
        zaloName: "",
      },
      identityDetail: {
        IDNumber: "",
        issueAt: "Bộ Công An",
        issueDate: "",
      },
      monasticDetail: {},
      relationDetail: {},
      routineDetail: {
        medicalConditions: false,
        foodAllergies: "",
        dietaryRequirement: "Ăn chay",
      },
      otherDetail: {},
    },
  });
  const watchHaveZalo = useWatch({
    control,
    name: "basic.haveZalo",
  });

  useEffect(() => {
    async function loadTemplate() {
      try {
        const res = await fetchActivityByDocumentIdWithRegistrationForm({
          documentId,
        });
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data && data.registrationForm) {
          setTemplate(data.registrationForm);
          setActivity(data);
        }
        console.log(
          "Loaded registration form template:",
          data?.registrationForm,
        );
      } catch (error) {
        toast.error("Không thể tải thông tin đăng ký");
      }
    }
    loadTemplate();
  }, [documentId]);

  const onSubmit = (values: RegistrationFormValues) => {
    console.log("Form Values on Submit:", values);
    startTransition(async () => {
      try {
        const builder = new ActivityRegistrationFormDataBuilder();

        builder.withFormData({
          registreeData: values.basic,
          firstTimeRegistered: values.firstTimeRegistered,
          registeredActivity: documentId,
        });

        // Dữ liệu giờ đã tự động gộp lại nhờ chung tiền tố name trong register
        builder.withRegistrationPayload({
          identityDetail: values.identityDetail as IdentityComponent,
          monasticDetail: values.monasticDetail as MonasticComponent,
          relationDetail: values.relationDetail as RelationComponent,
          routineDetail: values.routineDetail as RoutineComponent,
          otherDetail: values.otherDetail,
        });

        const finalPayload = builder.build();
        console.log("Final Payload:", finalPayload);

        await createActivityRegistration(finalPayload);
        toast.success("Đăng ký thành công!");
      } catch (error) {
        toast.error("Đã xảy ra lỗi");
      }
    });
  };

  /**
   * Render Input động dựa trên Type
   */ // Hàm helper để map từ FormSectionEnum sang key của RegistrationPayload
  const getSectionKey = (section: string): string => {
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
        return "otherDetail"; // Nếu request của bạn ra "otherDetail" thì giữ nguyên
      default:
        return "otherDetail";
    }
  };
  const renderSectionFields = (sectionName: FormSectionEnum) => {
    const fields =
      template?.customizedComponents.filter((c) => c.section === sectionName) ||
      [];
    const formKey = getSectionKey(sectionName) || "others";

    return fields.map((comp) => {
      // Tạo path an toàn: ví dụ "identity.Tôn giáo"
      const fieldPath =
        `${formKey}.${comp.label}` as Path<RegistrationFormValues>;
      return (
        <Field key={comp.id}>
          <FieldLabel>{comp.label}</FieldLabel>
          {renderDynamicField(
            comp as CustomizedComponentWithDetails,
            fieldPath,
          )}
        </Field>
      );
    });
  };
  const renderDynamicField = (
    comp: CustomizedComponentWithDetails,
    name: Path<RegistrationFormValues>,
  ) => {
    switch (comp.type) {
      case ComponentTypeEnum.LongText:
        return <Textarea {...register(name)} placeholder={comp.label} />;

      case ComponentTypeEnum.MultipleChoice:
        return (
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={typeof field.value === "string" ? field.value : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn một tùy chọn" />
                </SelectTrigger>
                <SelectContent>
                  {comp.multipleChoiceDetails?.options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.label}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case ComponentTypeEnum.Date:
        return (
          <Controller
            control={control}
            name={name}
            render={({ field }) => {
              const dateValue =
                typeof field.value === "string"
                  ? parseISO(field.value)
                  : undefined;
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal hover:cursor-pointer",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateValue && isValid(dateValue) ? (
                        format(dateValue, "dd/MM/yyyy")
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        );

      default:
        return <Input {...register(name)} placeholder={comp.label} />;
    }
  };

  if (!template)
    return <div className="text-center p-10">Đang tải biểu mẫu...</div>;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <section className="flex flex-col gap-4">
            <h1 className="text-xl font-bold uppercase text-primary mt-4">
              {activity?.activityName}
            </h1>
            <div className="w-full p-4 bg-card rounded-md border">
              {template.registrationDescription && (
                <RichTextRenderer content={template.registrationDescription} />
              )}
            </div>
          </section>
          {/* Section: Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-full font-bold border-l-4 border-primary pl-2 uppercase">
              Thông tin cá nhân
            </h3>
            <Field className="col-span-full">
              <FieldLabel>
                Họ và tên <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("basic.fullName", { required: true })} />
            </Field>
            <Field>
              <FieldLabel>
                Giới tính <span className="text-destructive">*</span>
              </FieldLabel>
              <Select {...register("basic.gender", { required: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:cursor-pointer" value="male">
                    Nam
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="female">
                    Nữ
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="other">
                    Khác
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>{" "}
            <Field className="">
              <FieldLabel htmlFor="dob">
                Ngày sinh <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="basic.dob"
                render={({ field }) => {
                  const dateValue = field.value
                    ? parseISO(field.value)
                    : undefined;

                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="dob"
                          className={cn(
                            "w-full justify-start hover:cursor-pointer",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="" />
                          {dateValue && isValid(dateValue) ? (
                            format(dateValue, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateValue}
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString() : "");
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              {errors.basic?.dob && (
                <p className="text-xs text-destructive">
                  Vui lòng chọn ngày sinh
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>
                Số điện thoại <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("basic.phoneNumber", { required: true })} />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" {...register("basic.email")} />
            </Field>
            <Field className="col-span-full">
              <FieldLabel>Địa chỉ</FieldLabel>
              <Textarea {...register("basic.address")} />
            </Field>
            <div className="col-span-full flex items-center space-x-2">
              <Controller
                control={control}
                name="basic.haveZalo"
                render={({ field }) => (
                  <Checkbox
                    id="haveZalo"
                    className="translate-y-px"
                    checked={!!field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) setValue("basic.zaloName", "");
                    }}
                  />
                )}
              />
              <FieldLabel
                className="cursor-pointer select-none"
                htmlFor="haveZalo"
              >
                Tôi có sử dụng Zalo
              </FieldLabel>
            </div>
            {watchHaveZalo && (
              <Field className="col-span-full md:col-span-1 animate-in fade-in duration-300">
                <FieldLabel>
                  Tên Zalo <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register("basic.zaloName", { required: watchHaveZalo })}
                  placeholder="Nhập tên Zalo của bạn"
                />
                {errors.basic?.zaloName && (
                  <span className="text-xs text-destructive">
                    Vui lòng nhập tên Zalo
                  </span>
                )}
              </Field>
            )}
          </div>

          {/* Section: Identity (Nếu được bật trong Strapi) */}
          {template.defaultIdentitySectionIncluded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <h3 className="col-span-full font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin Căn cước
              </h3>
              <Field className="col-span-full">
                <FieldLabel>Số CCCD</FieldLabel>
                <Input {...register("identityDetail.IDNumber")} />
              </Field>
              {/* <Field>
                <FieldLabel>Ngày đăng ký</FieldLabel>
                <Input {...register("identity.issueDate")} />
              </Field> */}
              <Field className="">
                <FieldLabel htmlFor="issueDate">
                  Ngày đăng ký <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="identityDetail.issueDate"
                  render={({ field }) => {
                    const dateValue = field.value
                      ? parseISO(field.value)
                      : undefined;

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="issueDate"
                            className={cn(
                              "w-full justify-start hover:cursor-pointer",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="" />
                            {dateValue && isValid(dateValue) ? (
                              format(dateValue, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày đăng ký</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : "");
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
                {errors.basic?.dob && (
                  <p className="text-xs text-destructive">
                    Vui lòng chọn ngày sinh
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel>Khu vực đăng ký</FieldLabel>
                <Input {...register("identityDetail.issueAt")} />
              </Field>
              {renderSectionFields(FormSectionEnum.Identity)}
            </div>
          )}

          {template.defaultMonasticSectionIncluded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <h3 className="col-span-full font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin tu sĩ
              </h3>
              <Field className="col-span-full">
                <FieldLabel>Pháp danh</FieldLabel>
                <Input {...register("monasticDetail.dharmaName")} />
              </Field>
              <Field>
                <FieldLabel>Chức vụ</FieldLabel>
                <Controller
                  control={control}
                  name="monasticDetail.monasticRank"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      {" "}
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chức vụ tu sĩ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tỳ Kheo Ni">Tỳ Kheo Ni</SelectItem>
                        <SelectItem value="Sadini">Sadini</SelectItem>
                        <SelectItem value="Tu nữ">Tu nữ</SelectItem>
                        <SelectItem value="Cư sĩ nam">Cư sĩ nam</SelectItem>
                        <SelectItem value="Cư sĩ nữ">Cư sĩ nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Truyền thống</FieldLabel>
                <Controller
                  control={control}
                  name="monasticDetail.monasticTradition"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn truyền thống tu sĩ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam Tông">Nam Tông</SelectItem>
                        <SelectItem value="Bắc Tông">Bắc Tông</SelectItem>
                        <SelectItem value="Khất Sĩ">Khất Sĩ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field className="">
                <FieldLabel>Thiền viện hiện tại</FieldLabel>
                <Input {...register("monasticDetail.currentMonastery")} />
              </Field>{" "}
              <Field className="">
                <FieldLabel>Số năm tu tập</FieldLabel>
                <Input
                  {...register("monasticDetail.yearsOfPractice")}
                  type="number"
                />
              </Field>
              {renderSectionFields(FormSectionEnum.Monastic)}
            </div>
          )}
          {template.defaultRelationSectionIncluded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <h3 className="col-span-full font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin liên hệ
              </h3>
              <Field className="col-span-full">
                <FieldLabel>Họ tên người thân</FieldLabel>
                <Input {...register("relationDetail.fullName")} />
              </Field>
              <Field>
                <FieldLabel>Số điện thoại người thân</FieldLabel>
                <Input {...register("relationDetail.phoneNumber")} />
              </Field>
              <Field>
                <FieldLabel>Mối quan hệ</FieldLabel>
                <Input {...register("relationDetail.relationship")} />
              </Field>
              {renderSectionFields(FormSectionEnum.Relation)}
            </div>
          )}
          {template.defaultRoutineSectionIncluded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <h3 className="col-span-full font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin lịch trình
              </h3>
              <Field className="col-span-full">
                <FieldLabel>Yêu cầu về chế độ ăn uống</FieldLabel>
                <Controller
                  control={control}
                  name="monasticDetail.dietaryRequirement"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={(field.value as string) || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chế độ ăn uống" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ăn chay">Ăn chay</SelectItem>
                        <SelectItem value="Ăn thường">Ăn thường</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field className="col-span-full">
                <FieldLabel>Yêu cầu về dị ứng thực phẩm</FieldLabel>
                <Textarea {...register("routineDetail.foodAllergies")} />
              </Field>
              <div className="col-span-full flex items-center space-x-2">
                <Controller
                  control={control}
                  name="routineDetail.medicalConditions"
                  render={({ field }) => (
                    <Checkbox
                      id="medicalConditions"
                      className="shrink-0"
                      checked={!!field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                  )}
                />
                <FieldLabel
                  htmlFor="medicalConditions"
                  className="cursor-pointer select-none"
                >
                  Tôi có tình trạng sức khỏe đặc biệt cần lưu ý
                </FieldLabel>
              </div>
              {renderSectionFields(FormSectionEnum.Routine)}
            </div>
          )}
          {/* Section: Dynamic Components */}
          {template.customizedComponents.length > 0 && (
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin bổ sung
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSectionFields(FormSectionEnum.Others)}
              </div>
            </div>
          )}

          {/* Checkbox: Lần đầu đăng ký */}
          <div className="col-span-full flex items-center space-x-2 py-4 border-t border-dashed mt-4">
            <Controller
              control={control}
              name="firstTimeRegistered"
              render={({ field }) => (
                <Checkbox
                  id="firstTimeRegistered"
                  className="shrink-0"
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              )}
            />
            <FieldLabel
              htmlFor="firstTimeRegistered"
              className="cursor-pointer select-none"
            >
              Đây là lần đầu tiên tôi tham gia khóa tu tại chùa
            </FieldLabel>
          </div>
          <div className="w-full justify-end flex">
            <Button
              size="lg"
              type="submit"
              className="hover:cursor-pointer uppercase tracking-wider"
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : "Xác nhận đăng ký"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
