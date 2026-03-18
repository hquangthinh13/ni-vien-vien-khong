import React from "react";
import { format, parseISO } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { Locale } from "@/types/locale";

interface DateCardProps {
  dateISO: string;
  locale: Locale;
  headerColor?: string;
}

const DateCard: React.FC<DateCardProps> = ({
  dateISO,
  locale,
  headerColor,
}) => {
  const date = parseISO(dateISO);
  const dateLocale = locale === "en" ? enUS : vi;

  const monthRaw = format(date, "MMM", { locale: dateLocale });

  let monthDisplay = "";
  if (locale === "vi") {
    const monthNumber = monthRaw.match(/\d+/)?.[0] || "";
    monthDisplay = `T${monthNumber}`;
  } else {
    monthDisplay = monthRaw;
  }

  const day = format(date, "dd");
  //   const weekday = format(date, "EEE", { locale: dateLocale })
  //     .replace(".", "")
  //     .toUpperCase();
  const year = format(date, "yyyy");

  return (
    <div className="flex flex-col items-center justify-between w-14 h-full bg-white rounded-lg shadow-xl overflow-hidden">
      <div
        style={{ backgroundColor: headerColor || "var(--primary)" }}
        className="w-full text-xs tracking-wider font-mono font-bold text-white text-center py-1 leading-none uppercase"
      >
        {monthDisplay}
      </div>

      <div className="text-lg font-bold text-secondary-foreground leading-none pt-2 pb-1">
        {day}
      </div>

      <div className="w-full text-xs font-medium font-mono text-muted-foreground text-center pb-1.5 leading-none">
        {year}
      </div>
    </div>
  );
};

export default DateCard;
