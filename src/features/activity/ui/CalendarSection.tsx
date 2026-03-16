import React from "react";
import Image from "next/image";
import EventCalendar from "@/features/activity/ui/EventCalendar";
import calendarBackground from "@/public/calendar-bg.jpg";
import UpcomingEventSection from "./UpcomingEventSection";
import calendarDecoration01 from "@/public/calendar-decoration.png";
import calendarDecoration02 from "@/public/calendar-decoration-01.png";
import ornament from "@/public/ornament-01.svg";
import type { Locale } from "@/types/locale";
const CalendarSection = async ({ locale }: { locale: Locale }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border">
      {/* Background */}
      <Image
        src={calendarBackground}
        alt="Desktop Background"
        fill
        className="object-cover -z-10"
        priority
        placeholder="blur"
      />
      <div className="hidden origin-top scale-75 lg:scale-100 lg:block absolute left-[10%] -translate-x-1/2 top-0 z-20 pointer-events-none">
        <Image
          src={calendarDecoration01}
          alt="Character"
          width={260}
          height={260}
          className="drop-shadow-xl object-cover w-80 h-auto"
        />
      </div>
      <div className="hidden lg:block absolute -bottom-5 -right-10 z-20 pointer-events-none">
        <Image
          src={calendarDecoration02}
          alt="Decoration"
          width={260}
          height={260}
          className="w-80 h-auto drop-shadow-xl scale-x-[-1]"
        />
      </div>
      {/* Content */}
      <div className="relative flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 mt-6 mb-4">
          <div className="flex items-center justify-center">
            <Image
              src={ornament}
              alt="Ornament"
              width={32}
              height={32}
              className="object-cover w-8 h-auto opacity-70"
            />
          </div>
          <div className="flex items-center justify-center w-fit mx-auto">
            {" "}
            <h2 className="home-page-section-title">
              {locale === "vi"
                ? "Lịch hoạt động trong tháng"
                : "Monthly Activity Calendar"}
            </h2>{" "}
          </div>

          <p className="text-center text-xs uppercase tracking-wide text-secondary-foreground font-mono">
            {locale === "vi"
              ? "Chọn ngày có khoanh tròn để xem lịch"
              : "Select a date with a circle to view the schedule"}
          </p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-0 lg:gap-4">
          <div className="flex-1 w-full p-3">
            <UpcomingEventSection locale={locale} />
          </div>
          <div className="flex lg:min-h-125 items-center lg:items-start justify-center">
            <EventCalendar locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
