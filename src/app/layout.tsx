'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { NavigationBar } from "./navigationBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="min-h-screen h-full w-full bg-[#252525]">
      <body
        className={`${inter.variable} w-full h-full bg-[#252525]`}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
