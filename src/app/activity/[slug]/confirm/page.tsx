// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowLeft, Check, Home } from "lucide-react";
// import lineOrnament from "@/public/ornament-01.svg";
// import MotionWrapper from "@/shared/motion/MotionWrapper";
// import { Button } from "@/shared/ui/button";
// import { motion } from "framer-motion";
// import { fetchActivityByDocumentId } from "@/features/activity/api/activity.api";

// export default function RegistrationSuccessPage() {

//   return (
//     <div className="mx-auto max-w-3xl px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center">
//       <MotionWrapper delay={0.1} className="flex flex-col items-center gap-4">
//         <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-primary/30">
//           <Check className="w-8 h-8 text-primary stroke-[1.5px]" />
//           <motion.div
//             className="absolute -inset-2 border border-primary/50 rounded-full"
//             animate={{
//               scale: [1, 1.25, 1],
//               opacity: [0.3, 0.6, 0.3],
//             }}
//             transition={{
//               duration: 4,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//           <div className="absolute -inset-4 border border-primary/5 rounded-full" />
//         </div>
//       </MotionWrapper>
//       <div className="text-center mt-8 space-y-6">
//         <MotionWrapper delay={0.2}>
//           <h1 className="font-bold text-2xl uppercase tracking-widest text-primary">
//             Đăng Ký Thành Công
//           </h1>
//         </MotionWrapper>
//         <MotionWrapper
//           delay={0.5}
//           className="flex justify-center opacity-30 rotate-180"
//         >
//           <Image src={lineOrnament} alt="Ornament" className="w-auto h-4" />
//         </MotionWrapper>
//         <MotionWrapper delay={0.3} className="space-y-4 max-w-md mx-auto">
//           <p className="text-sm text-muted-foreground italic">
//             Lời chúc lành đến bạn. Yêu cầu đăng ký tham gia khóa tu của bạn đã
//             được ghi nhận hệ thống.
//           </p>
//         </MotionWrapper>
//       </div>
//       <MotionWrapper
//         delay={0.4}
//         className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12"
//       >
//         <Button
//           variant="outline"
//           onClick={() => typeof window !== "undefined" && window.history.back()}
//           className="hover:cursor-pointer"
//         >
//           <ArrowLeft size={16} />
//           Quay lại trang trước
//         </Button>{" "}
//         <Button variant="default" asChild className="hover:cursor-pointer">
//           <Link href="/" className="flex items-center gap-2">
//             <Home size={16} /> Trở về trang chủ
//           </Link>
//         </Button>
//       </MotionWrapper>
//     </div>
//   );
// }

import { Metadata, ResolvingMetadata } from "next";
import ConfirmSection from "@/features/activity/ui/ConfirmSection";
import { fetchActivityByDocumentId } from "@/features/activity/api/activity.api";
import notFound from "@/app/not-found";
import { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import {
  Activity,
  ActivityResponse,
} from "@/features/activity/model/activity.types";
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split("-");
  const documentId = parts.pop() as string;
  const locale = (await getLocale()) as Locale;

  try {
    const response = await fetchActivityByDocumentId({
      locale,
      documentId: documentId,
      fields: [
        "zaloGroup",
        "activityName",
        "activityStartDate",
        "activityEndDate",
      ],
    });

    const data = response?.data as Activity;

    if (!data) {
      return { title: "Không tìm thấy" };
    }

    return {
      title: `Đăng ký thành công | ${data.activityName}`,
    };
  } catch (error) {
    return { title: "Ni Viện Viên Không" };
  }
}

export default async function Page({ params }: Props) {
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;
  const parts = slug.split("-");
  const documentId = parts.pop() as string;
  let response;
  try {
    response = (await fetchActivityByDocumentId({
      locale,
      documentId: documentId,
      fields: [
        "zaloGroup",
        "activityName",
        "activityStartDate",
        "activityEndDate",
      ],
    })) as ActivityResponse;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    throw error;
  }
  console.log("Response from API:", response);
  if (!response || !response.data) {
    notFound();
  }

  return (
    <main>
      <ConfirmSection
        zaloGroup={response.data?.zaloGroup}
        activityName={response.data?.activityName}
      />
    </main>
  );
}
