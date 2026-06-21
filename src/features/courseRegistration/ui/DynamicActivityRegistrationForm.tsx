"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  useForm,
  Controller,
  useWatch,
  Path,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// API & Types
import { fetchActivityByDocumentIdWithRegistrationForm } from "@/features/activity/api/activity.api";
import {
  Activity,
  RegistrationFormTemplate,
} from "@/features/activity/model/activity.types";
import { ComponentTypeEnum, FormSectionEnum } from "@/types/form-components";
import {
  IdIssueOrganisationEnum,
  MonasticTraditionEnum,
} from "@/types/form-templates";

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
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock2Icon, Send } from "lucide-react";
import { cn, isRichTextEmpty } from "@/shared/lib/utils";
import { vi, enGB } from "date-fns/locale";
import RichTextRenderer from "@/shared/layout/RichTextRenderer";
import type {
  CustomizedComponentWithDetails,
  RegistrationFormValues,
} from "./form/types";
import { registrationFormSchema } from "./form/schema";
import {
  getFieldError,
  getSectionKey,
  mapCommitments,
  processDynamicSection,
  validateActivityAge,
} from "./form/utils";
import { submitActivityRegistration } from "./form/submit";

interface Props {
  documentId: string;
  locale: Locale;
  active: boolean;
  onClose?: () => void;
}

