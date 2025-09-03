import type { Metadata } from "next";
import { BRAND_NAME } from '@/config/brand'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from '@/components/AppShell'
import { getAuthUserFromCookies } from '@/lib/auth'
import ThemeClient from '@/components/ThemeClient'
// Root layout renders global styles and fonts. Section layouts handle nav.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: `${BRAND_NAME} app`,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getAuthUserFromCookies()
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}>
        <ThemeClient />
        <AppShell isAuthenticated={!!user}>{children}</AppShell>
      </body>
    </html>
  );
}
