
import type { Metadata } from "next";
import "../globals.css";

import Navbar from "@/components/Navbar";
import CallButton from "@/components/CallButton";
import AnimationController from "@/components/AnimationController";
import { getTranslations } from "next-intl/server";
import localFont from "next/font/local";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const spaceGrotesk = localFont({
  src: "../../../public/fonts/SpaceGrotesk-VariableFont_wght.ttf",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const barlow = localFont({
  src: [
    {
      path: "../../../public/fonts/BarlowCondensed-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/BarlowCondensed-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-barlow",
  display: "swap",
});

type LocaleParams = {
  params: Promise<{ locale: string }>;
};

type LayoutProps = LocaleParams & {
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  // Produkcijsku domenu dodat ćemo kasnije
  const siteUrl = process.env.SITE_URL?.replace(/\/+$/, "");

  // Njemački koristi /, ostali jezici /en, /tr...
  const pathname =
    locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    applicationName: "PKW Transport NRW",
    authors: [{ name: "PKW Transport NRW" }],
    creator: "PKW Transport NRW",
    publisher: "PKW Transport NRW",

    robots: {
      index: true,
      follow: true,
    },

    // Canonical dodajemo samo kada imamo domenu
    ...(siteUrl
      ? {
          alternates: {
            canonical: `${siteUrl}${pathname}`,
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "Layout",
  });

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${spaceGrotesk.variable} ${barlow.variable} relative min-h-dvh bg-black text-white`}
      >
        <NextIntlClientProvider>
          <AnimationController>
            <main className="relative z-0 w-full min-h-dvh">
              {children}
            </main>

            <div className="absolute inset-x-0 top-0 z-50 flex flex-col pointer-events-none">
              <div className="pointer-events-auto">
                <Navbar />

                <section className="flex items-center justify-between border-y border-amber-400/50 bg-slate-950/25 px-5 backdrop-blur-md">
                  <span className="text-[9px] font-bold tracking-widest text-amber-500">
                    24/7 &nbsp;&nbsp;&nbsp; ESSEN
                  </span>

                  <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-amber-500">
                    {t("liveTracking")}
                  </span>
                </section>
              </div>

              <CallButton />
            </div>
          </AnimationController>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
