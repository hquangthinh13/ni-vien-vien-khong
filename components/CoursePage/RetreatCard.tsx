"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import { useState } from "react";

interface RetreatCardProps {
  title: string;
  youtubeId: string;
  id: string;
}

const RetreatCard = ({ data }: { data: RetreatCardProps }) => {
  const embedUrl = `https://www.youtube.com/embed/${data.youtubeId}`;
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="retreat-card">
      <Link href={`/blog/${data.id}`}>
        <Card className="mx-auto w-full h-full flex flex-row py-0 gap-0 hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
          <div className="relative aspect-video w-full overflow-hidden bg-slate-200 rounded-lg">
            {!isLoaded && (
              <div className="absolute inset-0 z-10 animate-pulse bg-slate-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 6v12l10-6z" />
                </svg>
              </div>
            )}

            <iframe
              src={embedUrl}
              title={data.title}
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              className={`absolute inset-0 h-full w-full max-w border-0 transition-opacity duration-700 ease-in-out ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <CardContent className="flex flex-1 p-6 gap-6 justify-between">
            <div className="flex flex-col gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="line-clamp-2">{data.title}</CardTitle>
                </TooltipTrigger>
                <TooltipContent className="">
                  <p className="text-center max-w-80 leading-relaxed">
                    {data.title}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default RetreatCard;
