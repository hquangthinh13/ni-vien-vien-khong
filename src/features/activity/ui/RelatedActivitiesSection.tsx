import type { Activity } from "../model/activity.types";
import type { Locale } from "@/types/locale";
import RelatedContentList from "@/shared/layout/RelatedContentList";

interface RelatedActivitiesProps {
  activities: Activity[];
  locale: Locale;
}

export default function RelatedActivitiesSection({
  activities,
  locale,
}: RelatedActivitiesProps) {
  return (
    <RelatedContentList
      title={locale === "vi" ? "Liên quan" : "Related activities"}
      locale={locale}
      items={activities.map((item) => ({
        key: item.documentId,
        href: `/activity/${item.slug}-${item.documentId}`,
        title: item.activityName || "Untitled activity",
        date: item.publishedAt || item.createdAt,
      }))}
    />
  );
}
