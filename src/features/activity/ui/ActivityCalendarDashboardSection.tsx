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
      <div className="flex w-full flex-col items-center">
        <Image
          src={ornament}
          alt="Ornament"
          width={32}
          height={32}
          className="h-6 w-auto opacity-75 mb-4"
        />
        <h2 className="home-page-section-title mb-4">
          {locale === "vi"
            ? "Lịch hoạt động trong tháng"
            : "Monthly Activity Calendar"}
        </h2>
      </div>

      <ActivityCalendarDashboard locale={locale} />
    </section>
  );
}