export default function ActivityRegistrationForm({
  documentId,
  locale,
  active,
  onClose,
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
    reset,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    shouldFocusError: true,
    resolver: zodResolver(
      registrationFormSchema,
    ) as Resolver<RegistrationFormValues>,
    defaultValues: {
      firstTimeRegistered: false,
      basic: {
        fullName: "",
        dob: "",
        gender: undefined,
        phoneNumber: "",
        email: "",
        address: "",
        haveZalo: false,
        zaloName: "",
      },
      identityDetail: {
        IDNumber: "",
        issueAt: undefined,
        issueDate: "",
      },
      monasticDetail: {},
      relationDetail: {},
      routineDetail: {
        medicalConditions: false,
        foodAllergies: "",
        dietaryRequirement: undefined,
      },
      otherDetail: {},
      commitments: {},
      dynamicOthers: {},
    },
  });
  const watchZaloName = useWatch({
    control,
    name: "basic.zaloName",
  });
  useEffect(() => {
    if (watchZaloName && watchZaloName.trim() !== "") {
      setValue("basic.haveZalo", true);
    } else {
      setValue("basic.haveZalo", false);
    }
  }, [watchZaloName, setValue]);
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
        // console.log(
        //   "Loaded registration form template:",
        //   data?.registrationForm,
        // );
        // console.log("Loaded activity data:", data);
      } catch {
        toast.error("Không thể tải thông tin đăng ký");
      }
    }
    loadTemplate();
  }, [documentId]);

  const onSubmit = (values: RegistrationFormValues) => {
    const ageError = validateActivityAge(activity, values.basic.dob);
    if (ageError) {
      toast.error(ageError);
      return;
    }

    const mappedCommitments = mapCommitments(
      template?.commitmentMessages,
      values.commitments,
    );

    const finalIdentityDetail = processDynamicSection(
      values.identityDetail,
      FormSectionEnum.Identity,
      template,
      values.dynamicOthers,
    );
    const finalMonasticDetail = processDynamicSection(
      values.monasticDetail,
      FormSectionEnum.Monastic,
      template,
      values.dynamicOthers,
    );
    const finalRelationDetail = processDynamicSection(
      values.relationDetail,
      FormSectionEnum.Relation,
      template,
      values.dynamicOthers,
    );
    const finalRoutineDetail = processDynamicSection(
      values.routineDetail,
      FormSectionEnum.Routine,
      template,
      values.dynamicOthers,
    );
    const finalOtherDetail = processDynamicSection(
      values.otherDetail,
      FormSectionEnum.Others,
      template,
      values.dynamicOthers,
    );

    startTransition(async () => {
      try {
        const status = await submitActivityRegistration({
          values,
          documentId,
          identityDetail: finalIdentityDetail,
          monasticDetail: finalMonasticDetail,
          relationDetail: finalRelationDetail,
          routineDetail: finalRoutineDetail,
          otherDetail: {
            ...finalOtherDetail,
            ...mappedCommitments,
          },
        });

        if (status === "active") {
          toast.success("Chúc mừng! Bạn đã đăng ký thành công.");
        } else if (status === "pending") {
          toast.info(
            "Đăng ký thành công! Bạn hiện tại đã ở trong danh sách chờ do số lượng đơn đăng ký có giới hạn.",
          );
        } else {
          toast.success("Gửi thông tin dang ký thành công!");
        }

        reset();
        onClose?.();
      } catch {
        toast.error(
          "Bạn chua điền đầy đủ thông tin hoặc có lỗi xảy ra. Vui lòng kiểm tra lại.",
        );
      }
    });
  };

  const hasCustomFieldsForSection = (section: FormSectionEnum) => {
    return template?.customizedComponents?.some(
      (comp) => comp.section === section,
    );
  };

  const renderSectionFields = (sectionName: FormSectionEnum) => {
    const fields =
      template?.customizedComponents.filter((c) => c.section === sectionName) ||
      [];
    const formKey = getSectionKey(sectionName);

    return fields.map((comp) => {
      const rhfKey = comp.attributeName || `field_${comp.id}`;

      const fieldPath = `${formKey}.${rhfKey}` as Path<RegistrationFormValues>;

      return renderDynamicField(
        comp as CustomizedComponentWithDetails,
        fieldPath,
        rhfKey,
      );
    });
  };
  const renderDynamicField = (
    comp: CustomizedComponentWithDetails,
    name: Path<RegistrationFormValues>,
    rhfKey: string,
  ) => {
    const fieldError = getFieldError(errors, name);
    switch (comp.type) {
      case ComponentTypeEnum.Number:
        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel htmlFor={name}>
              {comp.label}
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Input
              type="number"
              {...register(name, {
                required: comp.isRequired ? "Trường này là bắt buộc" : false,
              })}
              placeholder={comp.label}
            />
            {fieldError && (
              <p className="input-error-message">
                {fieldError.message as string}
              </p>
            )}
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
              rules={{
                required: comp.isRequired ? "Vui lòng xác nhận" : false,
              }}
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
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            {fieldError && (
              <p className="input-error-message">
                {fieldError.message as string}
              </p>
            )}
          </Field>
        );
      case ComponentTypeEnum.LongText:
        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel>
              {comp.label}
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Textarea
              {...register(name, {
                required: comp.isRequired ? "Trường này là bắt buộc" : false,
              })}
              placeholder={comp.label}
            />
            {fieldError && (
              <p className="input-error-message">
                {fieldError.message as string}
              </p>
            )}
          </Field>
        );

      case ComponentTypeEnum.MultipleChoice: {
        const details = comp.multipleChoiceDetails;
        const isMulti = details?.multipleSelection;
        const hasOther = details?.haveOtherValue;

        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel>
              {comp.label}
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Controller
              control={control}
              name={name}
              rules={{
                validate: (value) => {
                  if (comp.isRequired) {
                    if (isMulti && (!value || (value as string[]).length === 0))
                      return "Vui lòng chọn ít nhất một tùy chọn";
                    if (!isMulti && !value) return "Vui lòng chọn một tùy chọn";
                  }
                  return true;
                },
              }}
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
                        <div>
                          <Input
                            placeholder="Vui lòng nhập nội dung khác..."
                            {...register(
                              `dynamicOthers.${rhfKey}` as Path<RegistrationFormValues>,
                              {
                                required: "Vui lòng nhập chi tiết",
                              },
                            )}
                            className="mt-2 animate-in fade-in slide-in-from-top-1"
                          />
                          {errors.dynamicOthers?.[rhfKey] && (
                            <p className="input-error-message mt-1">
                              {errors.dynamicOthers[rhfKey]?.message}
                            </p>
                          )}
                        </div>
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
                            `dynamicOthers.${rhfKey}` as Path<RegistrationFormValues>,
                            "",
                          );
                      }}
                      value={field.value as string}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn một tùy chọn" />
                      </SelectTrigger>
                      <SelectContent position="popper">
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
                      <div>
                        <Input
                          placeholder="Vui lòng nhập nội dung khác..."
                          {...register(
                            `dynamicOthers.${rhfKey}` as Path<RegistrationFormValues>,
                            {
                              required: "Vui lòng nhập chi tiết",
                            },
                          )}
                          className="animate-in fade-in slide-in-from-top-1"
                        />
                        {errors.dynamicOthers?.[rhfKey] && (
                          <p className="input-error-message mt-1">
                            {errors.dynamicOthers[rhfKey]?.message}{" "}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            {fieldError && (
              <p className="input-error-message mt-1">
                {fieldError.message as string}
              </p>
            )}
          </Field>
        );
      }
      case ComponentTypeEnum.Date:
        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel htmlFor={name}>
              {comp.label}
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Controller
              control={control}
              name={name}
              rules={{
                required: comp.isRequired ? "Vui lòng chọn ngày" : false,
              }}
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
                        locale={locale === "vi" ? vi : enGB}
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date(2100, 0)}
                        onSelect={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : "",
                          );
                        }}
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            {fieldError && (
              <p className="input-error-message mt-1">
                {fieldError.message as string}
              </p>
            )}
          </Field>
        );
      case ComponentTypeEnum.DateTime:
        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel htmlFor={name}>
              {comp.label}
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Controller
              control={control}
              name={name}
              rules={{
                required: comp.isRequired ? "Vui lòng chọn ngày và giờ" : false,
              }}
              render={({ field }) => {
                const dateValue =
                  typeof field.value === "string"
                    ? parseISO(field.value)
                    : undefined;
                const timeString =
                  dateValue && isValid(dateValue)
                    ? format(dateValue, "HH:mm")
                    : "";
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
                          locale={locale === "vi" ? vi : enGB}
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date(2100, 0)}
                          onSelect={(date) => {
                            if (!date) return;
                            if (dateValue) {
                              date.setHours(dateValue.getHours());
                              date.setMinutes(dateValue.getMinutes());
                            }
                            field.onChange(
                              format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                            );
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
                        value={timeString}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        onChange={(e) => {
                          const timeValue = e.target.value; // Kết quả trả về dạng "HH:mm", ví dụ: "14:30"
                          if (!timeValue) return;

                          // Tách giờ và phút ra từ chuỗi
                          const [hours, minutes] = timeValue
                            .split(":")
                            .map(Number);

                          // Nếu đã chọn ngày thì lấy ngày đó, nếu chưa thì mặc định lấy ngày hôm nay
                          const newDate =
                            dateValue && isValid(dateValue)
                              ? new Date(dateValue)
                              : new Date();

                          // Cập nhật giờ phút mới
                          newDate.setHours(hours);
                          newDate.setMinutes(minutes);

                          // Lưu vào form state
                          field.onChange(
                            format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                          );
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
            {fieldError && (
              <p className="input-error-message mt-1">
                {fieldError.message as string}
              </p>
            )}
          </Field>
        );
      default:
        return (
          <Field key={comp.id} className="col-span-full">
            <FieldLabel htmlFor={name}>
              {comp.label}
              {comp.isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Input
              {...register(name, {
                required: comp.isRequired ? "Trường này là bắt buộc" : false,
              })}
              placeholder={comp.label}
            />
            {fieldError && (
              <p className="input-error-message">
                {fieldError.message as string}
              </p>
            )}
          </Field>
        );
    }
  };
  // console.log("Current template state:", template);

  if (!template)
    return (
      <div className="text-center text-muted-foreground">
        Đang tải biểu mẫu...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto w-full">
      <form
        onSubmit={handleSubmit(onSubmit, () => {
          const firstError = document.querySelector("[aria-invalid='true']");
          firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
        })}
        className="space-y-8"
      >
        <div className="space-y-8">
          <section className="flex flex-col">
            <h1 className="text-2xl font-bold uppercase text-primary pb-2 border-b-2 border-primary/80">
              {activity?.activityName}
            </h1>
            {template.registrationDescription &&
              !isRichTextEmpty(template.registrationDescription) && (
                <div className="w-full">
                  <RichTextRenderer
                    content={template.registrationDescription}
                  />
                </div>
              )}
            {activity?.ageRestricted && (
              <div className="w-full mt-6">
                <p className="text-base text-muted-foreground italic">
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
          <div className="input-section">
            <h3 className="form-section-title">Thông tin cá nhân</h3>
            <Field className="col-span-full">
              <FieldLabel>
                Họ và tên <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="Nhập họ và tên"
                {...register("basic.fullName", {
                  required: "Họ và tên là thông tin bắt buộc",
                })}
              />
              {errors.basic?.fullName && (
                <p className="input-error-message">
                  {errors.basic.fullName.message}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>
                Giới tính <span className="text-destructive">*</span>
              </FieldLabel>

              <Controller
                control={control}
                name="basic.gender"
                rules={{ required: "Giới tính là thông tin bắt buộc" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.basic?.gender && (
                <p className="input-error-message">
                  {errors.basic.gender.message}
                </p>
              )}
            </Field>
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
                          locale={locale === "vi" ? vi : enGB}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          onSelect={(date) => {
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : "",
                            );
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
                <p className="input-error-message">Vui lòng chọn ngày sinh</p>
              )}
            </Field>
            <Field>
              <FieldLabel>
                Số điện thoại <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                placeholder="Nhập số điện thoại"
                {...register("basic.phoneNumber", {
                  required: "Số điện thoại là thông tin bắt buộc",
                })}
              />
              {errors.basic?.phoneNumber && (
                <p className="input-error-message">
                  {errors.basic.phoneNumber.message}
                </p>
              )}
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
              {errors.basic?.email && (
                <p className="input-error-message">
                  {errors.basic.email.message}
                </p>
              )}
            </Field>
            <Field className="col-span-full">
              <FieldLabel>
                Địa chỉ <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                placeholder="Nhập Địa chỉ"
                {...register("basic.address", {
                  required: "Địa chỉ là thông tin bắt buộc",
                })}
              />
              {errors.basic?.address && (
                <p className="input-error-message">
                  {errors.basic.address.message}
                </p>
              )}
            </Field>

            <Field className="col-span-full">
              <FieldLabel className="text-sm font-semibold">
                Tên hiển thị trên Zalo
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...register("basic.zaloName", {
                  required: "Tên hiển thị trên Zalo là thông tin bắt buộc",
                })}
                placeholder="Nhập tên hiển thị của bạn trên Zalo"
              />
              {errors.basic?.zaloName && (
                <p className="input-error-message">
                  {errors.basic.zaloName.message}
                </p>
              )}
            </Field>

            <div className="col-span-full flex items-start space-x-2 p-2 pl-0 rounded-lg bg-muted/20">
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
                className="font-normal leading-relaxed cursor-pointer"
              >
                Đây là lần đầu tiên tôi tham gia sự kiện tại Ni Viện Viên Không.
              </FieldLabel>
            </div>
            {/* )} */}
          </div>

          {/* Section: Identity*/}
          {(template.defaultIdentitySectionIncluded ||
            hasCustomFieldsForSection(FormSectionEnum.Identity)) && (
            <div className="input-section pt-6 border-t">
              <h3 className="form-section-title">Thông tin Căn cước</h3>

              {template.defaultIdentitySectionIncluded && (
                <>
                  <Field>
                    <FieldLabel>
                      Số CCCD
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Nhập số CCCD"
                      {...register("identityDetail.IDNumber", {
                        required: "Số CCCD là thông tin bắt buộc",
                      })}
                    />
                    {errors.identityDetail?.IDNumber && (
                      <p className="input-error-message">
                        {errors.identityDetail.IDNumber.message}
                      </p>
                    )}
                  </Field>

                  <Field className="">
                    <FieldLabel htmlFor="issueDate">
                      Ngày cấp
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="identityDetail.issueDate"
                      rules={{ required: "Ngày cấp là thông tin bắt buộc" }}
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
                                  <span>Chọn ngày cấp CCCD</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={dateValue}
                                captionLayout="dropdown"
                                locale={locale === "vi" ? vi : enGB}
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                                onSelect={(date) => {
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : "",
                                  );
                                }}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        );
                      }}
                    />
                    {errors.identityDetail?.issueDate && (
                      <p className="input-error-message">
                        {errors.identityDetail.issueDate.message}
                      </p>
                    )}
                  </Field>

                  <Field className="col-span-full">
                    <FieldLabel>
                      Khu vực đăng ký
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="identityDetail.issueAt"
                      rules={{
                        required: "Khu vực đăng ký là thông tin bắt buộc",
                      }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {" "}
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khu vực đăng ký" />
                          </SelectTrigger>
                          <SelectContent position="popper">
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
                              Cục Cảnh sát đăng ký quản lý cư trú và dữ liệu
                              Quốc gia về dân cư
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
                    {watchIdIssueAt === IdIssueOrganisationEnum.Other && (
                      <Input
                        className="mt-2 animate-in fade-in slide-in-from-top-1"
                        placeholder="Nhập khu vực của bạn"
                        {...register("identityDetail.issueAtOther")}
                      />
                    )}
                    {errors.identityDetail?.issueAt && (
                      <p className="input-error-message">
                        {errors.identityDetail.issueAt.message}
                      </p>
                    )}
                  </Field>
                </>
              )}

              {renderSectionFields(FormSectionEnum.Identity)}
            </div>
          )}
          {(template.defaultMonasticSectionIncluded ||
            hasCustomFieldsForSection(FormSectionEnum.Monastic)) && (
            <div className="input-section pt-6 border-t">
              <h3 className="form-section-title">Thông tin tu sĩ</h3>
              {template.defaultMonasticSectionIncluded && (
                <>
                  <Field className="col-span-full">
                    <FieldLabel>Pháp danh</FieldLabel>
                    <Input
                      placeholder="Nhập Pháp danh"
                      {...register("monasticDetail.dharmaName")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Giới phẩm</FieldLabel>
                    <Controller
                      control={control}
                      name="monasticDetail.monasticRank"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới phẩm" />
                          </SelectTrigger>
                          <SelectContent position="popper">
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn truyền thống tu sĩ" />
                          </SelectTrigger>
                          <SelectContent position="popper">
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
                    {watchTradition === MonasticTraditionEnum.Other && (
                      <Input
                        className="mt-2 animate-in fade-in slide-in-from-top-1"
                        placeholder="Nhập truyền thống khác của bạn"
                        {...register("monasticDetail.monasticTraditionOther")}
                      />
                    )}
                  </Field>
                  <Field className="">
                    <FieldLabel>Tự viện</FieldLabel>
                    <Input
                      placeholder="Nhập tên tự viện (chùa/ni viện) của bạn"
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
                </>
              )}
              {renderSectionFields(FormSectionEnum.Monastic)}
            </div>
          )}

          {(template.defaultRelationSectionIncluded ||
            hasCustomFieldsForSection(FormSectionEnum.Relation)) && (
            <div className="input-section pt-6 border-t">
              <h3 className="form-section-title">Thông tin liên hệ</h3>

              {template.defaultRelationSectionIncluded && (
                <>
                  <Field className="col-span-full">
                    <FieldLabel>
                      Họ tên người thân{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Nhập họ tên người thân"
                      {...register("relationDetail.fullName", {
                        required: "Họ tên người thân là thông tin bắt buộc",
                      })}
                    />{" "}
                    {errors.relationDetail?.fullName && (
                      <p className="input-error-message">
                        {errors.relationDetail.fullName.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>
                      Số điện thoại người thân{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Nhập số điện thoại người thân"
                      {...register("relationDetail.phoneNumber", {
                        required:
                          "Số điện thoại người thân là thông tin bắt buộc",
                      })}
                    />{" "}
                    {errors.relationDetail?.phoneNumber && (
                      <p className="input-error-message">
                        {errors.relationDetail.phoneNumber.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>
                      Mối quan hệ <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Nhập mối quan hệ"
                      {...register("relationDetail.relationship", {
                        required:
                          "Mối quan hệ với người thân là thông tin bắt buộc",
                      })}
                    />{" "}
                    {errors.relationDetail?.relationship && (
                      <p className="input-error-message">
                        {errors.relationDetail.relationship.message}
                      </p>
                    )}
                  </Field>
                </>
              )}
              {renderSectionFields(FormSectionEnum.Relation)}
            </div>
          )}
          {(template.defaultRoutineSectionIncluded ||
            hasCustomFieldsForSection(FormSectionEnum.Routine)) && (
            <div className="input-section pt-6 border-t">
              <h3 className="form-section-title">Thông tin lịch trình</h3>

              {template.defaultRoutineSectionIncluded && (
                <>
                  <Field className="col-span-full">
                    <FieldLabel>
                      Yêu cầu về chế độ ăn uống
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="routineDetail.dietaryRequirement"
                      rules={{
                        required:
                          "Yêu cầu về chế độ ăn uống là thông tin bắt buộc",
                      }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={(field.value as string) || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chế độ ăn uống" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem
                              className="hover:cursor-pointer"
                              value="Ä‚n chay"
                            >
                              Ä‚n chay
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
                    />{" "}
                    {errors.routineDetail?.dietaryRequirement && (
                      <p className="input-error-message">
                        {errors.routineDetail.dietaryRequirement.message}
                      </p>
                    )}
                  </Field>
                  <Field className="col-span-full">
                    <FieldLabel>
                      Yêu cầu về dị ứng thực phẩm{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Textarea
                      placeholder="Nhập yêu cầu về dị ứng thực phẩm"
                      {...register("routineDetail.foodAllergies", {
                        required:
                          "Yêu cầu về dị ứng thực phẩm là thông tin bắt buộc",
                      })}
                    />{" "}
                    {errors.routineDetail?.foodAllergies && (
                      <p className="input-error-message">
                        {errors.routineDetail.foodAllergies.message}
                      </p>
                    )}
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
                </>
              )}
              {renderSectionFields(FormSectionEnum.Routine)}
            </div>
          )}
          {/* Section: Dynamic Components */}
          {template.customizedComponents?.some(
            (comp) => comp.section === FormSectionEnum.Others,
          ) && (
            <div className="input-section pt-6 border-t">
              <h3 className="form-section-title">Thông tin bổ sung</h3>
              <> {renderSectionFields(FormSectionEnum.Others)}</>
            </div>
          )}

          {template.commitmentMessages &&
            template.commitmentMessages.length > 0 && (
              <div className="col-span-full pt-6 border-t space-y-4">
                <h3 className="form-section-title">Cam kết tham gia</h3>
                <div className="space-y-2">
                  {template.commitmentMessages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                      <div className="flex items-start space-x-2 p-2 pl-0 rounded-lg bg-muted/20">
                        <Controller
                          control={control}
                          name={
                            `commitments.${msg.id}` as unknown as Path<RegistrationFormValues>
                          }
                          rules={{
                            validate: (value) =>
                              value === true ||
                              "Bạn phải đồng ý với cam kết này",
                          }}
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
                      {errors.commitments?.[msg.id] && (
                        <span className="text-xs text-destructive">
                          {errors.commitments[msg.id]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="w-full justify-end flex">
            <Button
              size="lg"
              type="submit"
              className="hover:cursor-pointer uppercase font-mono"
              disabled={isPending || active === false}
            >
              <Send />
              {isPending ? "Đang xử lý..." : "Đăng ký tham gia"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
