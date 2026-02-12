"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { format, isSameDay, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

export interface MyEvent {
  documentId: string;
  title: string;
  start: Date;
  end?: Date;
  type: "course" | "activity";
}

interface EventCalendarProps {
  events: MyEvent[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const selectedDayMeetings = events.filter((event) =>
    date ? isSameDay(event.start, date) : false,
  );

  const handleDayClick = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const hasEvents = events.some((e) => isSameDay(e.start, selectedDate));
      if (hasEvents) setPopoverOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-start">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDayClick}
              locale={vi}
              showOutsideDays={true}
              className="rounded-none bg-none"
              classNames={{
                root: "w-xs md:w-md",
                day: "p-0",
                table:
                  "w-full border-separate border-spacing-x-2 border-spacing-y-2 table-fixed",
                caption_label: "text-lg font-bold font-serif",
                weekday:
                  "text-foreground rounded-md flex-1 font-normal text-sm select-none",
              }}
              modifiers={{
                hasEvent: (day) => events.some((m) => isSameDay(m.start, day)),
              }}
              modifiersClassNames={{
                hasEvent:
                  "[&_button]:border [&_button]:border-primary [&_button]:rounded-full",
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          align="center"
          side={isLargeScreen ? "left" : "bottom"}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">
                Sự kiện ngày{" "}
                {date ? format(date, "dd/MM/yyyy", { locale: vi }) : ""}
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {selectedDayMeetings.length > 0 ? (
                selectedDayMeetings.map((event) => (
                  <MeetingItem key={event.documentId} event={event} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Không có sự kiện nào cho ngày này.
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function MeetingItem({ event }: { event: MyEvent }) {
  return (
    <Card
      className={`flex flex-1 p-0 border-l-4 border-l-primary ${event.type === "course" ? "border-l-primary" : "border-l-secondary"}`}
    >
      <CardContent className="p-3 w-full">
        <p className="font-medium text-sm">{event.title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {format(event.start, "dd/MM/yyyy HH:mm")}
          {event.end && ` - ${format(event.end, "dd/MM/yyyy HH:mm")}`}
        </p>
      </CardContent>
    </Card>
  );
}
