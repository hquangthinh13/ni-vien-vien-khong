import React from "react";

const EmbeddedMap = () => {
  return (
    <div className="relative w-full min-w-110 md:min-w-140 aspect-video overflow-hidden rounded-xl border-2 border-muted shadow-md group">
      {/* <div className="absolute inset-0 bg-foreground/10 pointer-events-none group-hover:bg-transparent transition-colors duration-300 z-10" /> */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109170.8107250303!2d106.99130058288571!3d10.55532191952392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31750d98b86d8de7%3A0xaa687b1d80907894!2zVGhp4buBbiB2aeG7h24gVmnDqm4gS2jDtG5n!5e1!3m2!1svi!2s!4v1769680770149!5m2!1svi!2s"
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
