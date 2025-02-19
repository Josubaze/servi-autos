
import { Inter } from "next/font/google";
import { Navbar } from "src/components/Common/Nabvar/Nabvar";
import { Footer } from "src/components/Common/Footer";
import SessionAuthProvider from "src/context/SessionAuthProvider";
import StoreProvider from "./StoreProvider";
import { getServerSession } from "next-auth/next";
import { Suspense } from "react";
import "./globals.css";
import { Disclosure } from "@headlessui/react";
import { LocalizationMuiProvider } from "src/context/LocalizationProvider";
import { knewave } from "src/utils/fonts";
import ToasterProvider from "src/context/ToasterProvider";
import { NextUiProvider } from "src/context/NextUIProvider";
import { SocketProvider } from "src/context/SocketContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ServiAutos Baez",
  description: "App web para la automatización del taller automotriz",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtén la sesión del servidor
  const session = await getServerSession();

  return (
    <html lang="en" className='dark'>
      <body className={inter.className}>
        <SessionAuthProvider session={session}>
          <StoreProvider>
            <SocketProvider>
              <LocalizationMuiProvider>
                <NextUiProvider>
                  <ToasterProvider>
                    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
                      <Suspense fallback={<Disclosure as="nav" className="bg-transparent"></Disclosure>}>
                        <Navbar />
                      </Suspense>
                      <main className={`${knewave.variable}`}>
                        {children}
                      </main>               
                      <Footer />
                    </div>
                  </ToasterProvider>
                </NextUiProvider>
              </LocalizationMuiProvider>
            </SocketProvider>
          </StoreProvider>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
