"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Home } from "lucide-react";
import lineOrnament from "@/public/ornament-01.svg";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import RegistrationQRCode from "@/shared/layout/RegistrationQRCode";

export default function ConfirmSection({
  zaloGroup,
  activityName,
}: {
  zaloGroup?: string;
  activityName: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center">
      <MotionWrapper delay={0.1} className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-primary/30">
          <Check className="w-8 h-8 text-primary stroke-[1.5px]" />
          <motion.div
            className="absolute -inset-2 border border-primary/50 rounded-full"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute -inset-4 border border-primary/5 rounded-full" />
        </div>
      </MotionWrapper>
      <MotionWrapper
        delay={0.3}
        className="text-center mt-8 space-y-6 max-w-xl"
      >
        <h1 className="font-bold text-2xl uppercase tracking-widest text-primary">
          Đăng Ký Thành Công
        </h1>
        <div className="flex justify-center opacity-90 rotate-180">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
        </div>
        <p className="text-sm text-muted-foreground italic">
          {`Lời chúc lành đến bạn. Yêu cầu đăng ký tham gia `}{" "}
          <strong> {activityName} </strong>
          {` của bạn đã
            được ghi nhận trên hệ thống.`}
        </p>
        {zaloGroup && <RegistrationQRCode value={zaloGroup} />}
      </MotionWrapper>
      <MotionWrapper
        delay={0.4}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12"
      >
        <Button
          variant="outline"
          onClick={() => typeof window !== "undefined" && window.history.back()}
          className="hover:cursor-pointer"
        >
          <ArrowLeft size={16} />
          Quay lại trang trước
        </Button>{" "}
        <Button variant="default" asChild className="hover:cursor-pointer">
          <Link href="/" className="flex items-center gap-2">
            <Home size={16} /> Trở về trang chủ
          </Link>
        </Button>
      </MotionWrapper>
    </div>
  );
}
