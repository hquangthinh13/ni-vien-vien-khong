"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { toast } from "sonner";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { CourseRegistrationFormData } from "../model/courseRegistration.types";
import { createCourseRegistration } from "../api/courseRegistration.api";
import { fetchActiveCourses } from "@/features/course/api/course.api";
import { Course } from "@/features/course/model/course.types";
interface RegistrationProps {
  onlyButton?: boolean;
}
export default function CourseRegistrationSection({
  onlyButton = false,
}: RegistrationProps) {

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseRegistrationFormData, string>>
  >({});

  const [formData, setFormData] = useState<CourseRegistrationFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    registedCourseId: "",
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const todayISO = new Date().toISOString();
        const response = await fetchActiveCourses({ referenceDate: todayISO });
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Failed to load courses", error);
      }
    };
    loadCourses();
  }, []);

  const groupedCourses = courses.reduce(
    (acc, course) => {
      const category = course.category || "Khác";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(course);
      return acc;
    },
    {} as Record<string, Course[]>,
  );

  const renderAllGroups = () => {
    const groupKeys = Object.keys(groupedCourses);

    if (groupKeys.length === 0) return null;

    return groupKeys.map((category, index) => (
      <React.Fragment key={category}>
        <SelectGroup>
          <SelectLabel className="">{category}</SelectLabel>
          {groupedCourses[category].map((course) => (
            <SelectItem key={course.documentId} value={course.documentId ?? ""}>
              {course.courseName}
            </SelectItem>
          ))}
        </SelectGroup>
        {index < groupKeys.length - 1 && <SelectSeparator />}
      </React.Fragment>
    ));
  };

  const PHONE_REGEX = /^(?:0\d{9}|\+\d{1,3}\s?\d{7,12})$/;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.registedCourseId)
      newErrors.registedCourseId = "Vui lòng chọn một khóa tu";
    if (!formData.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Số điện thoại không đúng định dạng (VD: 0912345678)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin đăng ký");
      return;
    }

    setIsLoading(true);
    try {
      await createCourseRegistration(formData);
      toast.success("Đăng ký thành công!");
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        registedCourseId: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng ký.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      {!onlyButton ? (
        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
          <h4 className="font-bold text-primary uppercase text-xs tracking-widest mb-2">
            Đăng ký khóa tu
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed italic mb-4">
            Tham gia các khóa tu sắp tới của Ni Viện Viên Không.
          </p>
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Đăng ký ngay</Button>
          </DialogTrigger>
        </div>
      ) : (
        <DialogTrigger asChild>
          <Button className="w-full cursor-pointer">Đăng ký ngay</Button>
        </DialogTrigger>
      )}
      <DialogContent
        aria-describedby="Course registration form"
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle>Đăng ký khóa tu</DialogTitle>
        <div className="flex w-full flex-col mt-4">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel>
                  Khóa tu <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={formData.registedCourseId}
                  onValueChange={(val) => {
                    setFormData({ ...formData, registedCourseId: val });
                    setErrors({ ...errors, registedCourseId: "" });
                  }}
                >
                  <SelectTrigger
                    className={
                      errors.registedCourseId ? "border-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Chọn khóa tu muốn tham gia" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {renderAllGroups()}
                  </SelectContent>
                </Select>
                {errors.registedCourseId && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {errors.registedCourseId}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="fullName">
                  Họ và tên <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="fullName"
                  className={errors.fullName ? "border-destructive" : ""}
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    setErrors({ ...errors, fullName: "" });
                  }}
                  placeholder="Trần Ngọc A"
                />
                {errors.fullName && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {errors.fullName}
                  </p>
                )}
              </Field>
              <div className="flex gap-4 justify-between">
                <Field>
                  <FieldLabel htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    className={errors.email ? "border-destructive" : ""}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: "" });
                    }}
                    placeholder="example@nivienvienkhong.com"
                  />
                  {errors.email ? (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {errors.email}
                    </p>
                  ) : (
                    <FieldDescription>
                      Thông tin xác nhận sẽ được gửi qua email này.
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="phoneNumber">
                    Số điện thoại <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    className={errors.phoneNumber ? "border-destructive" : ""}
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value,
                      });
                      setErrors({ ...errors, phoneNumber: "" });
                    }}
                    placeholder="0123456789"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ của bạn"
                />
              </Field>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? "Đang gửi..." : "Gửi đăng ký"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
}
