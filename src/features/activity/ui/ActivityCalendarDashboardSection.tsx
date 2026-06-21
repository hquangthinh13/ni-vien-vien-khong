import Image from "next/image";
import type { Locale } from "@/types/locale";
import ornament from "@/public/ornament-01.svg";
import ActivityCalendarDashboard from "./ActivityCalendarDashboard";

interface ActivityCalendarDashboardSectionProps {
  locale: Locale;
}

export default function ActivityCalendarDashboardSection({
  locale,
}: ActivityCalendarDashboardSectionProps) {
  return (
    <section className="w-full">
      {/* <div className="flex w-full flex-col items-start">
        
        <h2 className="home-page-section-title mb-4">
          {locale === "vi"
            ? "Lịch hoạt động trong tháng"
            : "Monthly Activity Calendar"}
        </h2>
      </div> */}

      <ActivityCalendarDashboard locale={locale} />
    </section>
  );
}
