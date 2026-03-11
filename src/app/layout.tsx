import type { Metadata } from "next";
import {
  EB_Garamond,
  Oswald,
  Lora,
  Montserrat,
  Merriweather,
  Merriweather_Sans,
} from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/shared/layout/Footer";
import Navbar from "@/shared/layout/Navbar";
import ScrollToTopButton from "@/shared/layout/ScrollToTopButton";
import { Toaster } from "sonner";
import MotionWrapper from "@/shared/motion/MotionWrapper";
import CustomCursor from "@/shared/layout/CustomerCursor";

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
  display: "swap",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin", "vietnamese"],
  variable: "--font-merriweather",
  display: "swap",
});

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-merriweather-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "vietnamese"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ni Viện Viên Không",
    template: "%s | Ni Viện Viên Không",
  },
  description: "Ni Viện Viên Không",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${ebGaramond.variable} ${lora.variable} ${oswald.variable} ${montserrat.variable} ${merriweather.variable} ${merriweatherSans.variable} antialiased`}
    >
      <body className={`min-h-screen bg-white`}>
        <Navbar /> <ScrollToTopButton />
        <NextIntlClientProvider>
          <CustomCursor />
          {children} <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
        <MotionWrapper>
          <Footer />
        </MotionWrapper>
      </body>
    </html>
  );
}
