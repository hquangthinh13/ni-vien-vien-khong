"use client";

import React from "react";
import { SearchAlert } from "lucide-react";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import { motion } from "framer-motion";

export default function RegistrationSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center">
      <MotionWrapper delay={0.1} className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-red-800/30">
          <SearchAlert className="w-8 h-8 text-red-800 stroke-[1.5px]" />
          <motion.div
            className="absolute -inset-2 border border-red-800/50 rounded-full"
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
        </div>
      </MotionWrapper>
      <div className="text-center mt-8 space-y-6">
        <MotionWrapper delay={0.2}>
          <h1 className="font-bold text-2xl uppercase tracking-widest text-red-800">
            Lỗi kết nối
          </h1>
        </MotionWrapper>

        <MotionWrapper delay={0.3} className="space-y-4 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground italic">
            Kết nối hiện đang gián đoạn. Bạn vui lòng thử tải lại trang hoặc
            kiểm tra lại mạng nhé{" "}
          </p>
        </MotionWrapper>
      </div>
    </div>
  );
}
