import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./client-providers";
import { APP_NAME } from "@/config/brand";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${APP_NAME} - Find Your Perfect Match`,
  description:
    "Discover meaningful connections with people who share your interests and values. Browse profiles, filter by preferences, and find your perfect match.",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
          {modal}
        </ClientProviders>
      </body>
    </html>
  );
}
