import type { Activity } from "@/features/activity/model/activity.types";
import type { Locale } from "@/types/locale";
import HomeSectionHeader from "./HomeSectionHeader";
import HomeFeaturedActivityCard from "./HomeFeaturedActivityCard";
import HomeCompactActivityCard from "./HomeCompactActivityCard";

interface HomeEditorialNewsProps {
  activities: Activity[];
  locale: Locale;
}

export default function HomeEditorialNews({
  activities,
  locale,
}: HomeEditorialNewsProps) {
  if (activities.length === 0) return null;

  const featured = activities[0];
  const headlineActivities = activities.slice(1, 8);

  return (
    <section>
      <HomeSectionHeader
        title={locale === "vi" ? "Tin tức mới nhất" : "Latest Activities"}
        href="/activity"
        locale={locale}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <HomeFeaturedActivityCard activity={featured} locale={locale} />
        </div>

        {headlineActivities.length > 0 ? (
          <div className="border-t border-border/70 lg:col-span-5 lg:border-t-0">
            {headlineActivities.map((activity, index) => (
              <HomeCompactActivityCard
                key={activity.documentId}
                activity={activity}
                locale={locale}
                showDivider={index !== headlineActivities.length - 1}
              />
            ))}
          </div>
        ) : null}
      </div>

    </section>
  );
}
