import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "src/components/Nabvar/Nabvar";
import { Footer } from "src/components/Footer";
import SessionAuthProvider from "src/context/SessionAuthProvider";
import Providers  from "../redux/providers";

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
          <Providers>   
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
              <div className="row-start-1 row-end-2">
                <Navbar />
              </div>
              <div className="row-start-2 row-end-3">
                {children}
              </div>
              <div className="row-start-3 row-end-4">
                <Footer />
              </div>
            </div>
          </Providers>
        </SessionAuthProvider>
      </body>
    </html>
  );
}