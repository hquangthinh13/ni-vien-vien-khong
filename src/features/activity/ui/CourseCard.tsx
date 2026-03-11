import React from "react";
import { Card, CardContent, CardTitle } from "@/shared/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/features/activity/model/activity.types";
import { getImageUrl } from "@/shared/lib/api";
import { formatFriendlyDate, extractFirstParagraph } from "@/shared/lib/utils";
import type { Locale } from "@/types/locale";

interface CourseCardProps {
  course: Activity;
  locale: Locale;
}
const CourseCard = ({ course, locale }: CourseCardProps) => {
  const {
    slug,
    documentId,
    activityName,
    coverImage,
    content,
    activityStartDate,
  } = course;
  const imageUrl = getImageUrl(coverImage);
  const description = content ? extractFirstParagraph(content) : "";
  return (
    <Link href={`/activity/${slug}-${documentId}`}>
      <Card className="mx-auto w-full h-full flex flex-col py-0 gap-0 hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={coverImage?.alternativeText || activityName || "Activity image"}
          width={600}
          height={400}
          className="aspect-video w-full object-cover"
        />

        <CardContent className="flex flex-1 flex-col p-6 gap-6 justify-between">
          <div className="flex flex-col gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="line-clamp-2">{activityName}</CardTitle>
              </TooltipTrigger>
              <TooltipContent className="">
                <p className="text-center max-w-80 leading-relaxed">
                  {activityName}
                </p>
              </TooltipContent>
            </Tooltip>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs tracking-wider">
              {activityStartDate
                ? formatFriendlyDate(activityStartDate, locale, false)
                : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default CourseCard;
