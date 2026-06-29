import React from "react";
import { ScrollText } from "lucide-react";
import { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";
import CourseSidebarCard from "@/features/activity/ui/CourseSidebarCard";
import Link from "next/link";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";
interface RelatedActivitiesProps {
  activities: Activity[];
  locale: Locale;
}

const RelatedActivitiesSection = ({
  activities,
  locale,
}: RelatedActivitiesProps) => {
  if (!activities || activities.length === 0) return null;
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold uppercase tracking-wider">
        <ScrollText size={20} className="text-primary" />
        {locale === "vi" ? "Liên quan" : "Related activities"}
      </h3>
      <div className="space-y-6">
        {activities.map((item: Activity) => (
          <Link
            key={item.documentId}
            href={`/activity/${item.slug}-${item.documentId}`}
            className="group block"
          >
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <DateTimeDisplay
                  dateString={item?.publishedAt || item?.createdAt}
                  locale={locale}
                />
                <h5 className="flex text-sm font-bold leading-tight transition-colors group-hover:text-primary md:text-md">
                  {item.activityName || "Untitled Course"}
                </h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedActivitiesSection;
