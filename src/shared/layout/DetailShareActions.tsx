"use client";

import { Copy } from "lucide-react";
import { SiFacebook, SiZalo } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

export interface DetailShareActionsProps {
  title: string;
  url: string;
  locale: Locale;
  description?: string;
  className?: string;
}

const SHARE_LINKS = {
  facebook: "https://www.facebook.com/sharer/sharer.php?u=",
  zalo: "https://zalo.me/share?u=",
} as const;

export default function DetailShareActions({
  title,
  url,
  locale,
  className,
}: DetailShareActionsProps) {
  const labels =
    locale === "vi"
      ? {
          title: "Chia sẻ",
          facebook: "Facebook",
          zalo: "Zalo",
          copy: "Sao chép liên kết",
          copySuccess: "Đã sao chép liên kết.",
          copyError: "Không thể sao chép liên kết. Vui lòng thử lại.",
        }
      : {
          title: "Share",
          facebook: "Facebook",
          zalo: "Zalo",
          copy: "Copy link",
          copySuccess: "Link copied.",
          copyError: "Could not copy the link. Please try again.",
        };

  const openShareWindow = (targetUrl: string) => {
    window.open(
      targetUrl,
      "_blank",
      "noopener,noreferrer,width=720,height=560",
    );
  };

  const getShareUrl = () => window.location.href || url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      toast.success(labels.copySuccess);
    } catch {
      toast.error(labels.copyError);
    }
  };

  return (
    <section
      aria-label={labels.title}
      className={cn("mt-8 border-t border-primary/10 pt-3 text-left", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wide text-primary">
          {labels.title}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              const encodedUrl = encodeURIComponent(getShareUrl());
              openShareWindow(`${SHARE_LINKS.facebook}${encodedUrl}`);
            }}
            aria-label={labels.facebook}
            title={labels.facebook}
          >
            <SiFacebook aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              const encodedUrl = encodeURIComponent(getShareUrl());
              const encodedTitle = encodeURIComponent(title);
              openShareWindow(
                `${SHARE_LINKS.zalo}${encodedUrl}&title=${encodedTitle}`,
              );
            }}
            aria-label={labels.zalo}
            title={labels.zalo}
          >
            <SiZalo aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleCopyLink}
            aria-label={labels.copy}
            title={labels.copy}
          >
            <Copy aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
