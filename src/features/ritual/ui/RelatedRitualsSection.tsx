import React from "react";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { formatFriendlyDate } from "@/shared/lib/utils";
import { Ritual } from "../model/ritual.types";
import { Locale } from "@/types/locale";

interface RelatedRitualsProps {
  rituals: Ritual[];
  locale?: Locale;
}

const RelatedRitualsSection = ({ rituals, locale }: RelatedRitualsProps) => {
  // console.log("RelatedRituals - activities prop:", activities);
  const localeToUse = locale as Locale;
  if (!rituals || rituals.length === 0) return null;
  return (
    <section className="space-y-4">
      <h3 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 border-b pb-2">
        <ScrollText size={20} className="text-primary" /> Liên quan
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
                <span className="flex text-[10px] md:text-xs text-muted-foreground items-center">
                  {item?.publishedAt
                    ? formatFriendlyDate(item.publishedAt, localeToUse)
                    : ""}
                </span>
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
