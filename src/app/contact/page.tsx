import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail } from "lucide-react";
import EmbeddedMap from "@/features/contact/ui/EmbeddedMap";
import { fetchContactPageFields } from "@/features/contact/api/contactPage.api";
import { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import PageHeader from "@/shared/layout/PageHeader";
import { Button } from "@/shared/ui/button";

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
  const openMapLabel =
    locale === "vi" ? "Mở trong Google Maps" : "Open in Google Maps";
  const mapDirectionsLink =
    "https://www.google.com/maps/place/Ni+Vi%E1%BB%87n+Vi%C3%AAn+Kh%C3%B4ng+(Therav%C4%81da)/@10.5594248,107.1068609,15z";

  const contactDetails = [
    {
      icon: MapPin,
      label: tFooter("address"),
      value: fieldsResponse.data?.address,
      href: undefined,
    },
    {
      icon: Phone,
      label: tFooter("phone"),
      value: fieldsResponse.data?.phoneNumber,
      href: fieldsResponse.data?.phoneNumber
        ? `tel:${fieldsResponse.data.phoneNumber.replace(/\s+/g, "")}`
        : undefined,
    },
    {
      icon: Mail,
      label: tFooter("email"),
      value: fieldsResponse.data?.emailPrimary,
      href: fieldsResponse.data?.emailPrimary
        ? `mailto:${fieldsResponse.data.emailPrimary}`
        : undefined,
    },
    {
      icon: Mail,
      label: tFooter("email") + " 2",
      value: fieldsResponse.data?.emailSecondary,
      href: fieldsResponse.data?.emailSecondary
        ? `mailto:${fieldsResponse.data.emailSecondary}`
        : undefined,
    },
  ];

  return (
    <div className="page-container pb-16 md:pb-20">
      <PageHeader title={t("title")} className="mb-8 md:mb-10" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-primary/10 bg-card p-5 md:p-6 shadow-sm">
            <div className="space-y-5">
              {contactDetails.map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary/80 group-hover:bg-primary/15 transition-colors duration-300">
                    <item.icon size={18} strokeWidth={1.6} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="block text-base md:text-lg font-serif text-foreground hover:text-primary transition-colors duration-200 break-words"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <p className="text-base md:text-lg font-serif text-foreground break-words">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-primary/10 bg-card p-3 md:p-4 shadow-sm">
            <EmbeddedMap
              iframeTitle={
                locale === "vi" ? "Bản đồ đến Ni Viện" : "Map to the Nunnery"
              }
              className="min-w-0 md:min-w-0 w-full h-[320px] lg:h-[420px] aspect-auto rounded-xl border border-primary/10 shadow-none"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground italic">
                * {t("map-caption")}
              </p>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                <Link
                  href={mapDirectionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={openMapLabel}
                >
                  {openMapLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
