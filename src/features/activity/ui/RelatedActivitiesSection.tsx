import React from "react";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { useLocale } from "next-intl";
import { formatFriendlyDate } from "@/shared/lib/utils";
import { Activity } from "../model/activity.types";
import { Locale } from "@/types/locale";

interface RelatedActivitiesProps {
  activities: Activity[];
}

const RelatedActivitiesSection = ({ activities }: RelatedActivitiesProps) => {
  const locale = useLocale() as Locale;
  console.log("RelatedActivities - activities prop:", activities);
  if (!activities || activities.length === 0) return null;
  return (
    <section className="space-y-4">
      <span className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
        <ScrollText size={20} className="text-primary" /> Liên quan
      </span>
      <div className="space-y-6">
        {activities.map((item) => (
          <Link
            key={item.documentId}
            href={`/activity/${item.slug}-${item.documentId}`}
            className="group block"
          >
            <div className="flex gap-2 ">
              <div className="flex flex-col justify-start flex-1 gap-1">
                <span className="flex text-[10px] md:text-xs text-muted-foreground items-center font-mono">
                  {item?.publishedAt
                    ? formatFriendlyDate(item.publishedAt, locale)
                    : ""}
                </span>
                <h5 className="flex text-sm md:text-md font-bold group-hover:text-primary transition-colors leading-tight">
                  {item.activityName}
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
