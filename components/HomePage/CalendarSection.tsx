import React from "react";
import Image from "next/image";
import EventCalendar from "@/components/News/EventCalendar";
import calendarBackground from "@/public/calendar-background.svg";

import calendarShape from "@/public/calendar-shape.png";
import calendarCharacter from "@/public/calendar-character.png";
import calendarDecoration01 from "@/public/calendar-decoration.png";
import calendarDecoration02 from "@/public/calendar-decoration-01.png";
const CalendarSection = () => {
  return (
    <div className="max-w-6xl min-h-128 mx-auto relative flex w-full border justify-center md:justify-center items-start rounded-lg p-0 overflow-hidden">
      <Image src={calendarShape} alt="Background" className="w-full h-auto" />
      <Image
        src={calendarBackground}
        alt="Background"
        fill
        className="object-cover -z-10"
      />{" "}
      <div
        className="hidden md:block absolute lg:left-[40%] -translate-x-1/2 bottom-4 z-10 
                md:left-[30%] scale-75 lg:scale-100 "
      >
        <Image
          src={calendarCharacter}
          alt="Character"
          width={280}
          height={280}
          className="drop-shadow-xl"
        />
      </div>
      <div className="hidden origin-top scale-75 lg:scale-100 md:block absolute md:left-[48%] lg:left-[59%] -translate-x-1/2 top-0 z-20 pointer-events-none">
        <Image
          src={calendarDecoration01}
          alt="Character"
          width={260}
          height={260}
          className="drop-shadow-xl"
        />
      </div>
      <div className="hidden scale-75 lg:scale-100 origin-right md:block absolute -right-12 top-[80%] -translate-y-1/2 z-20 pointer-events-none">
        <Image
          src={calendarDecoration02}
          alt="Character"
          width={260}
          height={260}
          className="drop-shadow-xl scale-x-[-1]"
        />
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center md:justify-end md:pr-32 ">
        <EventCalendar />
      </div>
    </div>
  );
};

export default CalendarSection;
