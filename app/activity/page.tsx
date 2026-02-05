import ActivityCard from "@/components/Activity/ActivityCard";
import { fetchActivities } from "@/components/Activity/Activity.service";
import { getLocale } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();

  const allActivities = await Promise.all([
    fetchActivities({
      locale,
      pagination: { page: 1, pageSize: 5 },
      sort: "activityDate:desc",
      populate: "coverImage",
    }),
  ]);

  const activities = Array.isArray(allActivities[0].data)
    ? allActivities[0].data
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 ">
      <div className="flex flex-1 flex-col gap-6 justify-between items-center mb-24">
        <h2 className="font-bold text-lg tracking-widest uppercase relative">
          Tin tức
        </h2>

        <div className=" mx-auto px-0 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.documentId} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
