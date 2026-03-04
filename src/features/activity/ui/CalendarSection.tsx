import React from "react";
import Image from "next/image";
import EventCalendar from "@/features/activity/ui/EventCalendar";
import calendarBackground from "@/public/calendar-bg.jpg";
import UpcomingEventCard from "./UpcomingEventCard";
import calendarDecoration01 from "@/public/calendar-decoration.png";
import calendarDecoration02 from "@/public/calendar-decoration-01.png";
import ornament from "@/public/ornament-01.svg";
const CalendarSection = async () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border">
      {/* Background */}
      <Image
        src={calendarBackground}
        alt="Desktop Background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="hidden origin-top scale-75 lg:scale-100 lg:block absolute left-[10%] -translate-x-1/2 top-0 z-20 pointer-events-none">
        <Image
          src={calendarDecoration01}
          alt="Character"
          width={260}
          height={260}
          className="drop-shadow-xl object-cover w-72 h-auto"
        />
      </div>
      <div className="hidden lg:block absolute -bottom-5 -right-10 z-20 pointer-events-none">
        <Image
          src={calendarDecoration02}
          alt="Decoration"
          width={260}
          height={260}
          className="w-64 h-auto drop-shadow-xl scale-x-[-1]"
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
          <span className="font-serif text-2xl text-center font-bold uppercase text-primary">
            Lịch hoạt động trong tháng
          </span>{" "}
          <p className="text-center text-md text-secondary-foreground leading-0 italic">
            (Chọn ngày có khoanh tròn để xem lịch)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-0 lg:gap-6">
          <div className="flex-1 p-3">
            <UpcomingEventCard />
          </div>
          <div className="flex min-h-[500px] items-center lg:items-start justify-center">
            <EventCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
