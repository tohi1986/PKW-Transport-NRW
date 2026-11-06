import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";
import CallButton from "@/components/CallButton";

const spaceGrotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk-VariableFont_wght.ttf",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const barlow = localFont({
  src: [
    {
      path: "../../public/fonts/BarlowCondensed-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/BarlowCondensed-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PKW Transport NRW | Abschleppdienst bis 3,5 t",
  description:
    "PKW Transport NRW – Abschleppdienst, Pannenhilfe und Fahrzeugtransport bis 3,5 t in Nordrhein-Westfalen.",
  applicationName: "PKW Transport NRW",
  authors: [{ name: "PKW Transport NRW" }],
  creator: "PKW Transport NRW",
  publisher: "PKW Transport NRW",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${spaceGrotesk.variable} ${barlow.variable} relative min-h-dvh bg-black text-white`}
      >
        <main className="relative z-0 w-full min-h-dvh">
          {children}
        </main>
      
        <div className="absolute inset-x-0 top-0 z-50 flex flex-col pointer-events-none">
          <div className="pointer-events-auto">
            <Navbar />

            <section className="flex items-center justify-between border-y border-amber-500/30 bg-slate-950/25 px-5  backdrop-blur-md">
              <span className="text-[9px] font-bold tracking-widest text-amber-500">
                24/7 &nbsp;&nbsp;&nbsp; ESSEN
              </span>

              <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-amber-500">
                LIVE-FAHRZEUGTRACKING
              </span>


            </section>
          </div>
              <CallButton/>
        </div>
      </body>
    </html>
  );
}