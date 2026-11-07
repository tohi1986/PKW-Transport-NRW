"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const flags = [
  { src: "/images/flags/german_flag.svg", alt: "Deutsch" },
  { src: "/images/flags/turkish_flag.svg", alt: "Türkçe" },
  { src: "/images/flags/arabic_language.svg", alt: "العربية" },
  { src: "/images/flags/polish_flag.svg", alt: "Polski" },
  { src: "/images/flags/uk_flag.svg", alt: "English" },
];

export default function LanguageSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    flags.forEach((flag) => {
      const img = new window.Image();
      img.src = flag.src;
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let isMounted = true;
    let spinInterval: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const startCycle = () => {
      if (!isMounted) return;

      pauseTimeout = setTimeout(() => {
        if (!isMounted) return;
        setIsSpinning(true);
        let currentStep = 0;

        spinInterval = setInterval(() => {
          if (!isMounted) {
            clearInterval(spinInterval);
            return;
          }

          currentStep++;
          setActiveIndex((prev) => (prev + 1) % flags.length);

          if (currentStep >= flags.length) {
            clearInterval(spinInterval);
            if (!isMounted) return;
            
            setIsSpinning(false);
            setActiveIndex(0);

            startCycle();
          }
        }, 250);
      }, 5000);
    };

    startCycle();

    return () => {
      isMounted = false;
      clearTimeout(pauseTimeout);
      clearInterval(spinInterval);
    };
  }, []);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Sprachauswahl"
        title="Verfügbare Sprachen"
        className="group relative flex h-8 w-8 shrink-0 items-center justify-center p-0 transition-transform duration-300 hover:scale-110 active:scale-95 min-[350px]:h-9 min-[350px]:w-9 min-[390px]:h-10 min-[390px]:w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
      >
        <div className="overflow-hidden flex items-center justify-center relative w-full h-full">
          {flags.map((flag, index) => (
            <div
              key={flag.src}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
                index === activeIndex
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              } ${isSpinning ? "brightness-110" : ""}`}
            >
              <Image
                src={flag.src}
                alt={flag.alt}
                width={36}
                height={24}
                unoptimized
                className="h-4 w-6 rounded-sm object-cover shadow-[0_0_10px_rgba(245,158,11,0.3)] min-[350px]:h-4.5 min-[350px]:w-6.75 min-[390px]:h-5 min-[390px]:w-7.5 sm:h-5.5 sm:w-8.25 lg:h-6 lg:w-9"
              />
            </div>
          ))}
        </div>
      </button>
    </div>
  );
}