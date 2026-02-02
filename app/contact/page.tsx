import React from "react";
import EmbeddedMap from "@/components/Contact/EmbeddedMap";
import { useTranslations } from "next-intl";
import Image from "next/image";
import lineOrnament from "@/public/ornament-02.svg";

const Contact = () => {
  const t = useTranslations("Contact");

  return (
    <div className="mx-auto max-w-6xl px-4 w-full">
      <div className="flex flex-1 w-full flex-col gap-6 justify-between mt-12 items-center">
        <div className="flex flex-1 justify-center opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-8" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-widest uppercase whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            {t("title")}
          </h2>
        </div>

        <div className="flex w-full border"></div>
      </div>
    </div>
  );
};

export default Contact;
