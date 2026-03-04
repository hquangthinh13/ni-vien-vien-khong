import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchActiveActivities } from "../api/activity.api";
import type { Activity } from "../model/activity.types";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { formatFriendlyDate } from "@/shared/lib/utils";
import { getImageUrl } from "@/shared/lib/api";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/shared/ui/dialog";
import DynamicActivityRegistrationForm from "@/features/courseRegistration/ui/DynamicActivityRegistrationForm";
const UpcomingEventCard = async () => {
  const locale = (await getLocale()) as Locale;

  const response = await fetchActiveActivities({
    locale,
    populate: "*",
    sort: ["activityStartDate:asc"],
    pagination: { page: 1, pageSize: 1 },
  });

  const activity: Activity | null = Array.isArray(response?.data)
    ? (response.data[0] ?? null)
    : (response?.data ?? null);

  const documentId = activity?.documentId as string;
  if (!activity)
    return (
      <section className="w-full flex flex-1 max-w-4xl mx-auto">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg text-center font-bold font-serif uppercase">
            {locale === "vi" ? "Sự kiện sắp diễn ra" : "Upcoming Event"}
          </h2>
          <p className="text-center text-secondary-foreground italic">
            {locale === "vi"
              ? "Hiện tại không có sự kiện nào sắp diễn ra."
              : "There are currently no upcoming events."}
          </p>
        </div>
      </section>
    );

  const imageUrl = getImageUrl(activity.coverImage, "medium");

  const startFormatted = formatFriendlyDate(
    activity.activityStartDate,
    locale,
    false,
  );

  const endFormatted = activity.activityEndDate
    ? formatFriendlyDate(activity.activityEndDate, locale, false)
    : null;

  return (
    <section className="w-full flex flex-1 max-w-4xl mx-auto">
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-lg text-center font-bold font-serif uppercase">
          {locale === "vi" ? "Sự kiện sắp diễn ra" : "Upcoming Event"}
        </h2>
        <Link href={`/activity/${activity.documentId}`} className="w-full">
          <Card className="flex flex-col w-full overflow-hidden p-0 gap-0 hover:cursor-pointer hover:transition-transform hover:scale-[1.02] ease-in-out duration-200">
            {/* Image */}
            {imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={activity.activityName}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <CardContent className="flex flex-col gap-2 p-4">
              <h3 className="font-semibold text-card-foreground text-md">
                {activity.activityName}
              </h3>

              <span className="text-sm text-muted-foreground">
                {startFormatted}
                {endFormatted ? ` - ${endFormatted}` : ""}
              </span>
            </CardContent>
          </Card>{" "}
        </Link>
        {activity.registrationForm && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="default"
                className="cursor-pointer w-full uppercase tracking-wider"
              >
                {" "}
                <CirclePlus />
                Đăng ký tham gia
              </Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby="Registration form"
              className="max-h-[90vh] md:min-w-2xl lg:min-w-3xl overflow-y-auto"
            >
              <DialogTitle>Đăng ký tham gia</DialogTitle>
              <DynamicActivityRegistrationForm
                locale={locale}
                documentId={documentId}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventCard;
