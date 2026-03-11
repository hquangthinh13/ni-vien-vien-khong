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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Checkbox } from "@/shared/ui/checkbox";
import type { Locale } from "@/types/locale";
import { Calendar } from "@/shared/ui/calendar";
import { Switch } from "@/shared/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { format, parseISO, isValid, differenceInYears } from "date-fns";
import { Calendar as CalendarIcon, Clock2Icon, Send } from "lucide-react";
import ActivityRegistrationContentRenderer from "./ActivityRegistrationContentRenderer";
import { cn, isRichTextEmpty } from "@/shared/lib/utils";

interface CustomizedComponentWithDetails extends CustomizedComponent {
  multipleChoiceDetails?: MultipleChoiceOption;
}
type DynamicFieldValue = string | number | boolean | string[] | undefined;
interface DynamicFields {
  [key: string]: DynamicFieldValue;
}

interface RegistrationFormValues {
  firstTimeRegistered: boolean;
  basic: BasicInfoComponent;
  identityDetail: Partial<IdentityComponent> & DynamicFields;
  monasticDetail: Partial<MonasticComponent> & DynamicFields;
  relationDetail: Partial<RelationComponent> & DynamicFields;
  routineDetail: Partial<RoutineComponent> & DynamicFields;
  otherDetail: DynamicFields;
  commitments: Record<string, boolean>;
  dynamicOthers: Record<string, string>;
}

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
      commitments: {},
      dynamicOthers: {},
    },
  });
  const watchHaveZalo = useWatch({
    control,
    name: "basic.haveZalo",
  });
  const watchTradition = useWatch({
    control,
    name: "monasticDetail.monasticTradition",
  });
  const watchIdIssueAt = useWatch({
    control,
    name: "identityDetail.issueAt",
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
        console.log("Loaded activity data:", data);
      } catch (error) {
        toast.error("Không thể tải thông tin đăng ký");
      }
    }
    loadTemplate();
  }, [documentId]);

  const onSubmit = (values: RegistrationFormValues) => {
    if (activity?.ageRestricted) {
      const dob = parseISO(values.basic.dob);

      if (!isValid(dob)) {
        toast.error("Vui lòng chọn ngày sinh hợp lệ");
        return;
      }

      const age = differenceInYears(new Date(), dob);

      if (activity.minAge != null && age < activity.minAge) {
        toast.error(
          `Rất tiếc, bạn chưa đủ tuổi tham gia (Yêu cầu tối thiểu ${activity.minAge} tuổi)`,
        );
        return;
      }

      if (activity.maxAge != null && age > activity.maxAge) {
        toast.error(
          `Rất tiếc, bạn đã vượt quá độ tuổi quy định (Yêu cầu tối đa ${activity.maxAge} tuổi)`,
        );
        return;
      }
    }
    const processDynamicSection = <T extends DynamicFields>(
      sectionData: T,
    ): T => {
      const processed = { ...sectionData };

      Object.keys(values.dynamicOthers).forEach((label) => {
        const otherText = values.dynamicOthers[label];
        const originalVal = processed[label];

        if (originalVal === "__OTHER__") {
          (processed as DynamicFields)[label] = otherText;
        } else if (Array.isArray(originalVal)) {
          (processed as DynamicFields)[label] = originalVal.map((v) =>
            v === "__OTHER__" ? otherText : v,
          );
        }
      });
      return processed;
    };

    const mappedCommitments: Record<string, boolean> = {};
    if (template?.commitmentMessages) {
      template.commitmentMessages.forEach((msg) => {
        const isChecked = values.commitments[msg.id];
        mappedCommitments[msg.label] = !!isChecked;
      });
    }

    const finalIdentityDetail = processDynamicSection(
      values.identityDetail as DynamicFields,
    );
    const finalMonasticDetail = processDynamicSection(
      values.monasticDetail as DynamicFields,
    );
    const finalRelationDetail = processDynamicSection(
      values.relationDetail as DynamicFields,
    );
    const finalRoutineDetail = processDynamicSection(
      values.routineDetail as DynamicFields,
    );
    const finalOtherDetail = processDynamicSection(values.otherDetail);

    startTransition(async () => {
      try {
        const builder = new ActivityRegistrationFormDataBuilder();

        builder.withFormData({
          registreeData: values.basic,
          firstTimeRegistered: values.firstTimeRegistered,
          registeredActivity: documentId,
        });

        builder.withRegistrationPayload({
          identityDetail: finalIdentityDetail as IdentityComponent,
          monasticDetail: finalMonasticDetail as MonasticComponent,
          relationDetail: finalRelationDetail as RelationComponent,
          routineDetail: finalRoutineDetail as RoutineComponent,
          otherDetail: {
            ...finalOtherDetail,
            ...mappedCommitments,
          },
        });

        const finalPayload = builder.build();
        console.log("Final Payload to API:", finalPayload);

        await createActivityRegistration(finalPayload);
        toast.success("Đăng ký thành công!");
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi gửi form");
      }
    });
  };

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
        return "otherDetail";
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
      const fieldPath =
        `${formKey}.${comp.label}` as Path<RegistrationFormValues>;

      return renderDynamicField(
        comp as CustomizedComponentWithDetails,
        fieldPath,
      );
    });
  };

  const renderDynamicField = (
    comp: CustomizedComponentWithDetails,
    name: Path<RegistrationFormValues>,
  ) => {
    switch (comp.type) {
      case ComponentTypeEnum.Number:
        return (
          <Field key={comp.id} className="">
            <FieldLabel htmlFor={name}>{comp.label}</FieldLabel>
            <Input
              type="number"
              {...register(name, {})}
              placeholder={comp.label}
            />
          </Field>
        );

      case ComponentTypeEnum.Bool:
        return (
          <Field
            key={comp.id}
            className="col-span-full flex flex-row items-center"
          >
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Switch
                  className="shrink-0 hover:cursor-pointer"
                  id={name}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldLabel htmlFor={name} className="cursor-pointer">
              {comp.label}
            </FieldLabel>
          </Field>
        );
      case ComponentTypeEnum.LongText:
        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel>{comp.label}</FieldLabel>
            <Textarea {...register(name)} placeholder={comp.label} />
          </Field>
        );

      case ComponentTypeEnum.MultipleChoice: {
        const details = comp.multipleChoiceDetails;
        const isMulti = details?.multipleSelection;
        const hasOther = details?.haveOtherValue;

        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel>{comp.label}</FieldLabel>
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                if (isMulti) {
                  const currentValues = Array.isArray(field.value)
                    ? (field.value as string[])
                    : [];
                  const isOtherChecked = currentValues.includes("__OTHER__");

                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {details?.options.map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${comp.id}-${opt.id}`}
                              checked={currentValues.includes(opt.label)}
                              onCheckedChange={(checked) => {
                                const newValues = checked
                                  ? [...currentValues, opt.label]
                                  : currentValues.filter(
                                      (v) => v !== opt.label,
                                    );
                                field.onChange(newValues);
                              }}
                            />
                            <label
                              htmlFor={`${comp.id}-${opt.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {opt.label}
                            </label>
                          </div>
                        ))}
                        {hasOther && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${comp.id}-other`}
                              checked={isOtherChecked}
                              onCheckedChange={(checked) => {
                                const newValues = checked
                                  ? [...currentValues, "__OTHER__"]
                                  : currentValues.filter(
                                      (v) => v !== "__OTHER__",
                                    );
                                field.onChange(newValues);
                              }}
                            />
                            <label
                              htmlFor={`${comp.id}-other`}
                              className="text-sm cursor-pointer italic text-muted-foreground"
                            >
                              Khác...
                            </label>
                          </div>
                        )}
                      </div>
                      {isOtherChecked && (
                        <Input
                          placeholder="Vui lòng nhập nội dung khác..."
                          {...register(
                            `dynamicOthers.${comp.label}` as Path<RegistrationFormValues>,
                          )}
                          className="mt-2 animate-in fade-in slide-in-from-top-1"
                        />
                      )}
                    </div>
                  );
                }

                const isOtherSelected = field.value === "__OTHER__";
                return (
                  <div className="space-y-2">
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (val !== "__OTHER__")
                          setValue(
                            `dynamicOthers.${comp.label}` as Path<RegistrationFormValues>,
                            "",
                          );
                      }}
                      value={field.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn một tùy chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        {details?.options.map((opt) => (
                          <SelectItem key={opt.id} value={opt.label}>
                            {opt.label}
                          </SelectItem>
                        ))}
                        {hasOther && (
                          <SelectItem
                            value="__OTHER__"
                            className="italic text-muted-foreground"
                          >
                            Khác...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {isOtherSelected && (
                      <Input
                        placeholder="Vui lòng nhập nội dung khác..."
                        {...register(
                          `dynamicOthers.${comp.label}` as Path<RegistrationFormValues>,
                        )}
                        className="animate-in fade-in slide-in-from-top-1"
                      />
                    )}
                  </div>
                );
              }}
            />
          </Field>
        );
      }
      case ComponentTypeEnum.Date:
        return (
          <Field key={comp.id} className="">
            <FieldLabel htmlFor={name}>{comp.label}</FieldLabel>
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
                          "w-full justify-start hover:cursor-pointer",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
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
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date(2100, 0)}
                        onSelect={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </Field>
        );
      case ComponentTypeEnum.DateTime:
        return (
          <Field key={comp.id} className="">
            <FieldLabel htmlFor={name}>{comp.label}</FieldLabel>
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                const dateValue =
                  typeof field.value === "string"
                    ? parseISO(field.value)
                    : undefined;

                return (
                  <div className="flex flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 md:flex-none flex justify-start hover:cursor-pointer",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon />
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
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date(2100, 0)}
                          onSelect={(date) => {
                            if (!date) return;
                            if (dateValue) {
                              date.setHours(dateValue.getHours());
                              date.setMinutes(dateValue.getMinutes());
                            }
                            field.onChange(date.toISOString());
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <InputGroup className="flex flex-1">
                      <InputGroupInput
                        id="time-input"
                        type="time"
                        step="60"
                        defaultValue="10:30"
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        onChange={(e) => {
                          const timeValue = e.target.value;
                          console.log("Selected time:", timeValue);
                        }}
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                );
              }}
            />
          </Field>
        );
      default:
        return (
          <Field key={comp.id} className="">
            <FieldLabel htmlFor={name}>{comp.label}</FieldLabel>
            <Input {...register(name)} placeholder={comp.label} />
          </Field>
        );
    }
  };
  // console.log("Current template state:", template);

  if (!template)
    return (
      <div className="text-start text-muted-foreground">
        Đang tải biểu mẫu...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <section className="flex flex-col gap-4">
            <h1 className="text-xl font-bold uppercase text-primary mt-4">
              {activity?.activityName}
            </h1>{" "}
            {template.registrationDescription &&
              !isRichTextEmpty(template.registrationDescription) && (
                <div className="w-full p-4 bg-card rounded-md border">
                  <ActivityRegistrationContentRenderer
                    content={template.registrationDescription}
                  />
                </div>
              )}
            {activity?.ageRestricted && (
              <div className="w-full ">
                <p className="text-sm text-muted-foreground italic">
                  Hoạt động này giới hạn độ tuổi
                  {activity.minAge != null && (
                    <>
                      {" "}
                      từ <strong>{activity.minAge} tuổi</strong>
                    </>
                  )}
                  {activity.minAge != null && activity.maxAge != null && " đến"}
                  {activity.maxAge != null && (
                    <>
                      {" "}
                      dưới <strong>{activity.maxAge} tuổi</strong>
                    </>
                  )}
                  {activity.minAge == null &&
                    activity.maxAge == null &&
                    " theo quy định"}
                  . Vui lòng đảm bảo bạn đáp ứng yêu cầu này.
                </p>
              </div>
            )}
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
              <Input
                placeholder="Nhập họ và tên"
                {...register("basic.fullName", { required: true })}
              />
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
                rules={{ required: "Ngày sinh là thông tin bắt buộc" }}
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
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
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
              <Input
                placeholder="Nhập số điện thoại"
                {...register("basic.phoneNumber", { required: true })}
              />
            </Field>
            <Field>
              <FieldLabel>
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="email"
                placeholder="Nhập email"
                {...register("basic.email", {
                  required: "Email là thông tin bắt buộc",
                })}
              />
            </Field>
            <Field className="col-span-full">
              <FieldLabel>Địa chỉ</FieldLabel>
              <Textarea
                placeholder="Nhập địa chỉ"
                {...register("basic.address")}
              />
            </Field>
            <div className="col-span-full space-y-4 rounded-xl border border-dashed p-4 bg-muted/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FieldLabel htmlFor="haveZalo" className="cursor-pointer">
                    Bạn có sử dụng Zalo
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Giúp chúng tôi liên lạc qua Zalo
                  </p>
                </div>
                <Controller
                  control={control}
                  name="basic.haveZalo"
                  render={({ field }) => (
                    <Switch
                      id="haveZalo"
                      checked={!!field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) setValue("basic.zaloName", "");
                      }}
                    />
                  )}
                />
              </div>

              {watchHaveZalo && (
                <div className="grid gap-2 ">
                  <FieldLabel className="text-sm font-semibold">
                    Tên hiển thị trên Zalo
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register("basic.zaloName", {
                      required:
                        "Vui lòng nhập tên Zalo để chúng tôi hỗ trợ tốt nhất",
                    })}
                    placeholder="Nhập tên hiển thị của bạn trên Zalo"
                    className=""
                  />
                  {errors.basic?.zaloName && (
                    <p className="text-[13px] font-medium text-destructive animate-shake">
                      {errors.basic.zaloName.message}
                    </p>
                  )}
                </div>
              )}
            </div>{" "}
            <div className="col-span-full flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
              <Controller
                control={control}
                name="firstTimeRegistered"
                render={({ field }) => (
                  <Checkbox
                    id="firstTimeRegistered"
                    className="mt-1"
                    checked={!!field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                )}
              />
              <FieldLabel
                htmlFor="firstTimeRegistered"
                className="font-normal leading-relaxed"
              >
                Đây là lần đầu tiên tôi tham gia sự kiện tại Ni Viện Viên Không.
              </FieldLabel>
            </div>
            {/* )} */}
          </div>

          {/* Section: Identity*/}
          {template.defaultIdentitySectionIncluded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <h3 className="col-span-full font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin Căn cước
              </h3>
              <Field>
                <FieldLabel>
                  Số CCCD<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Nhập số CCCD"
                  {...register("identityDetail.IDNumber")}
                />
              </Field>

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
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
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

              <Field className="col-span-full">
                <FieldLabel>
                  Khu vực đăng ký<span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="identityDetail.issueAt"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      {" "}
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực đăng ký" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Bộ Công An"
                        >
                          Bộ Công An
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                        >
                          Cục Cảnh sát quản lý hành chính về trật tự xã hội
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Cục Cảnh sát đăng ký quản lý cư trú và dữ liệu Quốc gia về dân cư"
                        >
                          Cục Cảnh sát đăng ký quản lý cư trú và dữ liệu Quốc
                          gia về dân cư
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Khác"
                        >
                          Khác
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />{" "}
                {watchIdIssueAt === "Khác" && (
                  <Input
                    className="mt-2 animate-in fade-in slide-in-from-top-1"
                    placeholder="Nhập khu vực của bạn"
                    {...register("identityDetail.issueAtOther")}
                  />
                )}
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
                <Input
                  placeholder="Nhập Pháp danh"
                  {...register("monasticDetail.dharmaName")}
                />
              </Field>
              <Field>
                <FieldLabel>Chức vụ</FieldLabel>
                <Controller
                  control={control}
                  name="monasticDetail.monasticRank"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chức vụ tu sĩ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Tỳ Kheo Ni"
                        >
                          Tỳ Kheo Ni
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Sadini"
                        >
                          Sadini
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Tu nữ"
                        >
                          Tu nữ
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Cư sĩ nam"
                        >
                          Cư sĩ nam
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Cư sĩ nữ"
                        >
                          Cư sĩ nữ
                        </SelectItem>
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
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Nam Tông"
                        >
                          Nam Tông
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Bắc Tông"
                        >
                          Bắc Tông
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Khất Sĩ"
                        >
                          Khất Sĩ
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Khác"
                        >
                          Khác
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {watchTradition === "Khác" && (
                  <Input
                    className="mt-2 animate-in fade-in slide-in-from-top-1"
                    placeholder="Nhập truyền thống khác của bạn"
                    {...register("monasticDetail.monasticTraditionOther")}
                  />
                )}
              </Field>
              <Field className="">
                <FieldLabel>Thiền viện hiện tại</FieldLabel>
                <Input
                  placeholder="Nhập tên thiền viện hiện tại"
                  {...register("monasticDetail.currentMonastery")}
                />
              </Field>{" "}
              <Field className="">
                <FieldLabel>Số năm tu tập</FieldLabel>
                <Input
                  placeholder="Nhập số năm tu tập"
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
                <Input
                  placeholder="Nhập họ tên người thân"
                  {...register("relationDetail.fullName")}
                />
              </Field>
              <Field>
                <FieldLabel>Số điện thoại người thân</FieldLabel>
                <Input
                  placeholder="Nhập số điện thoại người thân"
                  {...register("relationDetail.phoneNumber")}
                />
              </Field>
              <Field>
                <FieldLabel>Mối quan hệ</FieldLabel>
                <Input
                  placeholder="Nhập mối quan hệ"
                  {...register("relationDetail.relationship")}
                />
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
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Ăn chay"
                        >
                          Ăn chay
                        </SelectItem>
                        <SelectItem
                          className="hover:cursor-pointer"
                          value="Ăn thường"
                        >
                          Ăn thường
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field className="col-span-full">
                <FieldLabel>Yêu cầu về dị ứng thực phẩm</FieldLabel>
                <Textarea
                  placeholder="Nhập yêu cầu về dị ứng thực phẩm"
                  {...register("routineDetail.foodAllergies")}
                />
              </Field>
              <div className="col-span-full flex items-center space-x-2">
                <Controller
                  control={control}
                  name="routineDetail.medicalConditions"
                  render={({ field }) => (
                    <Switch
                      id="medicalConditions"
                      className="shrink-0 hover:cursor-pointer"
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
          {template.customizedComponents?.some(
            (comp) => comp.section === FormSectionEnum.Others,
          ) && (
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-bold border-l-4 border-primary pl-2 uppercase">
                Thông tin bổ sung
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSectionFields(FormSectionEnum.Others)}
              </div>
            </div>
          )}

          {template.commitmentMessages &&
            template.commitmentMessages.length > 0 && (
              <div className="col-span-full pt-6 border-t space-y-4">
                <h3 className="font-bold border-l-4 border-primary pl-2 uppercase">
                  Cam kết tham gia
                </h3>
                <div className="space-y-2">
                  {template.commitmentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20"
                    >
                      <Controller
                        control={control}
                        name={
                          `commitments.${msg.id}` as unknown as Path<RegistrationFormValues>
                        }
                        render={({ field }) => (
                          <Checkbox
                            id={`commit-${msg.id}`}
                            className="mt-1"
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <FieldLabel
                        htmlFor={`commit-${msg.id}`}
                        className="cursor-pointer font-normal leading-relaxed"
                      >
                        {msg.label}
                      </FieldLabel>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="w-full justify-end flex">
            <Button
              size="lg"
              type="submit"
              className="hover:cursor-pointer uppercase tracking-wider"
              disabled={isPending}
            >
              {" "}
              <Send />
              {isPending ? "Đang xử lý..." : "Gửi đăng ký"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
