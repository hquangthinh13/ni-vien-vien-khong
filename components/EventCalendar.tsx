"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data
const meetings = [
  {
    id: 1,
    name: "Le Phat Dan",
    startDatetime: "2026-01-29T13:00",
    endDatetime: "2026-01-30T14:30",
  },
  {
    id: 2,
    name: "Khóa tu mùa hè ",
    startDatetime: "2026-01-25T13:00",
    endDatetime: "2026-01-25T14:30",
  },
  {
    id: 3,
    name: "Lễ hội",
    startDatetime: "2026-01-25T13:00",
    endDatetime: "2026-01-25T14:30",
  },
];

export default function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDayMeetings = meetings.filter((meeting) =>
    date ? isSameDay(parseISO(meeting.startDatetime), date) : false,
  );

  return (
    <div className="flex flex-col gap-4 justify-center items-start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={vi}
        showOutsideDays={true}
        // className="rounded-md bg-transparent border-none "
        className="rounded-lg"
        classNames={{
          day: "mx-1 my-0 rounded-full h-10 w-10 p-0 aspect-square",
          table: "w-full border-separate border-spacing-0",
          caption_label: "text-md font-bold",
          today: "border rounded-full",
          weekday:
            "text-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
        }}
        // style cho những ngày có sự kiện
        modifiers={{
          hasEvent: (day) =>
            meetings.some((m) => isSameDay(parseISO(m.startDatetime), day)),
        }}
        modifiersClassNames={{
          hasEvent:
            "border border-primary font-semibold [&_button]:text-primary",
        }}
      />

      {/* <section className="flex flex-col w-full max-w-md">
        <h2 className="text-md font-semibold text-stone-800 mb-4">
          Sự kiện ngày {date ? format(date, "dd/MM/yyyy") : "đang chọn..."}
        </h2>

        <div className="flex flex-col gap-2">
          {selectedDayMeetings.length > 0 ? (
            selectedDayMeetings.map((meeting) => (
              <MeetingItem key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <p className="text-stone-500 italic">
              Không có sự kiện nào cho ngày này.
            </p>
          )}
        </div>
      </section> */}
    </div>
  );
}
interface Meeting {
  id: number;
  name: string;
  startDatetime: string;
  endDatetime: string;
}
function MeetingItem({ meeting }: { meeting: Meeting }) {
  const start = parseISO(meeting.startDatetime);
  const end = parseISO(meeting.endDatetime);

  return (
    <Card className="flex flex-1 p-0 transition-colors">
      <CardContent className="p-4">
        <span className="font-medium text-primary">{meeting.name}</span>
        <p className="text-xs text-muted-foreground">
          {format(start, "HH:mm")} - {format(end, "HH:mm")}
        </p>
      </CardContent>
    </Card>
  );
}
