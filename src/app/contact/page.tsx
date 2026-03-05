import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail } from "lucide-react";
import EmbeddedMap from "@/features/contact/ui/EmbeddedMap";
import lineOrnament from "@/public/ornament-01.svg";
import { fetchContactPageFields } from "@/features/contact/api/contactPage.api";
import { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đường đến Ni Viện",
};
const Contact = async () => {
  const locale = (await getLocale()) as Locale;

  const fieldsResponse = await fetchContactPageFields({
    locale,
    fields: ["address", "phoneNumber", "emailPrimary", "emailSecondary"],
  });
  const t = await getTranslations("ContactPage");
  const tFooter = await getTranslations("Footer");

  const contactDetails = [
    {
      icon: MapPin,
      label: tFooter("address"),
      value: fieldsResponse.data?.address,
    },
    {
      icon: Phone,
      label: tFooter("phone"),
      value: fieldsResponse.data?.phoneNumber,
    },
    {
      icon: Mail,
      label: tFooter("email"),
      value: fieldsResponse.data?.emailPrimary,
    },
    {
      icon: Mail,
      label: tFooter("email") + " 2",
      value: fieldsResponse.data?.emailSecondary,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
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
