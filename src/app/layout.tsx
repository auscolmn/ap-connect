import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AP Connect | Australia's Authorised Prescriber Network",
  description: "Find verified psychiatrists authorised to prescribe psilocybin and MDMA for treatment-resistant depression and PTSD. For Australian health professionals.",
  keywords: ["authorised prescriber", "psychedelic therapy", "psilocybin", "MDMA", "TRD", "PTSD", "psychiatrist", "Australia"],
  openGraph: {
    title: "AP Connect | Australia's Authorised Prescriber Network",
    description: "Find verified psychiatrists authorised to prescribe psilocybin and MDMA for treatment-resistant conditions.",
    url: "https://apconnect.com.au",
    siteName: "AP Connect",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakarta.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
