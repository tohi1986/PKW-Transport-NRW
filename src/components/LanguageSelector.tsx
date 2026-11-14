"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const flags = [
  {
    locale: "de",
    src: "/images/flags/german_flag.svg",
    label: "Deutsch",
  },
  {
    locale: "tr",
    src: "/images/flags/turkish_flag.svg",
    label: "Türkçe",
  },
  {
    locale: "ar",
    src: "/images/flags/arabic_language.svg",
    label: "العربية",
  },
  {
    locale: "pl",
    src: "/images/flags/polish_flag.svg",
    label: "Polski",
  },
  {
    locale: "en",
    src: "/images/flags/uk_flag.svg",
    label: "English",
  },
] as const;

type Locale = (typeof flags)[number]["locale"];

const reelFlags = [...flags, flags[0]];

const flagImageClass = `
  h-4 w-6 rounded-sm object-cover
  shadow-[0_0_10px_rgba(245,158,11,0.3)]
  min-[350px]:h-4.5 min-[350px]:w-6.75
  min-[390px]:h-5 min-[390px]:w-7.5
  sm:h-5.5 sm:w-8.25
  lg:h-6 lg:w-9
`;

const languageLabels: Record<Locale, string> = {
  de: "Sprache auswählen",
  en: "Choose language",
  tr: "Dil seç",
  pl: "Wybierz język",
  ar: "اختر اللغة",
};

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ako je korisnik ručno promijenio jezik,
  // zadrži zastavice mirnima tijekom promjene rute.
  useEffect(() => {
    if (sessionStorage.getItem("skipFlagAnimation") !== "true") {
      return;
    }

    document.documentElement.dataset.skipFlagAnimation = "true";

    sessionStorage.removeItem("skipFlagAnimation");
  }, [locale]);

  const selectedFlag = flags.find((flag) => flag.locale === locale) ?? flags[0];

  const languageLabel = languageLabels[locale as Locale] ?? languageLabels.de;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function changeLanguage(nextLocale: Locale) {
    setIsOpen(false);

    if (nextLocale === locale) return;

    // Zaustavi slot-machine animaciju zastavica.
    sessionStorage.setItem("skipFlagAnimation", "true");

    document.documentElement.setAttribute("data-skip-flag-animation", "true");

    router.replace(pathname, {
      locale: nextLocale,
      scroll: false,
    });
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={languageLabel}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "language-options" : undefined}
        title={languageLabel}
        onClick={() => setIsOpen((previous) => !previous)}
        className="
          group relative flex h-8 w-8 shrink-0
          items-center justify-center
          transition-transform duration-300
          hover:scale-110 active:scale-95
          min-[350px]:h-9 min-[350px]:w-9
          min-[390px]:h-10 min-[390px]:w-10
          sm:h-11 sm:w-11
          lg:h-12 lg:w-12
          motion-reduce:transition-none
        "
      >
        <div className="relative h-full w-full overflow-hidden">
          {/* Zastava trenutno odabranog jezika */}
          <div
            aria-hidden="true"
            className="
              language-selected
              flex h-full w-full items-center justify-center
            "
          >
            <Image
              src={selectedFlag.src}
              alt=""
              width={36}
              height={24}
              unoptimized
              className={flagImageClass}
            />
          </div>

          {/* Postojeća slot-machine animacija */}
          <div
            aria-hidden="true"
            className="
              language-reel
              pointer-events-none
              absolute left-0 top-0
              flex h-full w-full flex-col
            "
          >
            {reelFlags.map((flag, index) => (
              <div
                key={`${flag.locale}-${index}`}
                className="
                  flex h-full w-full shrink-0
                  items-center justify-center
                "
              >
                <Image
                  src={flag.src}
                  alt=""
                  width={36}
                  height={24}
                  unoptimized
                  className={flagImageClass}
                />
              </div>
            ))}
          </div>
        </div>
      </button>

      {/* Izbornik jezika */}
      {isOpen && (
        <div
          id="language-options"
          role="group"
          aria-label={languageLabel}
          className="
            absolute inset-e-0 top-full z-50 mt-2
            min-w-36 rounded-xl
            border border-amber-500/30
            bg-slate-950 p-1 shadow-xl
          "
        >
          {flags.map((flag) => (
            <button
              key={flag.locale}
              type="button"
              lang={flag.locale}
              aria-pressed={locale === flag.locale}
              onClick={() => changeLanguage(flag.locale)}
              className="
                flex w-full items-center gap-3
                rounded-lg px-3 py-2
                text-start text-sm text-white
                transition-colors
                hover:bg-amber-500/15
                focus-visible:outline-2
                focus-visible:outline-amber-500
              "
            >
              <Image
                src={flag.src}
                alt=""
                width={30}
                height={20}
                unoptimized
                className="h-4 w-6 rounded-sm object-cover"
              />

              <span dir="auto">{flag.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
