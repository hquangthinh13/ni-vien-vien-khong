import React from "react";
import { cn } from "@/shared/lib/utils";

interface EmbeddedMapProps {
  className?: string;
  iframeTitle?: string;
}

const EmbeddedMap = ({ className, iframeTitle }: EmbeddedMapProps) => {
  return (
    <div
      className={cn(
        "relative w-full min-w-110 md:min-w-140 aspect-video overflow-hidden rounded-xl border-2 border-muted shadow-md group",
        className,
      )}
    >
      {/* <div className="absolute inset-0 bg-foreground/10 pointer-events-none group-hover:bg-transparent transition-colors duration-300 z-10" /> */}
      <iframe
        title={iframeTitle ?? "Google Maps location"}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15689.008920211152!2d107.10686087608339!3d10.55942478716832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31750d3db6a71af7%3A0x2c75faf4e121d284!2zTmkgVmnhu4duIFZpw6puIEtow7RuZyAoVGhlcmF2xIFkYSk!5e0!3m2!1svi!2s!4v1772849824496!5m2!1svi!2s"
        style={{ border: 0 }}
        className="w-full h-full grayscale-75 hover:grayscale-0 transition-all duration-500"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>{" "}
    </div>
  );
};

export default EmbeddedMap;
