"use client";

import * as React from "react";
import { Copy, Share2 } from "lucide-react";
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
  description,
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
          title: "Chia sẻ bài viết",
          description: "Gửi bài viết này đến bạn bè qua mạng xã hội.",
          facebook: "Facebook",
          zalo: "Zalo",
          copy: "Sao chép liên kết",
          copySuccess: "Đã sao chép liên kết bài viết.",
          copyError: "Không thể sao chép liên kết. Vui lòng thử lại.",
          openError: "Không thể mở cửa sổ chia sẻ. Vui lòng thử lại.",
        }
      : {
          title: "Share this post",
          description: "Send this article to friends through social networks.",
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
      aria-labelledby="activity-share-title"
      className={cn(
        "mt-10 border-t border-primary/10 pt-5 text-left",
        className,
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/5 text-primary">
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2
            id="activity-share-title"
            className="font-serif text-lg font-bold text-foreground"
          >
            {labels.title}
          </h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {description || labels.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareFacebook}
          className="rounded-lg border-primary/15 bg-card/70 text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <SiFacebook className="h-4 w-4" aria-hidden="true" />
          {labels.facebook}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareZalo}
          className="rounded-lg border-primary/15 bg-card/70 text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <SiZalo className="h-4 w-4" aria-hidden="true" />
          {labels.zalo}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          {labels.copy}
        </Button>
      </div>
    </section>
  );
}
