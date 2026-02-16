import lineOrnament from "@/public/ornament-01.svg";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CourseRegistrationSection from "@/components/CourseRegistration/CourseRegistrationSection";
export default async function CourseRegistrationPage() {
  return (
    <div className="mx-auto max-w-10xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          Đăng ký khóa tu
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>
      <div className="flex max-w-4xl mx-auto">
        <CourseRegistrationSection />
      </div>
    </div>
  );
}
