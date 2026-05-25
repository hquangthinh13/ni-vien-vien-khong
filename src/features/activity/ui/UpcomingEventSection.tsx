import React from "react";
import type { Locale } from "@/types/locale";
import { fetchActiveActivities } from "../api/activity.api";
import UpdatedActivityVibrantCard from "./UpdatedActivityVibrantCard";

const UpcomingEventSection = async ({ locale }: { locale: Locale }) => {
  try {
    const response = await fetchActiveActivities({
      locale,
      populate: "*",
      sort: ["activityStartDate:asc"],
      pagination: { page: 1, pageSize: 1 },
    });
    // console.log("Fetched upcoming activities:", response);
    const activities = Array.isArray(response?.data)
      ? response.data
      : response?.data
        ? [response.data]
        : [];

    if (activities.length === 0)
      return (
        <section className="w-full">
          <h2 className="text-xl text-center font-serif font-black mb-4 tracking-tighter text-foreground">
            {locale === "vi" ? "Sự kiện sắp diễn ra" : "Upcoming Events"}
          </h2>
          <p className="text-center text-secondary-foreground text-md font-mono">
            {locale === "vi"
              ? "Hiện chưa có sự kiện sắp diễn ra."
              : "No upcoming events at the moment."}
          </p>
        </section>
      );

    return (
      <section className="w-full">
        <h2 className="text-xl text-center font-serif font-black mb-4 tracking-tighter text-foreground">
          {locale === "vi" ? "Sự kiện sắp diễn ra" : "Upcoming Events"}
        </h2>

        <div className="grid grid-cols-1 gap-4 px-4 md:px-0">
          {activities.map((item) => (
            <UpdatedActivityVibrantCard
              key={item.documentId}
              activity={item}
              locale={locale}
            />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to fetch activities on server:", error);
    return null;
  }
};

export default UpcomingEventSection;
