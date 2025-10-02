import type { Metadata } from "next";
import {Raleway} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const raleway = Raleway({subsets: ["latin"],});



export const metadata: Metadata = {
  title: "DISCOVER",
  description: "Explore Places",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.className} antialiased`}
      > 
        <Header />
        {children}
      </body>
    </html>
  );
}