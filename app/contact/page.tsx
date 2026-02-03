import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import EmbeddedMap from "@/components/ContactPage/EmbeddedMap";
import lineOrnament from "@/public/ornament-01.svg";

const Contact = () => {
  const t = useTranslations("ContactPage");
  const tFooter = useTranslations("Footer");

  const contactDetails = [
    {
      icon: MapPin,
      label: tFooter("contact"),
      value: tFooter("address-01"),
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+84 97 446 99 63",
    },
    {
      icon: Mail,
      label: "Email",
      value: "lieuphap@gmail.com",
    },
    {
      icon: Mail,
      label: "Email 2",
      value: "nivienvienkhong2019@gmail.com",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 my-6">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-xl uppercase tracking-wider whitespace-nowrap relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-0">
          {t("title")}
        </h2>{" "}
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6 space-y-8 h-fit">
          <div className="space-y-6">
            {contactDetails.map((item, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm md:text-base font-medium">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 w-full h-full min-h-[100px]">
          <EmbeddedMap />
          <p className="mt-4 text-xs text-center text-muted-foreground italic">
            * {t("map-caption")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
