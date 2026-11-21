import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/providers/ToasterProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SalonBook | Book Your Salon Appointment Online",
    template: "%s | SalonBook",
  },
  description:
    "Explore salon services, request appointments online and pay securely with SalonBook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}