import React from "react";
import { ScrollText } from "lucide-react";
import { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";
import CourseSidebarCard from "@/features/activity/ui/CourseSidebarCard";
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
      <span className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
        <ScrollText size={20} className="text-primary" />{" "}
        {locale === "vi" ? "Liên quan" : "Related activities"}
      </span>
      <div className="space-y-2">
        {activities.map((item: Activity) => (
          <CourseSidebarCard
            key={item.documentId}
            course={item}
            locale={locale}
            hasImage={false}
            shortenContent={true}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedActivitiesSection;
