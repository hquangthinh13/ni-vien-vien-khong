import React from "react";
import Image from "next/image";
import EventCalendar from "@/features/activity/ui/EventCalendar";
import calendarBackground from "@/public/calendar-base.png";
import calendarBackgroundMobile from "@/public/calendar-bg.jpg";
import mainImage from "@/public/test_img.jpg";
import calendarCharacter from "@/public/calendar-character.png";
import calendarDecoration01 from "@/public/calendar-decoration.png";
import calendarDecoration02 from "@/public/calendar-decoration-01.png";

import { MyEvent } from "@/features/activity/ui/EventCalendar";

const CalendarSection = async () => {
  return (
    <div className=" max-w-7xl lg:aspect-video aspect-square min-h-128 mx-auto relative flex w-full border justify-center lg:justify-center items-start rounded-lg p-0 overflow-hidden">
      <div className="absolute -left-10 top-0 -z-20 h-[54%] aspect-video shadow-lg rounded-sm overflow-hidden">
        <Image
          src={mainImage}
          alt="Corner Decoration"
          fill
          sizes="28vw"
          className="object-cover "
        />
      </div>{" "}
      <Image
        src={calendarBackground}
        alt="Desktop Background"
        fill
        className="hidden lg:block object-cover -z-10"
        loading="eager"
      />
      <Image
        src={calendarBackgroundMobile}
        alt="Mobile Background"
        fill
        className="block lg:hidden object-cover -z-10 opacity-100"
      />
      <div
        className="hidden lg:block absolute lg:left-[33%] -translate-x-1/2 bottom-[25%] z-10
                lg:scale-150 "
      >
        <Image
          src={calendarCharacter}
          alt="Character"
          width={280}
          height={280}
          className="object-cover"
        />
      </div>
      <div className="hidden origin-top scale-75 lg:scale-120 lg:block absolute left-[8%] -translate-x-1/2 top-0 z-20 pointer-events-none">
        <Image
          src={calendarDecoration01}
          alt="Character"
          width={260}
          height={260}
          className="drop-shadow-xl"
        />
      </div>
      {/* <div className="hidden lg:scale-110 origin-right lg:block absolute -right-9 top-[90%] -translate-y-1/2 z-20 pointer-events-none">
          <Image
            src={calendarDecoration02}
            alt="Character"
            width={260}
            height={260}
            className="drop-shadow-xl scale-x-[-1]"
          />
        </div> */}
      <div className="absolute inset-0 flex px-4 lg:py-24 h-full items-center lg:items-start justify-center lg:justify-end md:pr-8">
        <div className="flex mt-[5vh] lg:mt-[2vh]">
          <div className="flex gap-4 flex-col min-h-[426.2px]">
            <div className="flex flex-col gap-2">
              <span className="font-serif text-2xl text-center font-bold uppercase text-primary">
                Lịch hoạt động trong tháng
              </span>
              <p className="text-center text-md text-secondary-foreground italic">
                (Chọn ngày có khoanh tròn để xem lịch)
              </p>
            </div>
            {/* <EventCalendar events={events} />{" "} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
