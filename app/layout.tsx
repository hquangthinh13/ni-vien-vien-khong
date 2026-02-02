import type { Metadata } from "next";
import { EB_Garamond, Oswald, Fira_Code } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ScrollToTopButton from "@/components/shared/ScrollToTopButton";

// type Props = {
//   children: React.ReactNode;
// };

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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
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
      <body className={`min-h-screen flex flex-col bg-white`}>
        <Navbar /> <ScrollToTopButton />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Footer />
      </body>
    </html>
  );
}
