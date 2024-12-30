import Blockchain from "@/context/Blockchain";
import { mulishFont } from "@/fonts/fonts";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZOFI",
  description: "ZOFI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulishFont.variable} font-sans`}>
        <Blockchain>{children}</Blockchain>
      </body>
    </html>
  );
}
