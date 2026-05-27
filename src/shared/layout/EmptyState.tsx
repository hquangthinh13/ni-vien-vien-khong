import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-card/60 px-4 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {message}
    </div>
  );
}
