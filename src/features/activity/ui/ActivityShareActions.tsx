"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { SiFacebook, SiZalo } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

interface ActivityShareActionsProps {
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

export default function ActivityShareActions({
  title,
  url,
  locale,
  className,
}: ActivityShareActionsProps) {
  const [currentUrl, setCurrentUrl] = React.useState(url);
  const shareUrl = currentUrl || url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const labels =
    locale === "vi"
      ? {
          title: "Chia sẻ",
          facebook: "Facebook",
          zalo: "Zalo",
          copy: "Sao chép liên kết",
          copySuccess: "Đã sao chép liên kết bài viết.",
          copyError: "Không thể sao chép liên kết. Vui lòng thử lại.",
          openError: "Không thể mở cửa sổ chia sẻ. Vui lòng thử lại.",
        }
      : {
          title: "Share",
          facebook: "Facebook",
          zalo: "Zalo",
          copy: "Copy link",
          copySuccess: "Article link copied.",
          copyError: "Could not copy the link. Please try again.",
          openError: "Could not open the share window. Please try again.",
        };

  const openShareWindow = (targetUrl: string) => {
    const popup = window.open(
      targetUrl,
      "_blank",
      "noopener,noreferrer,width=720,height=560",
    );

    if (!popup) {
      toast.error(labels.openError);
    }
  };

  const handleShareFacebook = () => {
    openShareWindow(`${SHARE_LINKS.facebook}${encodedUrl}`);
  };

  const handleShareZalo = () => {
    openShareWindow(`${SHARE_LINKS.zalo}${encodedUrl}&title=${encodedTitle}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(labels.copySuccess);
    } catch {
      toast.error(labels.copyError);
    }
  };

  return (
    <section
      aria-label={labels.title}
      className={cn("mt-6 border-t border-primary/10 pt-3 text-left", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-wide text-primary">
          {labels.title}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleShareFacebook}
            aria-label={labels.facebook}
            title={labels.facebook}
          >
            <SiFacebook aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleShareZalo}
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
