import React from "react";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { Ritual } from "../model/ritual.types";
import { DEFAULT_LOCALE, type Locale } from "@/types/locale";
import DateTimeDisplay from "@/shared/ui/DateTimeDisplay";

interface RelatedRitualsProps {
  rituals: Ritual[];
  locale?: Locale;
}

const RelatedRitualsSection = ({ rituals, locale }: RelatedRitualsProps) => {
  // console.log("RelatedRituals - activities prop:", activities);
  const localeToUse = locale ?? DEFAULT_LOCALE;
  if (!rituals || rituals.length === 0) return null;
  return (
    <section className="space-y-4 mt-6">
      <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
        <ScrollText size={20} className="text-primary" />
        {localeToUse === "en" ? "Related Rituals" : "Nghi thức liên quan"}
      </h3>
      <div className="space-y-6">
        {rituals.map((item) => (
          <Link
            key={item.documentId}
            href={`library/ritual/${item.documentId}`}
            className="group block"
          >
            <div className="flex gap-2 ">
              <div className="flex flex-col justify-start flex-1 gap-1">
                <DateTimeDisplay
                  dateString={item?.publishedAt}
                  locale={localeToUse}
                />
                <h5 className="flex text-sm md:text-md font-bold group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedRitualsSection;
