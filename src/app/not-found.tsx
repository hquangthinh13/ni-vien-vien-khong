"use client";
import Link from "next/link";
import React from "react";
import { Button } from "@/shared/ui/button"; // Giả sử bạn dùng Shadcn
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-serif text-primary/20 absolute -z-10 select-none">
        404
      </h1>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium tracking-widest uppercase font-serif">
          Chưa tìm thấy thiện duyên
        </h2>

        <p className="text-muted-foreground max-w-md mx-auto italic">
          Trang bạn đang tìm kiếm hiện không tồn tại hoặc đã được dời đi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            asChild
            className="rounded-full tracking-widest uppercase text-xs"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home size={16} /> Trở về trang chủ
            </Link>
          </Button>

          {/* Nút quay lại trang trước đó bằng client-side (cần "use client" nếu dùng window.history) */}
          <Button
            variant="ghost"
            onClick={() =>
              typeof window !== "undefined" && window.history.back()
            }
            className="text-xs uppercase tracking-widest"
          >
            Quay lại trang trước
          </Button>
        </div>
      </div>
    </div>
  );
}
