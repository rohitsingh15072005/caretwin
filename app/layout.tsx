import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import MotionProvider from "@/components/ui/MotionProvider";

export const metadata: Metadata = {
  title: {
    default: "CareTwin AI",
    template: "%s · CareTwin AI",
  },
  description:
    "CareTwin AI is a precision healthcare platform: keep every family member's records in one place, get AI guidance and share emergency details in a scan.",
};

export const viewport: Viewport = {
  themeColor: "#0878b8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
