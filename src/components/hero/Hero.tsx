
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./Hero.module.css";

const sloganKeys = ["slogan1", "slogan2", "slogan3"] as const;

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative h-[40svh] min-h-[260px] w-full overflow-hidden md:h-[60svh]"
    >
      <Image
        src="/images/hero.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom scale-[1.4] origin-bottom md:scale-100 md:object-center"
      />

      {/* Dark overlay for readable text */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/85 via-slate-950/25 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-6 md:px-12 md:pt-12">
        <p className="mb-2 text-xs font-bold tracking-widest text-amber-400 md:text-sm">
          PKW TRANSPORT NRW · 24/7
        </p>

        <h1
          id="hero-heading"
          className="max-w-2xl text-2xl font-extrabold leading-tight text-white md:text-4xl"
        >
          {t("heading")}
        </h1>

        {/* Static accessible text for screen readers */}
        <p className="sr-only">{t("slogan1")}</p>

        {/* Animated visual slogans */}
        <div
          className="relative mt-3 h-20 max-w-2xl overflow-hidden text-xl font-bold leading-snug text-amber-400 md:h-24 md:text-3xl"
          aria-hidden="true"
        >
          {sloganKeys.map((key) => (
            <p
              key={key}
              className={`${styles.slogan} absolute inset-0`}
            >
              {t(key)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
