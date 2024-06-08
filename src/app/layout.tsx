import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "src/components/Nabvar/Nabvar";
import { Footer } from "src/components/Footer";
import SessionAuthProvider from "src/context/SessionAuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionAuthProvider>
          <Navbar/>
          {children}
          <Footer/>
        </SessionAuthProvider>
      </body>
    </html>
  );
}