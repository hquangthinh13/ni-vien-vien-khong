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
    imageUrl: "https://images.unsplash.com/...",
    startDatetime: "2026-01-29T13:00",
    endDatetime: "2026-01-30T14:30",
  },
  {
    id: 2,
    name: "Le Phat Dan",
    imageUrl: "https://images.unsplash.com/...",
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
    <div className="flex flex-col md:flex-row gap-8 p-6 justify-center items-start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={vi}
        showOutsideDays={true}
        className="rounded-md border"
        classNames={{
          day: "mx-1 my-0 rounded-full h-12 w-12 p-0 aspect-square",
          table: "w-full border-separate border-spacing-0",
          caption_label: "text-md font-bold",
          today: "border rounded-full",
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

      <section className="w-full max-w-md">
        <h2 className="text-md font-semibold text-stone-800 mb-4">
          Sự kiện ngày {date ? format(date, "dd/MM/yyyy") : "đang chọn..."}
        </h2>

        <div className="space-y-4">
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
      </section>
    </div>
  );
}

function MeetingItem({ meeting }: { meeting: any }) {
  const start = parseISO(meeting.startDatetime);
  const end = parseISO(meeting.endDatetime);

  return (
    <Card className="flex items-center space-x-4 p-4 hover:bg-stone-50 transition-colors border-stone-100">
      <div className="flex-1">
        <h4 className="font-medium text-stone-900">{meeting.name}</h4>
        <p className="text-sm text-stone-500">
          {format(start, "HH:mm")} - {format(end, "HH:mm")}
        </p>
      </div>
    </Card>
  );
}
