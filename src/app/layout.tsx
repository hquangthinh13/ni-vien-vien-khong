import type { Metadata } from "next";
import { EB_Garamond, Oswald, Fira_Code } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/shared/layout/Footer";
import Navbar from "@/shared/layout/Navbar";
import ScrollToTopButton from "@/shared/layout/ScrollToTopButton";
import { Toaster } from "sonner";
import MotionWrapper from "@/shared/motion/MotionWrapper";

const ebGaramond = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "vietnamese"],
  variable: "--font-oswald",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ni Viện Viên Không",
  description: "Ni Viện Viên Không",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${ebGaramond.variable} ${oswald.variable} ${firaCode.variable} antialiased`}
    >
      <body className={`min-h-screen bg-white`}>
        <Navbar /> <ScrollToTopButton />
        <NextIntlClientProvider>
          {children} <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
        <MotionWrapper>
          <Footer />
        </MotionWrapper>
      </body>
    </html>
  );
}
