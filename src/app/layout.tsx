import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "BeSpaces - Beforest Internal Knowledge Hub",
  description: "A secure internal portal for Beforest team members to access tools, resources, videos, and shared knowledge.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    apple: { url: '/favicon.png', type: 'image/png' }
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-[#fdfbf7] font-sans antialiased",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
